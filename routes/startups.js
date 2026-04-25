// ================================================================
//  routes/startups.js — All /api/startups endpoints
// ================================================================

const express = require("express");
const router  = express.Router();
const Startup = require("../models/Startup");

// GET /api/startups — get all (with optional sector filter + search)
router.get("/", async (req, res) => {
  try {
    const { sector, search, sort = "newest", featured } = req.query;
    const query = { status: "active" };

    if (sector && sector !== "All") query.sector = sector;
    if (featured === "true") query.featured = true;
    if (search) {
      query.$or = [
        { name:   { $regex: search, $options: "i" } },
        { desc:   { $regex: search, $options: "i" } },
        { sector: { $regex: search, $options: "i" } },
        { tags:   { $regex: search, $options: "i" } },
      ];
    }

    const sortMap = {
      newest:    { createdAt: -1 },
      popular:   { interests: -1 },
      funding:   { funding: -1 },
    };

    const startups = await Startup.find(query).sort(sortMap[sort] || sortMap.newest);
    res.json({ success: true, data: startups, count: startups.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/startups/stats — aggregate dashboard stats
router.get("/stats", async (req, res) => {
  try {
    const [stats] = await Startup.aggregate([
      { $match: { status: "active" } },
      {
        $group: {
          _id: null,
          totalStartups:  { $sum: 1 },
          totalInterests: { $sum: "$interests" },
          totalFunding:   { $sum: "$funding" },
          totalViews:     { $sum: "$views" },
          avgFunding:     { $avg: "$funding" },
        },
      },
    ]);

    const sectorBreakdown = await Startup.aggregate([
      { $match: { status: "active" } },
      { $group: { _id: "$sector", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const stageBreakdown = await Startup.aggregate([
      { $match: { status: "active" } },
      { $group: { _id: "$stage", count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: { ...stats, sectorBreakdown, stageBreakdown },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/startups/:id — single startup
router.get("/:id", async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) return res.status(404).json({ success: false, message: "Not found" });

    // Increment view count
    startup.views += 1;
    await startup.save();

    res.json({ success: true, data: startup });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/startups — create new startup
router.post("/", async (req, res) => {
  try {
    const { name, sector, desc, funding, stage, founder, founderEmail, website, location, teamSize, tags } = req.body;
    if (!name || !sector || !desc || !funding) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const startup = new Startup({ name, sector, desc, funding, stage, founder, founderEmail, website, location, teamSize, tags });
    const saved   = await startup.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/startups/:id/interest — toggle interest
router.patch("/:id/interest", async (req, res) => {
  try {
    const increment = req.body.action === "remove" ? -1 : 1;
    const updated   = await Startup.findByIdAndUpdate(
      req.params.id,
      { $inc: { interests: increment } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/startups/:id — delete startup
router.delete("/:id", async (req, res) => {
  try {
    await Startup.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Startup deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
