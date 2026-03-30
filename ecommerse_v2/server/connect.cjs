const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config({ path: "./config.env" });

const app = express();

// enable CORS for frontend & mobile clients
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
}));

app.use(express.json());

const uri = process.env.ATLAS_URI;
const client = new MongoClient(uri);

let db;

// connect once
async function connectDB() {
  try {
    await client.connect();
    db = client.db("database_electripay");
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error(err);
  }
}

connectDB();


// =======================
// 🔐 LOGIN API
// =======================
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.collection("users").findOne({
      username,
      password,
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =======================
// 📦 GET USERS
// =======================
app.get("/users", async (req, res) => {
  try {
    const users = await db.collection("users").find().toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// 👤 GET USER PROFILE BY ID
// =======================
app.get("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// ✏️ UPDATE USER PROFILE
// =======================
app.put("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =======================
// 🚀 START SERVER
// =======================
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});