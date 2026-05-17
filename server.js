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
  res.send("PIN AI FACTORY v3 DASHBOARD MODE 🚀");
});

/* =========================
   HEALTH
========================= */
app.get("/health", (req, res) => {
  res.json({ status: "ok", version: "v3-dashboard" });
});

/* =========================
   DAILY PLAN ENGINE
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

  let score = 35 + (pick.demand * 5);

  const title = `Trending now 🔥 ${pick.name}`;
  const hashtags = "#amazonfinds #viral #pinterest #usa #affiliatemarketing";
  const best_time = "2 PM Ethiopia (US morning peak)";
  const decision = score >= 75 ? "POST" : "HOLD";

  res.json({
    product: pick.name,
    niche: pick.niche,
    title,
    hashtags,
    best_time,
    decision,
    score
  });
});

/* =========================
   GENERATE PIN
========================= */
app.get("/generate-pin", (req, res) => {

  const pin = {
    id: Date.now(),
    product: "Auto Product",
    title: "Generated Pinterest Pin",
    status: "QUEUED",
    createdAt: new Date().toISOString()
  };

  pinQueue.push(pin);

  res.json({
    message: "Pin added",
    pin,
    queueSize: pinQueue.length
  });

});

/* =========================
   QUEUE
========================= */
app.get("/queue", (req, res) => {
  res.json({
    total: pinQueue.length,
    pins: pinQueue
  });
});

/* =========================
   POSTED
========================= */
app.get("/posted", (req, res) => {
  res.json({
    total: postedPins.length,
    pins: postedPins
  });
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

  console.log("AUTO POSTED:", pin.id);

}, 60000);

/* =========================
   📱 DASHBOARD (NEW CONTROL CENTER)
========================= */
app.get("/dashboard", (req, res) => {

  const dashboard = {
    summary: {
      queued: pinQueue.length,
      posted: postedPins.length,
      system: "ACTIVE"
    },
    quickActions: [
      "/generate-pin",
      "/queue",
      "/posted",
      "/daily-plan"
    ],
    recommendation: pinQueue.length === 0
      ? "Generate new pins"
      : "You have pending pins to process"
  };

  res.json(dashboard);
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Pin AI Factory v3 Dashboard running on port ${PORT}`);
});