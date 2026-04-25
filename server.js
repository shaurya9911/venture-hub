// ================================================================
//  server.js — VentureHub Backend (MongoDB Atlas Edition)
//
//  HOW TO RUN
//  ----------
//  Step 1 → npm install
//  Step 2 → Copy .env.example to .env and fill in your Atlas URI
//  Step 3 → node database/seed.js   (optional: seed sample data)
//  Step 4 → node server.js
//  Step 5 → Open http://localhost:3000
//
//  FOLDER STRUCTURE
//  ----------------
//  venturehub/
//  ├── server.js                ← entry point
//  ├── .env                     ← your secrets (not committed to git)
//  ├── .env.example             ← template
//  ├── package.json
//  │
//  ├── database/
//  │   ├── connection.js        ← MongoDB Atlas connection logic
//  │   └── seed.js              ← seed script for sample data
//  │
//  ├── models/
//  │   ├── Startup.js           ← Mongoose schema for startups
//  │   ├── Investor.js          ← Mongoose schema for investors
//  │   └── Message.js           ← Mongoose schema for messages
//  │
//  ├── routes/
//  │   ├── startups.js          ← /api/startups routes
//  │   └── investors.js         ← /api/investors + /api/messages routes
//  │
//  └── public/
//      ├── index.html
//      ├── style.css
//      └── app.js
//
//  API ENDPOINTS
//  -------------
//  GET    /api/startups               → list all startups
//  GET    /api/startups/stats         → aggregate stats
//  GET    /api/startups/:id           → single startup (+ increments views)
//  POST   /api/startups               → create startup
//  PATCH  /api/startups/:id/interest  → toggle interest
//  DELETE /api/startups/:id           → delete startup
//
//  GET    /api/investors              → list investors
//  POST   /api/investors              → register investor
//
//  POST   /api/messages               → send contact message
//  GET    /api/messages/:startupId    → get messages for a startup
// ================================================================

require("dotenv").config();

const express  = require("express");
const cors     = require("cors");
const path     = require("path");

const { connectDB }                      = require("./database/connection");
const startupRoutes                      = require("./routes/startups");
const { investorRouter, messageRouter }  = require("./routes/investors");

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ── API Routes ───────────────────────────────────────────────────
app.use("/api/startups", startupRoutes);
app.use("/api/investors", investorRouter);
app.use("/api/messages",  messageRouter);

// ── Health check ─────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Catch-all: serve frontend for any non-API route ─────────────
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ── Connect DB then start server ─────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀  VentureHub running at http://localhost:${PORT}`);
    console.log(`📡  API at http://localhost:${PORT}/api/startups\n`);
  });
});
