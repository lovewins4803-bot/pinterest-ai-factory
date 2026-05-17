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
   ADD PRODUCT (USER FEED)
========================= */
app.post("/add-product",(req,res)=>{

 const {name,link,image,niche} = req.body;

 const product = {
   id: Date.now(),
   name,
   link: link || null,
   image: image || null,
   niche: niche || "aesthetic",
   source:"USER"
 };

 userProducts.push(product);

 res.json({
   message:"Product added",
   product
 });
});

/* =========================
   SIMULATED PRODUCTS (FALLBACK)
========================= */
function generateSimulated(){

 return [
   {name:"Gold Kitchen Organizer", niche:"kitchen", score:85},
   {name:"Marble Soap Dispenser", niche:"home", score:88},
   {name:"Luxury LED Mirror", niche:"bathroom", score:92},
   {name:"Glass Spice Jar Set", niche:"kitchen", score:90}
 ];
}

/* =========================
   INTELLIGENCE SCORING
========================= */
function score(p, source){

 let score = 0;

 if(source==="USER") score += 30;
 if(p.niche==="aesthetic") score += 20;
 if(p.link) score += 15;
 if(p.image) score += 10;

 score += Math.floor(Math.random()*30);

 return score;
}

/* =========================
   SMART ENGINE (COMPARE + DECIDE BEST)
========================= */
app.get("/smart-product",(req,res)=>{

 let pool = [];

 if(userProducts.length > 0){
   pool = userProducts;
 } else {
   pool = generateSimulated();
 }

 let best = null;
 let bestScore = 0;

 pool.forEach(p=>{

   const s = score(p,p.source || "SIM");

   if(s > bestScore){
     bestScore = s;
     best = p;
   }

 });

 // IMAGE DECISION LOGIC
 let finalImage =
   best.image ||
   best.link ||
   "AI_GENERATED_IMAGE";

 const pin = {
   product: best.name,
   score: bestScore,
   image: finalImage,
   source: best.source || "SIMULATED",
   decision: bestScore > 70 ? "POST" : "HOLD",
   title:`Stop scrolling 😍 ${best.name}`,
   description:`Affordable Luxury Find trending on Pinterest USA`,
   hashtags:"#amazonfinds #luxuryfinds #pinterestviral",
   best_time:"2 PM Ethiopia"
 };

 if(pin.decision==="POST"){
   pinQueue.push(pin);
 }

 res.json(pin);
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
   AUTO POST
========================= */
setInterval(()=>{

 if(pinQueue.length===0) return;

 const pin = pinQueue.shift();
 pin.status="POSTED";
 pin.postedAt=new Date();

 postedPins.push(pin);

 console.log("POSTED:",pin.product);

},60000);

/* =========================
   START
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
 console.log("PIN AI FACTORY v8 HYBRID INTELLIGENCE 🚀");
});