// ================================================================
//  models/Startup.js — Mongoose Schema for Startups
// ================================================================

const mongoose = require("mongoose");

const startupSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    sector:       { type: String, required: true },
    desc:         { type: String, required: true },
    funding:      { type: Number, required: true, min: 1 },
    stage:        { type: String, default: "Idea stage",
                    enum: ["Idea stage", "MVP ready", "Early traction", "Growth stage"] },
    founder:      { type: String, default: "Anonymous", trim: true },
    founderEmail: { type: String, default: "", trim: true, lowercase: true },
    interests:    { type: Number, default: 0 },
    website:      { type: String, default: "" },
    location:     { type: String, default: "" },
    teamSize:     { type: Number, default: 1 },
    revenue:      { type: Number, default: 0 },
    featured:     { type: Boolean, default: false },
    tags:         [{ type: String, trim: true }],
    views:        { type: Number, default: 0 },
    status:       { type: String, default: "active",
                    enum: ["active", "funded", "closed"] },
  },
  {
    timestamps: true,    // adds createdAt + updatedAt automatically
    versionKey: false,   // removes __v field from documents
  }
);

// ── Indexes for faster queries ───────────────────────────────────
startupSchema.index({ sector: 1 });
startupSchema.index({ createdAt: -1 });
startupSchema.index({ interests: -1 });
startupSchema.index({ featured: 1 });

// ── Virtual: formatted funding string ───────────────────────────
startupSchema.virtual("fundingFormatted").get(function () {
  return `₹${this.funding}L`;
});

module.exports = mongoose.model("Startup", startupSchema);
