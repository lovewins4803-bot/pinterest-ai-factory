const express = require("express");
const app = express();
app.use(express.json());

/* =========================
   MEMORY
========================= */
let pinQueue = [];
let postedPins = [];

/* =========================
   HOME DASHBOARD
========================= */
app.get("/", (req, res) => {
res.send(`
<h1>PIN AI FACTORY v5 – Luxury Engine 💎</h1>
<p>System running.</p>
<ul>
<li>/smart-product</li>
<li>/generate-from-link?name=Sink Organizer&link=https://amazon.com</li>
<li>/queue</li>
<li>/posted</li>
</ul>
`);
});

/* =========================
   HEALTH CHECK
========================= */
app.get("/health",(req,res)=>{
res.json({status:"running v5 luxury engine"});
});

/* =========================
   LUXURY PRODUCT DATABASE
   (Simulated Amazon Intelligence)
========================= */
const luxuryProducts = [
 {name:"Gold Kitchen Faucet", niche:"kitchen", demand:10, price:"$$"},
 {name:"Marble Soap Dispenser", niche:"home", demand:9, price:"$"},
 {name:"Velvet Jewelry Organizer", niche:"aesthetic", demand:9, price:"$"},
 {name:"Minimalist LED Desk Lamp", niche:"aesthetic", demand:10, price:"$$"},
 {name:"Glass Spice Jars Set", niche:"kitchen", demand:9, price:"$"},
 {name:"Luxury Shower Shelf", niche:"bathroom", demand:10, price:"$"},
 {name:"Modern Bedside Lamp", niche:"bedroom", demand:8, price:"$"},
 {name:"Acrylic Makeup Organizer", niche:"beauty", demand:9, price:"$"},
 {name:"Gold Cutlery Set", niche:"kitchen", demand:10, price:"$$"},
 {name:"Smart Motion Sensor Light", niche:"home", demand:9, price:"$"}
];

/* =========================
   TREND ANALYZER
========================= */
function analyzeTrend(product){
 let score = 60;

 if(product.niche==="kitchen") score+=10;
 if(product.niche==="aesthetic") score+=15;
 if(product.price==="$") score+=10;
 score+=product.demand*2;
 score+=Math.floor(Math.random()*10);

 let label="GOOD";
 if(score>80) label="HOT";
 if(score>90) label="VIRAL";

 return {score,label};
}

/* =========================
   SMART PRODUCT PICKER
========================= */
app.get("/smart-product",(req,res)=>{

 const pick = luxuryProducts[Math.floor(Math.random()*luxuryProducts.length)];
 const trend = analyzeTrend(pick);

 const decision = trend.score>75 ? "POST" : "HOLD";

 const pin = {
   id: Date.now(),
   product: pick.name,
   niche: pick.niche,
   title: `Stop scrolling 😍 ${pick.name}`,
   description: `${pick.name} is going viral in USA Pinterest right now.`,
   hashtags:"#amazonfinds #luxuryfinds #pinterestviral #affiliatemarketing",
   best_time:"2 PM Ethiopia (US morning peak)",
   trend_score:trend.score,
   trend_label:trend.label,
   decision
 };

 if(decision==="POST"){
   pinQueue.push(pin);
 }

 res.json(pin);
});

/* =========================
   GENERATE FROM AMAZON LINK
========================= */
app.get("/generate-from-link",(req,res)=>{

 const name = req.query.name || "Amazon Product";
 const link = req.query.link || "Amazon Link";

 const pin = {
   id: Date.now(),
   product:name,
   link,
   title:`Amazon Find You Didn’t Know You Needed 😍`,
   description:`${name} is trending on Pinterest USA right now.`,
   hashtags:"#amazonfinds #luxuryfinds #viralproducts",
   best_time:"3 AM Ethiopia (US night peak)",
   status:"QUEUED",
   createdAt:new Date()
 };

 pinQueue.push(pin);
 res.json({message:"Amazon product queued",pin});
});

/* =========================
   QUEUE VIEW
========================= */
app.get("/queue",(req,res)=>{
 res.json({total:pinQueue.length,pins:pinQueue});
});

/* =========================
   POSTED PINS
========================= */
app.get("/posted",(req,res)=>{
 res.json({total:postedPins.length,pins:postedPins});
});

/* =========================
   AUTO POST SIMULATOR
========================= */
setInterval(()=>{
 if(pinQueue.length===0) return;

 const pin = pinQueue.shift();
 pin.status="POSTED";
 pin.postedAt=new Date();
 postedPins.push(pin);

 console.log("AUTO POSTED:",pin.product);

},60000);

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
 console.log("PIN AI FACTORY v5 RUNNING 🚀");
});