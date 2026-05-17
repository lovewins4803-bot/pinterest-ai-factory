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
  res.send("PIN AI FACTORY v3 HYBRID MODE 🚀");
});

/* =========================
   HEALTH
========================= */
app.get("/health", (req, res) => {
  res.json({ status: "ok", version: "v3" });
});

/* =========================
   DAILY PLAN ENGINE (IMPROVED)
========================= */
app.get("/daily-plan", (req, res) => {

  const products = [
    { name: "Air Fryer Rack", niche: "kitchen", demand: 9 },
    { name: "Fridge Organizer", niche: "home", demand: 8 },
    { name: "Silicone Cooking Set", niche: "kitchen", demand: 7 },
    { name: "Bathroom Storage Rack", niche: "home", demand: 8 },
    { name: "Minimalist Desk Lamp", niche: "aesthetic", demand: 9 }
  ];

  const pick = products[Math.floor(Math.random() * products.length)];

  let score = 35 + (pick.demand * 5);

  if (pick.niche === "aesthetic") score += 10;
  if (pick.niche === "kitchen") score += 8;

  const titlePool = [
    `I wish I knew this sooner 😳 ${pick.name}`,
    `Stop scrolling 🛑 ${pick.name}`,
    `This is trending in the US 🔥 ${pick.name}`,
    `Amazon hidden gem 💡 ${pick.name}`
  ];

  const title = titlePool[Math.floor(Math.random() * titlePool.length)];

  const hashtags = "#amazonfinds #viral #pinterest #usa #trending #affiliatemarketing";

  const best_time = "2 PM Ethiopia (US morning peak)";

  const decision = score >= 75 ? "POST" : "HOLD";

  const image_prompt = `High quality Pinterest aesthetic product image of ${pick.name}, clean background, soft lighting, viral style, ultra realistic, ecommerce photography`;

  const board_suggestion = pick.niche === "kitchen" ? "Kitchen Must Haves" : "Home Essentials";

  res.json({
    product: pick.name,
    niche: pick.niche,
    title,
    hashtags,
    best_time,
    decision,
    score,
    image_prompt,
    board_suggestion
  });
});

/* =========================
   GENERATE PIN (AUTO QUEUE)
========================= */
app.get("/generate-pin", (req, res) => {

  const pin = {
    id: Date.now(),
    product: "Air Fryer Rack",
    title: "I wish I knew this sooner 😳 Air Fryer Rack",
    status: "QUEUED",
    mode: "AUTO",
    createdAt: new Date().toISOString()
  };

  pinQueue.push(pin);

  res.json({
    message: "Pin queued successfully",
    pin,
    queueSize: pinQueue.length
  });

});

/* =========================
   MANUAL PIN CREATION
========================= */
app.post("/manual-pin", (req, res) => {

  const { product, title } = req.body;

  const pin = {
    id: Date.now(),
    product: product || "Custom Product",
    title: title || "Custom Title",
    status: "QUEUED",
    mode: "MANUAL",
    createdAt: new Date().toISOString()
  };

  pinQueue.push(pin);

  res.json({
    message: "Manual pin added",
    pin,
    queueSize: pinQueue.length
  });

});

/* =========================
   EXPORT MODE (PINTEREST READY PACK)
========================= */
app.get("/export-pin", (req, res) => {

  const exportPack = {
    title: "Pinterest Ready Pack",
    description: "Copy-paste ready affiliate content",
    product: "Sample Product",
    hashtags: "#amazonfinds #viral #pinterest #usa",
    image_prompt: "Pinterest aesthetic product photography, clean background, viral style",
    board: "Recommended Board",
    best_time: "2 PM Ethiopia (US peak)"
  };

  res.json(exportPack);
});

/* =========================
   QUEUE VIEW
========================= */
app.get("/queue", (req, res) => {
  res.json({
    total: pinQueue.length,
    pins: pinQueue
  });
});

/* =========================
   POSTED PINS
========================= */
app.get("/posted", (req, res) => {
  res.json({
    total: postedPins.length,
    pins: postedPins
  });
});

/* =========================
   AUTO SCHEDULER ENGINE
========================= */
setInterval(() => {

  if (pinQueue.length === 0) return;

  const pin = pinQueue.shift();

  pin.status = "POSTED";
  pin.postedAt = new Date().toISOString();

  postedPins.push(pin);

  console.log("AUTO POSTED:", pin.id);

}, 60000); // 60 sec test mode

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Pin AI Factory v3 running on port ${PORT}`);
});