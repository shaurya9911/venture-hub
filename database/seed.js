// ================================================================
//  database/seed.js — Seed the MongoDB Atlas database
//
//  HOW TO RUN:
//  node database/seed.js
//
//  This will wipe the startups + investors collections and
//  insert fresh sample data — useful for development / demos.
// ================================================================

require("dotenv").config();
const { connectDB, disconnectDB } = require("./connection");
const Startup  = require("../models/Startup");
const Investor = require("../models/Investor");
const Message  = require("../models/Message");

const STARTUPS = [
  {
    name: "AgroSense AI",
    sector: "AgriTech",
    stage: "MVP ready",
    founder: "Ravi Kumar",
    founderEmail: "ravi@agrosense.ai",
    funding: 50,
    interests: 3,
    desc: "AI-powered crop disease detection using mobile cameras. Farmers photograph leaves and get instant diagnosis with treatment suggestions, reducing crop loss by up to 40%.",
    website: "https://agrosense.ai",
    location: "Pune, Maharashtra",
    teamSize: 6,
    revenue: 0,
    featured: true,
    tags: ["AI", "Farming", "Mobile"],
  },
  {
    name: "SkillBridge",
    sector: "EdTech",
    stage: "Early traction",
    founder: "Priya Nair",
    founderEmail: "priya@skillbridge.in",
    funding: 30,
    interests: 7,
    desc: "Vernacular-language micro-learning platform for rural students. Bite-sized 5-minute lessons aligned with NCERT curriculum, accessible on basic Android phones with low bandwidth.",
    website: "https://skillbridge.in",
    location: "Kochi, Kerala",
    teamSize: 4,
    revenue: 120000,
    featured: false,
    tags: ["Education", "Rural", "Vernacular"],
  },
  {
    name: "PayEase",
    sector: "FinTech",
    stage: "Growth stage",
    founder: "Arjun Shah",
    founderEmail: "arjun@payease.io",
    funding: 80,
    interests: 12,
    desc: "UPI-based BNPL for kirana stores. Merchants get instant credit lines and customers get flexible payment options without formal banking history.",
    website: "https://payease.io",
    location: "Mumbai, Maharashtra",
    teamSize: 12,
    revenue: 850000,
    featured: true,
    tags: ["UPI", "BNPL", "Kirana"],
  },
  {
    name: "MediTrack",
    sector: "HealthTech",
    stage: "Idea stage",
    founder: "Dr. Sneha Rao",
    founderEmail: "sneha@meditrack.health",
    funding: 40,
    interests: 5,
    desc: "Digital health records system for rural clinics. Enables doctors to maintain patient history on mobile devices, with offline support and regional language interface.",
    website: "",
    location: "Hyderabad, Telangana",
    teamSize: 3,
    revenue: 0,
    featured: false,
    tags: ["Health Records", "Rural", "Offline-first"],
  },
  {
    name: "GreenFleet",
    sector: "CleanTech",
    stage: "MVP ready",
    founder: "Vikram Desai",
    founderEmail: "vikram@greenfleet.ev",
    funding: 120,
    interests: 9,
    desc: "EV fleet management SaaS for last-mile delivery companies. Route optimization + battery health monitoring reduces operational costs by 35%.",
    website: "https://greenfleet.ev",
    location: "Bengaluru, Karnataka",
    teamSize: 8,
    revenue: 200000,
    featured: true,
    tags: ["EV", "Fleet", "SaaS"],
  },
];

const INVESTORS = [
  { name: "Meera Kapoor", firm: "Bharat Ventures", focus: ["AgriTech", "HealthTech"], ticket: "10-50L", verified: true },
  { name: "Sandeep Joshi", firm: "Delta Peak Capital", focus: ["FinTech", "AI / ML"], ticket: "50-200L", verified: true },
  { name: "Ananya Singh", firm: "Angel Network India", focus: ["EdTech", "CleanTech"], ticket: "5-25L", verified: false },
];

async function seed() {
  await connectDB();

  console.log("\n🌱  Seeding database...\n");

  // Clear existing data
  await Startup.deleteMany({});
  await Investor.deleteMany({});
  await Message.deleteMany({});
  console.log("🗑️   Cleared existing data");

  // Insert startups
  const insertedStartups = await Startup.insertMany(STARTUPS);
  console.log(`✅  Inserted ${insertedStartups.length} startups`);

  // Insert investors
  const insertedInvestors = await Investor.insertMany(INVESTORS);
  console.log(`✅  Inserted ${insertedInvestors.length} investors`);

  console.log("\n🎉  Seed complete!\n");

  await disconnectDB();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
