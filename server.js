import express from "express";

const app = express();
app.use(express.json());

/* ===============================
   TREND DATABASE
================================ */

const monthlyTrends = {
  1:["New Year goals","Declutter home"],
  2:["Valentines gifts","Self care"],
  3:["Spring cleaning","Organization"],
  4:["Spring decor","Gardening"],
  5:["Mothers day gifts","Kitchen upgrades"],
  6:["Summer prep","Travel essentials"],
  7:["Outdoor living","Vacation home"],
  8:["Back to school","Dorm setup"],
  9:["Fall decor","Cozy home"],
  10:["Halloween","Autumn kitchen"],
  11:["Black Friday deals","Gift ideas"],
  12:["Christmas gifts","Holiday kitchen"]
};

const angles = [
  "Problem solver",
  "Before & After",
  "Budget hack",
  "Luxury aesthetic",
  "Gift idea",
  "Viral trend"
];

function randomItem(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

/* ===============================
   DAILY PRODUCT DATABASE
   (you will grow this later)
================================ */

const products = [
  {name:"Sink Organizer", niche:"kitchen organization"},
  {name:"Vegetable Chopper", niche:"kitchen gadgets"},
  {name:"Closet Organizer", niche:"home organization"},
  {name:"Air Fryer Accessories", niche:"kitchen tools"}
];

/* ===============================
   PIN GENERATOR FUNCTION
================================ */

function generatePin(productObj){
  const month = new Date().getMonth()+1;
  const trend = randomItem(monthlyTrends[month]);
  const angle = randomItem(angles);

  return {
    product: productObj.name,
    title:`🔥 ${trend}: ${productObj.name} Everyone Is Buying`,
    description:`This ${productObj.name} is trending for ${trend}. Perfect for ${productObj.niche}. Pinterest users are saving this daily.`,
    hashtags:`#amazonfinds #viralproducts #${productObj.niche.replace(" ","")} #musthave`,
    overlay:`${trend.toUpperCase()} MUST HAVE`,
    angle
  };
}

/* ===============================
   AUTO DAILY GENERATOR
================================ */

let todayPins = [];

function generateDailyPins(){
  todayPins = products.map(p => generatePin(p));
  console.log("📌 Daily pins generated:", todayPins.length);
}

/* Generate pins every 24 hours */
setInterval(generateDailyPins, 24 * 60 * 60 * 1000);

/* Generate immediately on server start */
generateDailyPins();

/* ===============================
   API ROUTES
================================ */

app.get("/today-pins", (req,res)=>{
  res.json(todayPins);
});

app.get("/", (req,res)=>res.send("Auto Poster Brain Running 🤖"));

app.listen(3000, ()=>console.log("Server running"));