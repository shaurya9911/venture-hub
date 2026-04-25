// ================================================================
//  models/Investor.js — Mongoose Schema for Investors
// ================================================================

const mongoose = require("mongoose");

const investorSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    firm:     { type: String, default: "Independent Angel", trim: true },
    bio:      { type: String, default: "" },
    focus:    [{ type: String }],           // sectors they invest in
    ticket:   { type: String, default: "10-50L" },  // investment range
    verified: { type: Boolean, default: false },
    email:    { type: String, default: "", lowercase: true },
    linkedin: { type: String, default: "" },
    portfolio: [{ type: String }],          // startup names they've backed
    totalInvested: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Investor", investorSchema);
