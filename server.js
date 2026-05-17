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
  res.send("PIN AI FACTORY v2 RUNNING 🚀");
});

/* =========================
   HEALTH
========================= */
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

/* =========================
   DAILY PLAN
========================= */
app.get("/daily-plan", (req, res) => {

  const products = [
    { name: "Air Fryer Rack", niche: "kitchen", demand: 9 },
    { name: "Fridge Organizer", niche: "home", demand: 8 },
    { name: "Silicone Cooking Set", niche: "kitchen", demand: 7 }
  ];

  const pick = products[Math.floor(Math.random() * products.length)];

  let score = 40 + (pick.demand * 4);

  const title = `Trending now 🔥 ${pick.name}`;
  const hashtags = "#amazonfinds #pinterest #viral";
  const best_time = "2 PM Ethiopia (US peak)";
  const decision = score > 70 ? "POST" : "SKIP";

  res.json({
    product: pick.name,
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
    product: "Air Fryer Rack",
    status: "QUEUED"
  };

  pinQueue.push(pin);

  res.json({
    message: "added",
    pin,
    queueSize: pinQueue.length
  });

});

/* =========================
   QUEUE
========================= */
app.get("/queue", (req, res) => {
  res.json(pinQueue);
});

/* =========================
   POSTED
========================= */
app.get("/posted", (req, res) => {
  res.json(postedPins);
});

/* =========================
   AUTO PROCESSOR
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
  console.log("Server running on port " + PORT);
});