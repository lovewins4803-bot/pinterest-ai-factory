const express = require("express");
const app = express();

app.use(express.json());

let pinQueue = [];
let postedPins = [];
let userProducts = [];
let performanceDB = {};
let bannedProducts = new Set();

/* =========================
   VIRAL SCORING
========================= */
function viralScore(name){

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
   MONEY ESTIMATION
========================= */
function estimateMoney(score){

 const ctr = Math.min(95, score * 0.8);
 const save = Math.min(95, score * 0.7);
 const viral = Math.min(95, (ctr + save)/2);

 const earnings = (ctr + save + viral)/3/10;

 return {ctr,save,viral,earnings};
}

/* =========================
   LEARNING ENGINE
========================= */
function learn(pin, result){

 const name = pin.product;

 if(!performanceDB[name]){
   performanceDB[name] = {
     posts:0,
     totalScore:0,
     wins:0,
     losses:0
   };
 }

 const p = performanceDB[name];

 p.posts++;
 p.totalScore += pin.score;

 if(result === "WIN") p.wins++;
 else p.losses++;

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

   if(bannedProducts.has(p.name)) return;

   let score = viralScore(p.name);

   // learning boost
   if(performanceDB[p.name]){
     score += performanceDB[p.name].wins * 5;
   }

   if(score > bestScore){
     bestScore = score;
     best = p;
   }
 });

 const money = estimateMoney(bestScore);

 const pin = {
   product: best.name,
   score: bestScore,
   ...money,
   decision: bestScore > 70 ? "POST" : "HOLD",
   best_time: "2 PM Ethiopia"
 };

 if(pin.decision === "POST"){
   pinQueue.push(pin);
 }

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
   REPORT RESULT (LEARNING LOOP)
========================= */
app.post("/report",(req,res)=>{

 const {product,result} = req.body;

 learn({product,score:viralScore(product)},result);

 if(result === "LOSS"){
   bannedProducts.add(product);
 }

 res.json({message:"learned",product,result});
});

/* =========================
   WINNER DASHBOARD
========================= */
app.get("/winner",(req,res)=>{

 let best = null;
 let bestE = 0;

 Object.keys(performanceDB).forEach(k=>{

   const p = performanceDB[k];

   const avg = p.totalScore / p.posts;

   const est = avg + p.wins*10;

   if(est > bestE){
     bestE = est;
     best = k;
   }

 });

 res.json({
   best_product: best,
   score: bestE,
   reason: "Self-learning affiliate optimization system"
 });
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
 console.log("🚀 PIN AI FACTORY v14 AUTOPILOT LIVE");
});