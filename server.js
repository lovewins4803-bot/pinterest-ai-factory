const express = require("express");
const app = express();

app.use(express.json());

/* =========================
   MEMORY
========================= */
let pinQueue = [];
let postedPins = [];
let userProducts = [];

/* =========================
   AFFORDABLE LUXURY KEYWORDS
========================= */
const luxuryKeywords = [
 "gold","marble","glass","aesthetic","minimal","modern",
 "stainless","luxury","premium","sleek","LED","organizer",
 "spa","hotel","matte","black","white","bamboo","acrylic"
];

/* =========================
   LUXURY SCORE CHECKER
========================= */
function checkLuxuryFit(name) {

 let score = 0;
 let lower = name.toLowerCase();

 luxuryKeywords.forEach(k => {
   if (lower.includes(k)) score += 10;
 });

 // baseline aesthetic bonus
 if (name.length < 25) score += 10;

 let status = "GOOD";

 if (score >= 80) status = "PERFECT_LUXURY";
 else if (score >= 50) status = "WARN";
 else status = "NOT_LUXURY";

 return { score, status };
}

/* =========================
   ADD PRODUCT WITH VALIDATION
========================= */
app.post("/add-product", (req, res) => {

 const { name, link, image, niche } = req.body;

 const luxuryCheck = checkLuxuryFit(name);

 const product = {
   id: Date.now(),
   name,
   link: link || null,
   image: image || null,
   niche: niche || "aesthetic",
   source: "USER",
   luxuryFit: luxuryCheck
 };

 userProducts.push(product);

 let message = "Product added";

 if (luxuryCheck.status === "WARN") {
   message = "⚠️ Warning: borderline luxury fit";
 }

 if (luxuryCheck.status === "NOT_LUXURY") {
   message = "❌ NOT LUXURY FIT - consider replacing product";
 }

 res.json({
   message,
   product,
   suggestion:
     luxuryCheck.status === "NOT_LUXURY"
       ? "Replace with marble, gold, glass, or minimalist aesthetic product"
       : "Good to use"
 });
});

/* =========================
   SIMULATED PRODUCTS
========================= */
function generateSimulated() {
 return [
   { name: "Gold Kitchen Organizer", niche: "kitchen" },
   { name: "Marble Soap Dispenser", niche: "home" },
   { name: "Luxury LED Mirror", niche: "bathroom" }
 ];
}

/* =========================
   SCORE ENGINE
========================= */
function scoreProduct(p) {
 let score = 50;

 if (p.source === "USER") score += 25;
 if (p.niche === "aesthetic") score += 15;

 score += Math.floor(Math.random() * 30);

 return score;
}

/* =========================
   SMART PRODUCT PICKER
========================= */
app.get("/smart-product", (req, res) => {

 let pool = userProducts.length > 0 ? userProducts : generateSimulated();

 let best = null;
 let bestScore = 0;

 pool.forEach(p => {

   const luxuryCheck = checkLuxuryFit(p.name);
   const s = scoreProduct(p);

   // penalize non-luxury items
   let finalScore = s - (100 - luxuryCheck.score);

   if (finalScore > bestScore) {
     bestScore = finalScore;
     best = p;
   }
 });

 const luxuryCheck = checkLuxuryFit(best.name);

 const pin = {
   product: best.name,
   score: bestScore,
   luxuryFit: luxuryCheck,

   title: `Stop scrolling 😳 ${best.name}`,
   description: `Affordable Luxury Pinterest Find`,
   hashtags: "#amazonfinds #affordableluxury #pinterestviral",

   warning:
     luxuryCheck.status === "NOT_LUXURY"
       ? "⚠️ This product is NOT aligned with your luxury niche"
       : "OK",

   decision: bestScore > 75 && luxuryCheck.score > 60 ? "POST" : "HOLD",

   best_time: "2 PM Ethiopia"
 };

 if (pin.decision === "POST") {
   pinQueue.push(pin);
 }

 res.json(pin);
});

/* =========================
   QUEUE
========================= */
app.get("/queue", (req, res) => res.json(pinQueue));

/* =========================
   POSTED
========================= */
app.get("/posted", (req, res) => res.json(postedPins));

/* =========================
   CLEAR
========================= */
app.get("/clear", (req, res) => {
 pinQueue.length = 0;
 res.json({ message: "cleared" });
});

/* =========================
   AUTO POST
========================= */
setInterval(() => {

 if (pinQueue.length === 0) return;

 const pin = pinQueue.shift();
 pin.status = "POSTED";
 pin.postedAt = new Date();

 postedPins.push(pin);

 console.log("POSTED:", pin.product);

}, 60000);

/* =========================
   START
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
 console.log("🚀 PIN AI FACTORY v10 LUXURY GUARDIAN LIVE");
});