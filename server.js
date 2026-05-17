const express = require("express");
const app = express();
app.use(express.json());

let pinQueue = [];
let postedPins = [];

/* =========================
   AFFORDABLE LUXURY AMAZON DB
========================= */

const amazonDB = [
{
 name:"Gold Kitchen Faucet",
 niche:"kitchen",
 price:39,
 rating:4.8,
 reviews:12450,
 boughtLastMonth:5000,
 bestSellerRank:12,
 trendGrowth:92
},
{
 name:"Marble Soap Dispenser",
 niche:"home",
 price:18,
 rating:4.7,
 reviews:8450,
 boughtLastMonth:3200,
 bestSellerRank:25,
 trendGrowth:88
},
{
 name:"Glass Spice Jars Set",
 niche:"kitchen",
 price:24,
 rating:4.9,
 reviews:22100,
 boughtLastMonth:7200,
 bestSellerRank:6,
 trendGrowth:95
},
{
 name:"Luxury Shower Shelf",
 niche:"bathroom",
 price:22,
 rating:4.6,
 reviews:5300,
 boughtLastMonth:2800,
 bestSellerRank:41,
 trendGrowth:80
},
{
 name:"Velvet Jewelry Organizer",
 niche:"aesthetic",
 price:19,
 rating:4.8,
 reviews:9100,
 boughtLastMonth:4300,
 bestSellerRank:18,
 trendGrowth:90
},
{
 name:"Acrylic Makeup Organizer",
 niche:"beauty",
 price:21,
 rating:4.7,
 reviews:15000,
 boughtLastMonth:6100,
 bestSellerRank:10,
 trendGrowth:93
}
];

/* =========================
   PRODUCT SCORING ENGINE
========================= */
function scoreProduct(p){

 let score = 0;

 score += p.rating * 15;                 // max 75
 score += Math.log10(p.reviews) * 10;   // trust factor
 score += p.boughtLastMonth / 200;      // demand
 score += (100 - p.bestSellerRank);     // best seller boost
 score += p.trendGrowth;                // trend

 if(p.price < 50) score += 20;          // affordable luxury boost

 return Math.floor(score);
}

/* =========================
   SMART PRODUCT AI
========================= */
app.get("/smart-product",(req,res)=>{

 let bestProduct = null;
 let bestScore = 0;

 amazonDB.forEach(p=>{
   const s = scoreProduct(p);
   if(s > bestScore){
     bestScore = s;
     bestProduct = p;
   }
 });

 const decision = bestScore > 220 ? "POST" : "HOLD";

 const pin = {
   product: bestProduct.name,
   score: bestScore,
   decision,
   title:`Stop scrolling 😍 ${bestProduct.name}`,
   description:`${bestProduct.name} has ${bestProduct.rating}⭐ and ${bestProduct.boughtLastMonth}+ bought last month.`,
   hashtags:"#amazonfinds #luxuryfinds #pinterestviral #affiliatemarketing",
   best_time:"2 PM Ethiopia (US morning peak)"
 };

 if(decision==="POST"){
   pinQueue.push(pin);
 }

 res.json(pin);
});

/* =========================
   AMAZON LINK IMPORT
========================= */
app.get("/generate-from-link",(req,res)=>{

 const name = req.query.name || "Amazon Product";
 const link = req.query.link || "Amazon Link";

 const pin = {
   id: Date.now(),
   product:name,
   link,
   title:`Amazon Find You Didn’t Know You Needed 😍`,
   description:`${name} is trending in USA right now.`,
   hashtags:"#amazonfinds #luxuryfinds #viralproducts",
   best_time:"3 AM Ethiopia",
   status:"QUEUED"
 };

 pinQueue.push(pin);
 res.json(pin);
});

/* =========================
   QUEUE + AUTO POST
========================= */
app.get("/queue",(req,res)=>res.json(pinQueue));
app.get("/posted",(req,res)=>res.json(postedPins));

setInterval(()=>{
 if(pinQueue.length===0) return;
 const pin = pinQueue.shift();
 pin.status="POSTED";
 postedPins.push(pin);
 console.log("POSTED:",pin.product);
},60000);

/* ========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>console.log("PIN AI FACTORY v6 LIVE 🔥"));