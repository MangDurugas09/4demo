const path = require("path");
const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

require("dotenv").config({ path: path.join(__dirname, "config.env") });

const app = express();

app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "ngrok-skip-browser-warning"],
  credentials: true,
}));

app.use(express.json());

const uri = process.env.ATLAS_URI;

if (!uri) {
  throw new Error("ATLAS_URI is missing. Check DEMO/ecommerse_v2/server/config.env.");
}

const client = new MongoClient(uri);

let db;

const defaultUsageTips = [
  "Use LED bulbs to save up to 75% energy",
  "Set AC temperature to 24-26C",
  "Unplug devices when not in use",
  "Use appliances during off-peak hours",
];

function buildUserIdQuery(userId) {
  if (ObjectId.isValid(userId) && String(new ObjectId(userId)) === userId) {
    return { _id: new ObjectId(userId) };
  }

  return { _id: userId };
}

function createSeedData(user) {
  const displayName = user.name || user.username || "Customer";
  const accountNumber = user.accountNumber || `ACC-${String(user._id).padStart(4, "0")}`.slice(0, 15);

  return {
    usage: {
      weekly: [
        { day: "Mon", usage: 8.5, unit: "kWh" },
        { day: "Tue", usage: 9.2, unit: "kWh" },
        { day: "Wed", usage: 7.8, unit: "kWh" },
        { day: "Thu", usage: 10.1, unit: "kWh" },
        { day: "Fri", usage: 11.5, unit: "kWh" },
        { day: "Sat", usage: 13.2, unit: "kWh" },
        { day: "Sun", usage: 14.8, unit: "kWh" },
      ],
      monthly: [
        { month: "November", usage: 210, cost: 2100 },
        { month: "December", usage: 195, cost: 1950 },
        { month: "January", usage: 245, cost: 2205 },
        { month: "February", usage: 198, cost: 1782 },
        { month: "March (Current)", usage: 245, cost: 2450 },
      ],
      tips: defaultUsageTips,
    },
    payments: {
      currentBill: {
        amount: 2450,
        dueDate: "March 15, 2026",
        status: "Unpaid",
        accountNumber,
        qrData: `PAYMENT-${accountNumber}-${displayName.replace(/\s+/g, "-").toUpperCase()}`,
      },
      history: [
        { id: "pay-2026-02", date: "Feb 01, 2026", amount: 1782, status: "Completed", method: "GCash" },
        { id: "pay-2026-01", date: "Jan 05, 2026", amount: 2205, status: "Completed", method: "Maya" },
        { id: "pay-2025-12", date: "Dec 02, 2025", amount: 1950, status: "Completed", method: "Online Banking" },
      ],
      latestReceipt: null,
    },
  };
}

function normalizeUserProfile(user) {
  return {
    ...user,
    name: user.name || user.username || "",
    address: user.address || user.Address || "",
    contact: user.contact || user.contactNumber || "",
    avatar: user.avatar || user.profilePic || "https://www.pngmart.com/files/23/Profile-PNG-Photo.png",
  };
}

function buildUsageSummary(weekly) {
  const totalUsage = weekly.reduce((sum, item) => sum + Number(item.usage || 0), 0);
  const peakDay = weekly.reduce((max, item) => (item.usage > max.usage ? item : max), weekly[0]);
  const lowDay = weekly.reduce((min, item) => (item.usage < min.usage ? item : min), weekly[0]);

  return {
    totalUsage: Number(totalUsage.toFixed(1)),
    dailyAverage: Number((totalUsage / weekly.length).toFixed(1)),
    peakDay,
    lowDay,
  };
}

async function seedUsers() {
  const users = await db.collection("users").find().toArray();

  for (const user of users) {
    const seedData = createSeedData(user);
    const updateData = {};

    if (!user.usage) updateData.usage = seedData.usage;
    if (!user.payments) updateData.payments = seedData.payments;
    if (!user.accountNumber) updateData.accountNumber = seedData.payments.currentBill.accountNumber;

    const normalizedFields = normalizeUserProfile(user);
    if (!user.name && normalizedFields.name) updateData.name = normalizedFields.name;
    if (!user.address && normalizedFields.address) updateData.address = normalizedFields.address;
    if (!user.contact && normalizedFields.contact) updateData.contact = normalizedFields.contact;
    if (!user.avatar && normalizedFields.avatar) updateData.avatar = normalizedFields.avatar;

    if (Object.keys(updateData).length > 0) {
      await db.collection("users").updateOne(buildUserIdQuery(String(user._id)), { $set: updateData });
    }
  }
}

async function createAccountNumber() {
  const totalUsers = await db.collection("users").countDocuments();
  return `ACC-${String(totalUsers + 1).padStart(4, "0")}`;
}

async function createUserDocument(payload) {
  const accountNumber = await createAccountNumber();
  const baseUser = {
    _id: `USR${Date.now()}`,
    username: payload.username.trim(),
    password: payload.password,
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    contact: payload.contact.trim(),
    address: payload.address.trim(),
    avatar: "https://www.pngmart.com/files/23/Profile-PNG-Photo.png",
    accountNumber,
  };

  const seedData = createSeedData(baseUser);

  return {
    ...baseUser,
    usage: seedData.usage,
    payments: {
      ...seedData.payments,
      currentBill: {
        ...seedData.payments.currentBill,
        accountNumber,
        qrData: `PAYMENT-${accountNumber}-${baseUser.name.replace(/\s+/g, "-").toUpperCase()}`,
      },
    },
  };
}

async function connectDB() {
  try {
    await client.connect();
    db = client.db("database_electripay");
    await seedUsers();
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}

connectDB();

app.use((req, res, next) => {
  if (!db) {
    return res.status(503).json({ error: "Database connection is not ready yet" });
  }

  next();
});

app.post("/signup", async (req, res) => {
  try {
    const { username, password, name, email, contact, address } = req.body;

    if (!username || !password || !name || !email || !contact || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await db.collection("users").findOne({
      $or: [{ username: username.trim() }, { email: email.trim().toLowerCase() }],
    });

    if (existingUser) {
      return res.status(409).json({ message: "Username or email already exists" });
    }

    const newUser = await createUserDocument({ username, password, name, email, contact, address });
    await db.collection("users").insertOne(newUser);

    res.status(201).json({
      message: "Account created successfully",
      user: normalizeUserProfile(newUser),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.collection("users").findOne({ username, password });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful", user: normalizeUserProfile(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/auth/forgot-password", async (req, res) => {
  try {
    const { username, email, contact, newPassword } = req.body;

    if (!username || !email || !contact || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await db.collection("users").findOneAndUpdate(
      {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        contact: contact.trim(),
      },
      { $set: { password: newPassword } },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ message: "Account details did not match any user" });
    }

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/users/:id/change-password", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    const user = await db.collection("users").findOne(buildUserIdQuery(req.params.id));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== currentPassword) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    await db.collection("users").updateOne(
      buildUserIdQuery(req.params.id),
      { $set: { password: newPassword } }
    );

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await db.collection("users").find().toArray();
    res.json(users.map(normalizeUserProfile));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/stats/summary", async (req, res) => {
  try {
    const totalUsers = await db.collection("users").countDocuments();
    const pendingPayments = await db.collection("users").countDocuments({
      "payments.currentBill.status": "Pending Verification",
    });

    res.json({ totalUsers, pendingPayments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await db.collection("users").findOne(buildUserIdQuery(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(normalizeUserProfile(user));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const result = await db.collection("users").updateOne(
      buildUserIdQuery(req.params.id),
      { $set: req.body }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/users/:id/usage", async (req, res) => {
  try {
    const user = await db.collection("users").findOne(buildUserIdQuery(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });

    const usage = user.usage || createSeedData(user).usage;
    res.json({
      weekly: usage.weekly,
      monthly: usage.monthly,
      tips: usage.tips || defaultUsageTips,
      summary: buildUsageSummary(usage.weekly),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/users/:id/payments", async (req, res) => {
  try {
    const user = await db.collection("users").findOne(buildUserIdQuery(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });

    const payments = user.payments || createSeedData(user).payments;
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/users/:id/payments/receipt", async (req, res) => {
  try {
    const { receiptUri } = req.body;
    if (!receiptUri) return res.status(400).json({ message: "receiptUri is required" });

    const user = await db.collection("users").findOne(buildUserIdQuery(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });

    const payments = user.payments || createSeedData(user).payments;
    const pendingPayment = {
      id: `pay-${Date.now()}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      amount: payments.currentBill.amount,
      status: "Pending Verification",
      method: "Receipt Upload",
      receiptUri,
    };

    const updatedPayments = {
      ...payments,
      latestReceipt: receiptUri,
      currentBill: {
        ...payments.currentBill,
        status: "Pending Verification",
      },
      history: [pendingPayment, ...(payments.history || [])],
    };

    await db.collection("users").updateOne(
      buildUserIdQuery(req.params.id),
      { $set: { payments: updatedPayments } }
    );

    res.json({ message: "Receipt submitted successfully", payments: updatedPayments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/health", (req, res) => {
  res.json({ ok: true, dbConnected: Boolean(db) });
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});
