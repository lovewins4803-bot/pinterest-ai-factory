const express = require("express");
const app = express();

app.use(express.json());

/* =========================
   DATABASE (SIMPLIFIED MEMORY DB)
========================= */
let users = {};
let sessions = {};
let globalStats = {};

/* =========================
   AUTH SYSTEM (SIMPLE SAAS LOGIN)
========================= */
app.post("/register",(req,res)=>{

 const {userId} = req.body;

 if(users[userId]){
   return res.json({message:"User already exists"});
 }

 users[userId] = {
   products:[],
   pins:[],
   earnings:0,
   clicks:0
 };

 res.json({message:"registered",userId});
});

/* =========================
   LOGIN SESSION
========================= */
app.post("/login",(req,res)=>{

 const {userId} = req.body;

 if(!users[userId]){
   return res.json({message:"User not found"});
 }

 const token = Date.now()+Math.random().toString(36);

 sessions[token] = userId;

 res.json({token});
});

/* =========================
   GET USER FROM TOKEN
========================= */
function getUser(token){
 return users[sessions[token]];
}

/* =========================
   LUXURY SCORE ENGINE
========================= */
function score(name){
 let s = 50;
 const n = name.toLowerCase();

 if(n.includes("gold")) s += 15;
 if(n.includes("marble")) s += 15;
 if(n.includes("glass")) s += 10;
 if(n.includes("luxury")) s += 10;
 if(name.length < 30) s += 10;

 s += Math.floor(Math.random()*30);

 return s;
}

/* =========================
   VIRAL PIN GENERATOR
========================= */
function createPin(product){

 const s = score(product.name);

 return {
   id: Date.now(),
   product: product.name,
   title: `I wish I knew this sooner 😳 ${product.name}`,
   description: `${product.name} trending in Pinterest Luxury niche`,
   hashtags: "#amazonfinds #affordableluxury #pinterestviral",
   score: s,
   earnings: (s/10).toFixed(2),
   decision: s > 70 ? "POST" : "HOLD"
 };
}

/* =========================
   ADD PRODUCT (PER USER)
========================= */
app.post("/add-product",(req,res)=>{

 const {token,name} = req.body;
 const user = getUser(token);

 if(!user) return res.json({message:"invalid session"});

 user.products.push({name});

 res.json({message:"added",name});
});

/* =========================
   SMART ENGINE (PER USER)
========================= */
app.get("/smart",(req,res)=>{

 const token = req.headers.token;
 const user = getUser(token);

 if(!user) return res.json({message:"invalid session"});

 if(user.products.length === 0){
   return res.json({message:"no products"});
 }

 let best = null;
 let bestScore = 0;

 user.products.forEach(p=>{

   const s = score(p.name);

   if(s > bestScore){
     bestScore = s;
     best = p;
   }

 });

 const pin = createPin(best);

 if(pin.decision === "POST"){
   user.pins.push(pin);
   user.earnings += parseFloat(pin.earnings);
 }

 res.json(pin);
});

/* =========================
   BATCH GENERATOR
========================= */
app.get("/batch",(req,res)=>{

 const token = req.headers.token;
 const user = getUser(token);

 if(!user) return res.json({message:"invalid session"});

 let batch = [];

 for(let i=0;i<5;i++){

   const p = user.products[Math.floor(Math.random()*user.products.length)];
   if(!p) continue;

   batch.push(createPin(p));
 }

 res.json(batch);
});

/* =========================
   DASHBOARD (PER USER)
========================= */
app.get("/dashboard",(req,res)=>{

 const token = req.headers.token;
 const user = getUser(token);

 if(!user) return res.json({message:"invalid session"});

 res.json({
   products:user.products.length,
   pins:user.pins.length,
   earnings:user.earnings,
   clicks:user.clicks
 });
});

/* =========================
   GLOBAL ANALYTICS
========================= */
app.get("/global",(req,res)=>{

 let totalUsers = Object.keys(users).length;
 let totalEarnings = 0;

 Object.values(users).forEach(u=>{
   totalEarnings += u.earnings;
 });

 res.json({
   users: totalUsers,
   earnings: totalEarnings
 });
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
 console.log("🚀 PIN AI FACTORY v18 SAAS SYSTEM LIVE");
});