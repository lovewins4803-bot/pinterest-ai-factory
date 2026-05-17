const express = require("express");
const app = express();

app.use(express.json());

let pinQueue = [];
let postedPins = [];
let userProducts = [];
let performanceDB = {};
let dailyStats = {
 totalEarnings:0,
 totalPosts:0,
 totalClicks:0
};

/* =========================
   VIRAL ENGINE
========================= */
function scoreProduct(name){

 let score = 50;

 const n = name.toLowerCase();

 if(n.includes("gold")) score += 15;
 if(n.includes("marble")) score += 15;
 if(n.includes("glass")) score += 10;
 if(n.includes("luxury")) score += 10;
 if(name.length < 30) score += 10;

 score += Math.floor(Math.random()*30);

 return score;
}

/* =========================
   MONEY MODEL
========================= */
function moneyModel(score){

 const ctr = Math.min(95, score * 0.8);
 const save = Math.min(95, score * 0.7);
 const viral = Math.min(95, (ctr + save)/2);

 const earnings = (ctr + save + viral)/3/10;

 return {
   ctr,
   save,
   viral,
   earnings: parseFloat(earnings.toFixed(2))
 };
}

/* =========================
   LEARNING SYSTEM
========================= */
function learn(pin, result){

 const name = pin.product;

 if(!performanceDB[name]){
   performanceDB[name] = {
     posts:0,
     wins:0,
     losses:0,
     totalScore:0,
     earnings:0
   };
 }

 const p = performanceDB[name];

 p.posts++;
 p.totalScore += pin.score;

 if(result === "WIN"){
   p.wins++;
   p.earnings += pin.earnings;
 } else {
   p.losses++;
 }
}

/* =========================
   SMART PICKER
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

   let score = scoreProduct(p.name);

   if(performanceDB[p.name]){
     score += performanceDB[p.name].wins * 5;
   }

   if(score > bestScore){
     bestScore = score;
     best = p;
   }
 });

 const money = moneyModel(bestScore);

 const pin = {
   product: best.name,
   score: bestScore,
   ...money,
   decision: bestScore > 70 ? "POST" : "HOLD",
   createdAt: new Date()
 };

 if(pin.decision === "POST"){
   pinQueue.push(pin);
 }

 dailyStats.totalPosts++;
 dailyStats.totalEarnings += money.earnings;

 res.json(pin);
});

/* =========================
   BATCH GENERATOR
========================= */
app.get("/generate-batch",(req,res)=>{

 let batch = [];

 for(let i=0;i<5;i++){

   const pool = userProducts.length ? userProducts : [
     {name:"Gold Kitchen Organizer"},
     {name:"Marble Soap Dispenser"},
     {name:"Luxury LED Mirror"}
   ];

   const p = pool[Math.floor(Math.random()*pool.length)];
   const score = scoreProduct(p.name);
   const money = moneyModel(score);

   batch.push({
     product:p.name,
     score,
     ...money,
     decision: score > 70 ? "POST" : "HOLD"
   });

 }

 res.json(batch);
});

/* =========================
   DASHBOARD (PROFIT VIEW)
========================= */
app.get("/dashboard",(req,res)=>{

 let best = null;
 let bestE = 0;

 Object.keys(performanceDB).forEach(k=>{

   const p = performanceDB[k];
   const avg = p.earnings;

   if(avg > bestE){
     bestE = avg;
     best = k;
   }

 });

 res.json({
   dailyStats,
   best_product: best,
   best_earnings: bestE,
   total_products_tracked: Object.keys(performanceDB).length
 });
});

/* =========================
   REPORT SYSTEM
========================= */
app.post("/report",(req,res)=>{

 const {product,result,earnings} = req.body;

 learn({product,score:scoreProduct(product),earnings},result);

 if(result === "WIN"){
   dailyStats.totalClicks += 1;
 }

 res.json({message:"updated"});
});

/* =========================
   QUEUE + POSTING
========================= */
app.get("/queue",(req,res)=>res.json(pinQueue));
app.get("/posted",(req,res)=>res.json(postedPins));

setInterval(()=>{

 if(pinQueue.length === 0) return;

 const pin = pinQueue.shift();
 pin.status = "POSTED";
 pin.postedAt = new Date();

 postedPins.push(pin);

},60000);

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
 console.log("🚀 PIN AI FACTORY v15 MONEY AUTOMATION LIVE");
});