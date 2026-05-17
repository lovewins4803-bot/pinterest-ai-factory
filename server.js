const express = require("express");
const app = express();

app.use(express.json());

/* =========================
   MEMORY
========================= */
let pinQueue = [];
let postedPins = [];

/* =========================
   HOME
========================= */
app.get("/", (req, res) => {
  res.send("PIN AI FACTORY v4 TREND ENGINE 🚀");
});

/* =========================
   HEALTH
========================= */
app.get("/health", (req, res) => {
  res.json({ status: "ok", version: "v4-trend-engine" });
});

/* =========================
   TREND ANALYZER CORE
========================= */
function analyzeTrend(product) {

  let base = 50;

  // kitchen products perform better on Pinterest
  if (product.niche === "kitchen") base += 15;

  // aesthetic products go viral faster
  if (product.niche === "aesthetic") base += 20;

  // demand factor
  base += product.demand * 3;

  // randomness simulating market behavior
  base += Math.floor(Math.random() * 10);

  let label = "LOW";
  if (base > 70) label = "HIGH";
  if (base > 85) label = "VIRAL";

  return {
    score: base,
    label,
    suggestion:
      base > 80
        ? "Post immediately with urgency hooks"
        : "Improve image + try later"
  };
}

/* =========================
   DAILY PLAN (WITH TREND AI)
========================= */
app.get("/daily-plan", (req, res) => {

  const products = [
    { name: "Air Fryer Rack", niche: "kitchen", demand: 9 },
    { name: "Fridge Organizer", niche: "home", demand: 8 },
    { name: "Silicone Cooking Set", niche: "kitchen", demand: 7 },
    { name: "Minimalist Desk Lamp", niche: "aesthetic", demand: 9 },
    { name: "Bathroom Storage Rack", niche: "home", demand: 8 }
  ];

  const pick = products[Math.floor(Math.random() * products.length)];

  const trend = analyzeTrend(pick);

  const title = `Stop scrolling 🛑 ${pick.name}`;
  const hashtags = "#amazonfinds #viral #pinterest #usa #trending";
  const best_time = "2 PM Ethiopia (US morning peak)";

  const decision = trend.score >= 75 ? "POST" : "HOLD";

  const image_prompt = `Pinterest aesthetic product photo of ${pick.name}, ultra clean background, soft lighting, viral ecommerce style`;

  res.json({
    product: pick.name,
    niche: pick.niche,
    title,
    hashtags,
    best_time,
    decision,
    trend_score: trend.score,
    trend_label: trend.label,
    suggestion: trend.suggestion,
    image_prompt
  });
});

/* =========================
   QUEUE SYSTEM
========================= */
app.get("/generate-pin", (req, res) => {

  const pin = {
    id: Date.now(),
    product: "Auto Product",
    status: "QUEUED",
    createdAt: new Date().toISOString()
  };

  pinQueue.push(pin);

  res.json({
    message: "queued",
    pin,
    queueSize: pinQueue.length
  });

});

/* =========================
   QUEUE VIEW
========================= */
app.get("/queue", (req, res) => {
  res.json({ total: pinQueue.length, pins: pinQueue });
});

/* =========================
   POSTED
========================= */
app.get("/posted", (req, res) => {
  res.json({ total: postedPins.length, pins: postedPins });
});

/* =========================
   AUTO SCHEDULER
========================= */
setInterval(() => {

  if (pinQueue.length === 0) return;

  const pin = pinQueue.shift();

  pin.status = "POSTED";
  pin.postedAt = new Date().toISOString();

  postedPins.push(pin);

  console.log("POSTED:", pin.id);

}, 60000);

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`PIN AI FACTORY v4 running on port ${PORT}`);
});