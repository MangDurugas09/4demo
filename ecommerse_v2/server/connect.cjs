const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./config.env" });

const app = express();
app.use(cors());
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
// 🚀 START SERVER
// =======================
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});