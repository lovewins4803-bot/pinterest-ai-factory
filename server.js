const express = require("express");
const app = express();
app.use(express.json());

/* =========================
   MEMORY SYSTEM
========================= */
let pinQueue = [];
let postedPins = [];

/* =========================
   LIVE PRODUCT FEED (SIMULATED REAL MARKET)
   This behaves like Amazon/CJ affiliate API feed
========================= */

function generateLiveFeed() {
  const niches = ["kitchen", "home", "beauty", "bathroom", "aesthetic"];

  const products = [
    "Gold Kitchen Organizer Set",
    "Luxury Marble Soap Dispenser",
    "Acrylic Makeup Storage Box",
    "Modern LED Mirror Light",
    "Stainless Steel Sink Rack",
    "Velvet Jewelry Organizer",
    "Minimalist Desk Lamp",
    "Glass Spice Jar Set",
    "Hotel Style Bathroom Set",
    "Smart Motion Sensor Light"
  ];

  return products.map((name, i) => {
    return {
      id: Date.now() + i,
      name,
      niche: niches[i % niches.length],

      // simulated real affiliate metrics
      rating: (4 + Math.random()).toFixed(1),
      reviews: Math.floor(Math.random() * 20000 + 500),
      boughtLastMonth: Math.floor(Math.random() * 10000 + 100),
      bestSellerRank: Math.floor(Math.random() * 100 + 1),
      trendGrowth: Math.floor(Math.random() * 40 + 60),
      price: Math.floor(Math.random() * 60 + 10)
    };
  });
}

/* =========================
   SCORING ENGINE (AFFORDABLE LUXURY FOCUS)
========================= */
function score(p) {
  let s = 0;

  s += parseFloat(p.rating) * 15;
  s += Math.log10(p.reviews) * 10;
  s += p.boughtLastMonth / 250;
  s += (100 - p.bestSellerRank);
  s += p.trendGrowth;

  if (p.price < 50) s += 25; // Affordable luxury boost
  if (p.niche === "aesthetic") s += 20;

  return Math.floor(s);
}

/* =========================
   SMART PRODUCT PICKER (LIVE ENGINE)
========================= */
app.get("/smart-product", (req, res) => {

  const feed = generateLiveFeed();

  let best = null;
  let bestScore = 0;

  feed.forEach(p => {
    const s = score(p);
    if (s > bestScore) {
      bestScore = s;
      best = p;
    }
  });

  const decision = bestScore > 230 ? "POST" : "HOLD";

  const pin = {
    product: best.name,
    niche: best.niche,
    score: bestScore,
    rating: best.rating,
    reviews: best.reviews,
    boughtLastMonth: best.boughtLastMonth,
    title: `Stop scrolling 😍 ${best.name}`,
    description: `${best.name} is trending in US Pinterest + high conversion affiliate product.`,
    hashtags: "#amazonfinds #luxuryfinds #pinterestviral #affiliatemarketing",
    best_time: "2 PM Ethiopia (US morning peak)",
    decision
  };

  if (decision === "POST") {
    pinQueue.push(pin);
  }

  res.json(pin);
});

/* =========================
   AMAZON LINK INPUT
========================= */
app.get("/generate-from-link", (req, res) => {

  const name = req.query.name || "Amazon Product";
  const link = req.query.link || "Amazon Link";

  const pin = {
    id: Date.now(),
    product: name,
    link,
    title: "Amazon Find You Didn’t Know You Needed 😍",
    description: `${name} is trending in USA Pinterest right now.`,
    hashtags: "#amazonfinds #luxuryfinds #viralproducts",
    status: "QUEUED"
  };

  pinQueue.push(pin);

  res.json(pin);
});

/* =========================
   QUEUE SYSTEM
========================= */
app.get("/queue", (req, res) => {
  res.json(pinQueue);
});

app.get("/posted", (req, res) => {
  res.json(postedPins);
});

/* =========================
   AUTO POST ENGINE
========================= */
setInterval(() => {

  if (pinQueue.length === 0) return;

  const pin = pinQueue.shift();
  pin.status = "POSTED";
  pin.postedAt = new Date();

  postedPins.push(pin);

  console.log("AUTO POSTED:", pin.product);

}, 60000);

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("PIN AI FACTORY v7 LIVE FEED ENGINE 🚀");
});