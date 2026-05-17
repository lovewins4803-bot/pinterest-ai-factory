const express = require("express");
const app = express();

app.use(express.json());

let pinQueue = [];
let postedPins = [];
let userProducts = [];
let usedProducts = new Set();

/* =========================
   LUXURY BOARD SYSTEM
========================= */
function pickBoard(productName){

 const name = productName.toLowerCase();

 if(name.includes("kitchen")) return "Luxury Kitchen Finds";
 if(name.includes("bath") || name.includes("shower")) return "Bathroom Upgrade Ideas";
 if(name.includes("beauty") || name.includes("makeup")) return "Beauty Luxury Finds";
 if(name.includes("desk") || name.includes("lamp")) return "Home Aesthetic Setup";

 return "Affordable Luxury Finds";
}

/* =========================
   DUPLICATE CHECKER
========================= */
function isDuplicate(name){
 return usedProducts.has(name.toLowerCase());
}

/* =========================
   VIRAL SCORE ENGINE
========================= */
function viralScore(name){

 let score = 50;

 if(name.toLowerCase().includes("gold")) score += 15;
 if(name.toLowerCase().includes("marble")) score += 15;
 if(name.toLowerCase().includes("luxury")) score += 10;
 if(name.length < 30) score += 10;

 score += Math.floor(Math.random()*30);

 return score;
}

/* =========================
   VIRAL CONTENT GENERATOR
========================= */
function generateContent(name){

 return {
   title: `I wish I knew this sooner 😳 ${name}`,
   description: `${name} is trending in US Pinterest Affordable Luxury niche.`,
   hashtags: "#amazonfinds #affordableluxury #pinterestviral #luxuryhome",
   image_prompt: `Luxury aesthetic product photo of ${name}, marble background, soft lighting, high-end Pinterest style`
 };
}

/* =========================
   SMART PRODUCT PICKER
========================= */
app.get("/smart-product",(req,res)=>{

 let pool = userProducts.length ? userProducts : [
   {name:"Gold Kitchen Organizer"},
   {name:"Marble Soap Dispenser"},
   {name:"Luxury LED Mirror"},
   {name:"Glass Spice Jar Set"}
 ];

 let best = null;
 let bestScore = 0;

 pool.forEach(p=>{

   if(isDuplicate(p.name)) return;

   const score = viralScore(p.name);

   if(score > bestScore){
     bestScore = score;
     best = p;
   }
 });

 if(!best){
   return res.json({message:"No new products available"});
 }

 usedProducts.add(best.name.toLowerCase());

 const board = pickBoard(best.name);
 const content = generateContent(best.name);

 const decision = bestScore > 70 ? "POST" : "HOLD";

 const pin = {
   product: best.name,
   board,
   score: bestScore,
   ...content,
   decision,
   best_time: "2 PM Ethiopia (US Pinterest peak)"
 };

 if(decision === "POST"){
   pinQueue.push(pin);
 }

 res.json(pin);
});

/* =========================
   ADD PRODUCT
========================= */
app.post("/add-product",(req,res)=>{

 const {name,link,image,niche} = req.body;

 const product = {name,link,image,niche};

 userProducts.push(product);

 res.json({message:"added",product});
});

/* =========================
   DAILY DASHBOARD
========================= */
app.get("/daily-plan",(req,res)=>{

 const best = userProducts[0] || {name:"No product yet"};

 res.json({
   best_product: best.name,
   reason: "Selected from curated luxury pool",
   tip: "Focus on marble/gold/aesthetic products for higher CTR"
 });
});

/* =========================
   QUEUE
========================= */
app.get("/queue",(req,res)=>res.json(pinQueue));
app.get("/posted",(req,res)=>res.json(postedPins));

/* =========================
   CLEAR
========================= */
app.get("/clear",(req,res)=>{
 pinQueue.length = 0;
 res.json({message:"cleared"});
});

/* =========================
   AUTO SCHEDULER
========================= */
setInterval(()=>{

 if(pinQueue.length === 0) return;

 const pin = pinQueue.shift();
 pin.status = "POSTED";
 pin.postedAt = new Date();

 postedPins.push(pin);

 console.log("POSTED:",pin.product);

},60000);

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
 console.log("🚀 PIN AI FACTORY v12 BUSINESS MODE LIVE");
});