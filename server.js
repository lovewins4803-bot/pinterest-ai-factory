const express = require("express");
const app = express();

app.use(express.json());

/* =========================
   MEMORY (PIN QUEUE)
========================= */
let pinQueue = [];

/* =========================
   HOME ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("PIN AI FACTORY v2 RUNNING 🚀");
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
    best_time,
    decision,
    score,
    system: "PIN AI FACTORY v2"
  });
});

/* =========================
   GENERATE PIN → QUEUE SYSTEM
========================= */
app.get("/generate-pin", (req, res) => {

  const pin = {
    id: Date.now(),
    product: "Air Fryer Rack",
    title: "I wish I knew this sooner 😳 Air Fryer Rack",
    status: "QUEUED",
    createdAt: new Date().toISOString()
  };

  pinQueue.push(pin);

  res.json({
    message: "Pin successfully added to queue",
    pin,
    queueSize: pinQueue.length
  });

});

/* =========================
   VIEW QUEUE
========================= */
app.get("/queue", (req, res) => {
  res.json({
    total: pinQueue.length,
    pins: pinQueue
  });
});

/* =========================
   HEALTH CHECK (RENDER)
========================= */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "PIN AI FACTORY v2"
  });
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Pin AI Factory running on port ${PORT}`);
});