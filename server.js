const express = require("express");
const app = express();

app.use(express.json());

/* =========================
   MEMORY STORAGE
========================= */
let pinQueue = [];
let postedPins = [];

/* =========================
   HOME
========================= */
app.get("/", (req, res) => {
  res.send("PIN AI FACTORY v2 RUNNING 🚀");
});

/* =========================
   HEALTH CHECK
========================= */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "PIN AI FACTORY v2"
  });
});

/* =========================
   DAILY PLAN ENGINE
========================= */
app.get("/daily-plan", (req, res) => {

  const products = [
    { name: "Air Fryer Rack", niche: "kitchen", demand: 9 },
    { name: "Fridge Organizer", niche: "home", demand: 8 },
    { name: "Silicone Cooking Set", niche: "kitchen", demand: 7 },
    { name: "Bathroom Storage Rack", niche: "home", demand: 8 },
    { name: "Non-Slip Kitchen Mat", niche: "home", demand: 6 }
  ];

  const pick = products[Math.floor(Math.random() * products.length)];

  let score = 40;
  score += pick.demand * 4;

  if (pick.niche === "kitchen") score += 10;
  if (pick.niche === "home") score += 8;

  const titles = [
    `I wish I knew this sooner 😳 ${pick.name}`,
    `Stop scrolling 🛑 ${pick.name}`,
    `Trending Pinterest find 🔥 ${pick.name}`,
    `Amazon hidden gem 💡 ${pick.name}`
  ];

  const title = titles[Math.floor(Math.random() * titles.length)];

  const hashtags = "#amazonfinds #viral #pinterest #usa #affiliatemarketing";
  const best_time = "2 PM Ethiopia (US morning peak)";
  const decision = score >= 70 ? "POST" : "SKIP";

  res.json({
    product: pick.name,
    niche: pick.niche,
    title,
    hashtags,