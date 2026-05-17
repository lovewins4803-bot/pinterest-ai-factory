const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req,res)=>{
  res.send("Pinterest AI Factory Running 🚀");
});


// 🧠 SMART WORD POOLS (ANTI DUPLICATE ENGINE)
const powerWords = [
  "Must-Have","Viral","Trending","Amazon Favorite","Top Rated",
  "Genius","Game Changing","Life Changing","Customer Favorite"
];

const angles = [
  "Gift idea",
  "Problem solver",
  "Luxury aesthetic",
  "Kitchen upgrade",
  "Small space hack",
  "Organization hack"
];

const niches = [
  "kitchen gadgets",
  "home organization",
  "amazon finds",
  "cleaning hacks",
  "small apartment living"
];

const hashtagsPool = [
  "#amazonfinds","#viralproducts","#pinterestfinds",
  "#homeorganization","#kitchengadgets","#musthave",
  "#lifehacks","#cleanhome","#smallspaces"
];

function random(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

// 🧠 BEST POSTING TIME ENGINE (USA TIME → Ethiopia Time)
function bestTimeSuggestion(){
  const times = [
    "4:00 PM Ethiopia (8 AM EST)",
    "7:00 PM Ethiopia (11 AM EST)",
    "1:00 AM Ethiopia (7 PM EST BEST)",
    "3:00 AM Ethiopia (9 PM EST)"
  ];
  return random(times);
}


// 🧠 PIN GENERATOR
function generatePin(product){

  const power = random(powerWords);
  const niche = random(niches);
  const angle = random(angles);
  const time = bestTimeSuggestion();

  return {
    product: product,
    title: `🔥 ${power}: ${product} Everyone Is Buying`,
    description:
      `${product} is blowing up on Pinterest right now.
Perfect for ${niche}. Pinterest users are saving this daily.
Get yours before it goes viral.`,
    hashtags: hashtagsPool.sort(()=>0.5-Math.random()).slice(0,5).join(" "),
    overlay: `${power.toUpperCase()} ${product.toUpperCase()}`,
    angle: angle,
    best_post_time: time
  };
}


// 🔥 SINGLE PIN ROUTE
app.post("/generate-pin", (req,res)=>{
  try{
    const { product } = req.body;
    const pin = generatePin(product);
    res.json(pin);
  }catch(err){
    res.status(500).json({error:err.message});
  }
});


// 🔥 BULK PIN ROUTE (TAILWIND STYLE)
app.post("/generate-bulk-pins", (req,res)=>{
  try{
    const { products } = req.body;

    if(!products || !Array.isArray(products)){
      return res.status(400).json({error:"Send