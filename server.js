const express = require("express");
const app = express();

app.use(express.json());

/* =========================
   STATE STORAGE
========================= */
let products = [];
let pins = [];
let posted = [];
let stats = {
 earnings:0,
 clicks:0,
 posts:0
};

let productStats = {};

/* =========================
   LUXURY SCORING
========================= */
function luxuryScore(name){
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
 const ctr = Math.min(95, score*0.8);
 const save = Math.min(95, score*0.7);
 const viral = Math.min(95,(ctr+save)/2);
 const earnings = (ctr+save+viral)/3/10;

 return {
   ctr:Math.floor(ctr),
   save:Math.floor(save),
   viral:Math.floor(viral),
   earnings:+earnings.toFixed(2)
 };
}

/* =========================
   PIN GENERATOR
========================= */
function createPin(product){

 const score = luxuryScore(product.name);
 const money = moneyModel(score);

 return {
   id: Date.now(),
   product: product.name,
   title: `I wish I knew this sooner 😳 ${product.name}`,
   description: `${product.name} trending in Affordable Luxury niche`,
   hashtags: "#amazonfinds #affordableluxury #pinterestviral",
   score,
   ...money,
   decision: score > 70 ? "POST" : "HOLD",
   createdAt: new Date()
 };
}

/* =========================
   ADD PRODUCT
========================= */
app.post("/add-product",(req,res)=>{

 const {name} = req.body;

 const product = {name};

 products.push(product);

 res.json({
   message:"Product added",
   product
 });
});

/* =========================
   SMART PICK
========================= */
app.get("/smart",(req,res)=>{

 if(products.length === 0){
   return res.json({message:"No products"});
 }

 let best = null;
 let bestScore = 0;

 products.forEach(p=>{

   const score = luxuryScore(p.name);

   if(score > bestScore){
     bestScore = score;
     best = p;
   }
 });

 const pin = createPin(best);

 if(pin.decision === "POST"){
   pins.push(pin);
 }

 res.json(pin);
});

/* =========================
   BATCH GENERATOR
========================= */
app.get("/batch",(req,res)=>{

 let batch = [];

 for(let i=0;i<5;i++){

   const p = products[Math.floor(Math.random()*products.length)];
   if(!p) continue;

   batch.push(createPin(p));
 }

 res.json(batch);
});

/* =========================
   DASHBOARD (MAIN CONTROL PANEL)
========================= */
app.get("/dashboard",(req,res)=>{

 let best = null;
 let bestEarn = 0;

 Object.values(productStats).forEach(p=>{

   if(p.earnings > bestEarn){
     bestEarn = p.earnings;
     best = p;
   }

 });

 res.send(`
 <h1>📌 PIN AI FACTORY DASHBOARD</h1>

 <h2>💰 Stats</h2>
 <p>Total Earnings: $${stats.earnings}</p>
 <p>Total Posts: ${stats.posts}</p>
 <p>Total Clicks: ${stats.clicks}</p>

 <h2>🏆 Top Product</h2>
 <p>${best ? best.name : "No data yet"}</p>

 <h2>⚡ Actions</h2>
 <ul>
   <li><a href="/smart">Run Smart Pick</a></li>
   <li><a href="/batch">Generate Batch</a></li>
   <li><a href="/queue">View Pins</a></li>
   <li><a href="/clear">Clear Data</a></li>
 </ul>
 `);
});

/* =========================
   QUEUE + POSTING
========================= */
app.get("/queue",(req,res)=>res.json(pins));
app.get("/posted",(req,res)=>res.json(posted));

app.get("/clear",(req,res)=>{
 pins.length = 0;
 res.json({message:"cleared"});
});

/* =========================
   AUTO POST SIMULATION
========================= */
setInterval(()=>{

 if(pins.length === 0) return;

 const pin = pins.shift();
 pin.status = "POSTED";
 pin.postedAt = new Date();

 posted.push(pin);

 stats.posts++;
 stats.earnings += pin.earnings || 0;

 console.log("POSTED:",pin.product);

},5000);

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
 console.log("🚀 PIN AI FACTORY v17 FINAL SAAS DASHBOARD LIVE");
});