// ================================================================
//  routes/investors.js — Investor endpoints
// ================================================================

const express  = require("express");
const router   = express.Router();
const Investor = require("../models/Investor");

router.get("/", async (req, res) => {
  try {
    const investors = await Investor.find().sort({ verified: -1, createdAt: -1 });
    res.json({ success: true, data: investors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, firm, bio, focus, ticket, email, linkedin } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Name required" });
    const inv = new Investor({ name, firm, bio, focus, ticket, email, linkedin });
    const saved = await inv.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;


// ================================================================
//  Attach messages router — routes/messages.js (inline for brevity)
// ================================================================

const Message = require("../models/Message");
const msgRouter = express.Router();

msgRouter.post("/", async (req, res) => {
  try {
    const { startupId, senderName, senderEmail, senderRole, message } = req.body;
    if (!senderName || !senderEmail || !message) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }
    const msg  = new Message({ startupId, senderName, senderEmail, senderRole, message });
    const saved = await msg.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

msgRouter.get("/:startupId", async (req, res) => {
  try {
    const messages = await Message.find({ startupId: req.params.startupId }).sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = { investorRouter: router, messageRouter: msgRouter };
