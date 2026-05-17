const express = require("express");
const app = express();

app.use(express.json());

let pinQueue = [];
let postedPins = [];
let userProducts = [];

/* =========================
   LUXURY CHECK (AFFORDABLE LUXURY)
========================= */
const luxuryWords = [
 "gold","marble","glass","aesthetic","modern","minimal",
 "luxury","premium","sleek","LED","organizer","spa",
 "hotel","matte","black","white","bamboo","acrylic"
];

function luxuryScore(name){
 let score = 0;
 let n = name.toLowerCase();

 luxuryWords.forEach(w=>{
   if(n.includes(w)) score += 10;
 });

 if(name.length < 30) score += 10;

 return Math.min(score,100);
}

/* =========================
   VIRAL SCORE ENGINE
========================= */
function viralEngine(product){

 const luxury = luxuryScore(product.name);

 const ctr = Math.min(95,
   luxury * 0.6 +
   Math.random()*30
 );

 const saveRate = Math.min(95,
   luxury * 0.7 +
   Math.random()*25
 );

 const viralChance = Math.min(95,
   (ctr + saveRate)/2 +
   Math.random()*20
 );

 const usMarketFit =
 product.name.length < 35 ? 85 : 70;

 const score =
 ctr*0.3 + saveRate*0.3 + viralChance*0.3 + usMarketFit*0.1;

 return {
   ctr: Math.floor(ctr),
   saveRate: Math.floor(saveRate),
   viralChance: Math.floor(viralChance),
   usMarketFit,
   score: Math.floor(score)
 };
}

/* =========================
   VIRAL CONTENT GENERATOR
========================= */
function generatePin(product){

 const titles = [
   `I wish I knew this sooner 😳 ${product.name}`,
   `Amazon find that looks EXPENSIVE 💎`,
   `Hidden luxury under budget 🔥`,
   `Pinterest viral aesthetic upgrade ✨`,
   `Affordable luxury you NEED 😍`
 ];

 const title = titles[Math.floor(Math.random()*titles.length)];

 return {
   title,
   description: `${product.name} is trending in US Pinterest luxury niche.`,
   hashtags: "#amazonfinds #affordableluxury #pinterestviral #homeaesthetic",
   image_prompt: `Luxury Pinterest product photo of ${product.name}, soft lighting, marble background, high-end aesthetic`
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

   const v = viralEngine(p);

   if(v.score > bestScore){
     bestScore = v.score;
     best = p;
     best.metrics = v;
   }
 });

 const pinData = generatePin(best);

 const decision =
 best.metrics.score > 70 ? "POST" : "HOLD";

 const pin = {
   product: best.name,
   metrics: best.metrics,

   ...pinData,

   decision,
   best_time: "2 PM Ethiopia (US peak traffic)"
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

 const product = {
   id: Date.now(),
   name,
   link: link || null,
   image: image || null,
   niche: niche || "aesthetic"
 };

 userProducts.push(product);

 res.json({
   message:"Product added",
   product
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
   AUTO POST SYSTEM
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
 console.log("🚀 PIN AI FACTORY v11 VIRAL OPTIMIZER LIVE");
});