const express = require("express");
const app = express();

app.use(express.json());

let pinQueue = [];
let postedPins = [];
let userProducts = [];
let performanceLog = [];

/* =========================
   VIRAL SCORING CORE
========================= */
function viralScore(name){

 let score = 50;

 const n = name.toLowerCase();

 if(n.includes("gold")) score += 15;
 if(n.includes("marble")) score += 15;
 if(n.includes("luxury")) score += 10;
 if(n.includes("glass")) score += 10;
 if(name.length < 30) score += 10;

 score += Math.floor(Math.random()*30);

 return score;
}

/* =========================
   MONEY ENGINE (NEW)
========================= */
function moneyEngine(pin){

 const ctr = Math.min(95, pin.score * 0.8);
 const save = Math.min(95, pin.score * 0.7);
 const viral = Math.min(95, (ctr + save) / 2);

 // affiliate estimate (simple model)
 const earnings = (ctr + save + viral) / 3 / 10;

 return {
   ctr: Math.floor(ctr),
   saveRate: Math.floor(save),
   viralChance: Math.floor(viral),
   estimatedEarnings: earnings.toFixed(2)
 };
}

/* =========================
   CONTENT GENERATOR
========================= */
function generateContent(name){

 return {
   title: `I wish I knew this sooner 😳 ${name}`,
   description: `${name} trending in US Pinterest Affordable Luxury niche.`,
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

   const score = viralScore(p.name);

   if(score > bestScore){
     bestScore = score;
     best = p;
   }
 });

 const content = generateContent(best.name);
 const money = moneyEngine({score: bestScore});

 const pin = {
   product: best.name,
   score: bestScore,
   ...content,
   ...money,

   decision: bestScore > 70 ? "POST" : "HOLD",
   best_time: "2 PM Ethiopia (US peak)"
 };

 if(pin.decision === "POST"){
   pinQueue.push(pin);
 }

 performanceLog.push(pin);

 res.json(pin);
});

/* =========================
   ADD PRODUCT
========================= */
app.post("/add-product",(req,res)=>{

 const {name} = req.body;

 userProducts.push({name});

 res.json({message:"added",name});
});

/* =========================
   WINNER DASHBOARD
========================= */
app.get("/winner",(req,res)=>{

 let best = performanceLog.reduce((a,b)=>
 (a.estimatedEarnings > b.estimatedEarnings ? a : b),{});

 res.json({
   best_product: best.product,
   estimatedEarnings: best.estimatedEarnings,
   ctr: best.ctr,
   viralChance: best.viralChance,
   reason: "Top performing Pinterest luxury product"
 });
});

/* =========================
   QUEUE SYSTEM
========================= */
app.get("/queue",(req,res)=>res.json(pinQueue));
app.get("/posted",(req,res)=>res.json(postedPins));

/* =========================
   AUTO POST SYSTEM
========================= */
setInterval(()=>{

 if(pinQueue.length === 0) return;

 const pin = pinQueue.shift();
 pin.status = "POSTED";
 pin.postedAt = new Date();

 postedPins.push(pin);

},60000);

/* =========================
   START
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
 console.log("🚀 PIN AI FACTORY v13 MONEY ENGINE LIVE");
});