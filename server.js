const express = require("express");
const app = express();

app.use(express.json());

/* =========================
   MEMORY SYSTEM
========================= */
let pinQueue = [];
let postedPins = [];
let userProducts = [];

/* =========================
   HOME
========================= */
app.get("/", (req, res) => {
res.send(`
<h1>📌 PIN AI FACTORY v9</h1>
<p>Hybrid Intelligence + Viral Engine + Luxury Finder</p>

<ul>
<li>/add-product (POST)</li>
<li>/smart-product</li>
<li>/queue</li>
<li>/posted</li>
</ul>
`);
});

/* =========================
   ADD USER PRODUCT (CURATED FEED)
========================= */
app.post("/add-product", (req, res) => {

 const { name, link, image, niche } = req.body;

 const product = {
   id: Date.now(),
   name,
   link: link || null,
   image: image || null,
   niche: niche || "aesthetic",
   source: "USER"
 };

 userProducts.push(product);

 res.json({
   message: "Product added successfully",
   product
 });
});

/* =========================
   SIMULATED BACKUP PRODUCTS
========================= */
function generateSimulated() {
 return [
   { name: "Gold Kitchen Organizer", niche: "kitchen", source: "SIM" },
   { name: "Marble Soap Dispenser", niche: "home", source: "SIM" },
   { name: "Luxury LED Mirror", niche: "bathroom", source: "SIM" },
   { name: "Glass Spice Jar Set", niche: "kitchen", source: "SIM" }
 ];
}

/* =========================
   PRODUCT SCORING ENGINE
========================= */
function scoreProduct(p) {

 let score = 50;

 if (p.source === "USER") score += 25;
 if (p.niche === "aesthetic") score += 15;

 if (p.link) score += 10;
 if (p.image) score += 10;

 score += Math.floor(Math.random() * 30);

 return score;
}

/* =========================
   VIRAL PIN ENGINE
========================= */
function generateViralPin(product) {

 const titles = [
   `I wish I knew this sooner 😳 ${product.name}`,
   `Amazon find that looks EXPENSIVE but isn’t 💎`,
   `Hidden luxury under $30 you NEED 🔥`,
   `This is going viral in Pinterest USA 📌`,
   `Affordable luxury upgrade ✨ ${product.name}`
 ];

 const title = titles[Math.floor(Math.random() * titles.length)];

 const description =
 `${product.name} is trending in USA Pinterest.
Affordable Luxury aesthetic product with high viral potential.`;

 return {
   title,
   description,
   hashtags: "#amazonfinds #affordableluxury #pinterestviral #homeaesthetic #viral",
   image_prompt: `Luxury Pinterest aesthetic of ${product.name}, soft lighting, marble background, high-end ecommerce style`,
   engagement_score: Math.floor(Math.random() * 40 + 60)
 };
}

/* =========================
   SMART PRODUCT ENGINE
========================= */
app.get("/smart-product", (req, res) => {

 let pool = userProducts.length > 0 ? userProducts : generateSimulated();

 let best = null;
 let bestScore = 0;

 pool.forEach(p => {
   const s = scoreProduct(p);
   if (s > bestScore) {
     bestScore = s;
     best = p;
   }
 });

 const viral = generateViralPin(best);

 const decision = bestScore > 75 ? "POST" : "HOLD";

 const pin = {
   product: best.name,
   niche: best.niche,
   score: bestScore,
   source: best.source || "SIM",

   title: viral.title,
   description: viral.description,
   hashtags: viral.hashtags,
   image_prompt: viral.image_prompt,
   engagement_score: viral.engagement_score,

   decision,
   best_time: "2 PM Ethiopia (US morning peak)"
 };

 if (decision === "POST") {
   pinQueue.push(pin);
 }

 res.json(pin);
});

/* =========================
   GENERATE FROM LINK
========================= */
app.get("/generate-from-link", (req, res) => {

 const name = req.query.name || "Amazon Product";
 const link = req.query.link || "Amazon Link";

 const pin = {
   id: Date.now(),
   product: name,
   link,
   title: "Amazon Find You Didn’t Know You Needed 😍",
   description: `${name} trending in USA Pinterest.`,
   hashtags: "#amazonfinds #affordableluxury #viralproducts",
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

/* =========================
   POSTED SYSTEM
========================= */
app.get("/posted", (req, res) => {
 res.json(postedPins);
});

/* =========================
   CLEAR QUEUE
========================= */
app.get("/clear", (req, res) => {
 pinQueue.length = 0;
 res.json({ message: "queue cleared" });
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

 console.log("POSTED:", pin.product);

}, 60000);

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
 console.log("🚀 PIN AI FACTORY v9 FULL SYSTEM LIVE");
});