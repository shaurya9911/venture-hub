// ================================================================
//  database/connection.js — MongoDB Local Connection
//  Connects to your local MongoDB running on localhost:27017
//  (visible in MongoDB Compass as localhost:27017 > venturehub)
// ================================================================

const mongoose = require("mongoose");

// ── Local MongoDB URI ────────────────────────────────────────────
//  Uses local MongoDB by default (what you see in Compass).
//  To switch to Atlas later, set MONGODB_URI in your .env file.
const MONGODB_URI = process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/venturehub";

// ── Connection Options ───────────────────────────────────────────
const options = {
  // Connection pool — max simultaneous connections to Atlas
  maxPoolSize: 10,

  // How long to wait for initial connection (ms)
  serverSelectionTimeoutMS: 5000,

  // How long an idle connection stays open (ms)
  socketTimeoutMS: 45000,
};

// ── Connect Function ─────────────────────────────────────────────
async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGODB_URI, options);

    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
    console.log(`📦  Database: ${conn.connection.name}`);

    // ── Connection Events ────────────────────────────────────────
    mongoose.connection.on("error", (err) => {
      console.error("❌  MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️   MongoDB disconnected. Attempting reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("🔄  MongoDB reconnected successfully");
    });

    return conn;
  } catch (err) {
    console.error("❌  Failed to connect to MongoDB:", err.message);
    console.error("\n📋  FIX:");
    console.error("   Make sure MongoDB is running:  mongod");
    console.error("   Or check it's running in Compass (localhost:27017)\n");

    // Graceful shutdown on connection failure
    process.exit(1);
  }
}

// ── Disconnect Function (for tests / graceful shutdown) ──────────
async function disconnectDB() {
  await mongoose.connection.close();
  console.log("🔌  MongoDB connection closed");
}

module.exports = { connectDB, disconnectDB };
