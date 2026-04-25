// ================================================================
//  models/Message.js — Contact messages between investors & founders
// ================================================================

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    startupId:   { type: mongoose.Schema.Types.ObjectId, ref: "Startup" },
    senderName:  { type: String, required: true, trim: true },
    senderEmail: { type: String, required: true, trim: true, lowercase: true },
    senderRole:  { type: String, enum: ["investor", "founder", "other"], default: "investor" },
    message:     { type: String, required: true },
    read:        { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Message", messageSchema);
