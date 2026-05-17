const express = require("express");
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// -----------------------------
// TREND + AFFILIATE BRAIN
// -----------------------------

const products = [
  "Sink Organizer",
  "Vegetable Chopper",
  "Air Fryer Rack",
  "Closet Organizer",
  "Under Sink Storage",
  "Silicone Kitchen Set",
  "Shower Caddy"
];

const hooks = [
  "🔥 Trending on Amazon right now",
  "💡 Everyone is buying this",
  "🚀 Viral TikTok + Pinterest product",
  "⚡ Hidden Amazon gem",
  "🎯 Best home upgrade this week"
];

const angles = [
  "Problem solver",
  "Home upgrade",
  "Gift idea",
  "Kitchen hack",
  "Organization boost"
];

const hashtags = [
  "#amazonfinds #viral #pinterest #homehacks",
  "#kitchenhacks #amazonmusthaves #trending",
  "#homeorganization #lifehacks #musthave",
  "#viralproducts #amazonfinds #cleanhome"
];

// -----------------------------
// TIME ENGINE (USA → ETHIOPIA)
// -----------------------------

function getBestTime() {
  const times = [
    "2:00 PM Ethiopia (8 AM USA peak)",
    "8:00 PM Ethiopia (2 PM USA peak)",
    "3:00 AM Ethiopia (9 PM USA peak)"
  ];
  return times[Math.floor(Math.random() * times.length)];
}

// -----------------------------
// DAILY AFFILIATE BRAIN
// -----------------------------

function generateDailyPlan() {
  const product = products[Math.floor(Math.random() * products.length)];
  const hook = hooks[Math.floor(Math.random() * hooks.length)];
  const angle = angles[Math.floor(Math.random() * angles.length)];
  const hashtag = hashtags[Math.floor(Math.random() * hashtags.length)];

  return {
    today_action: "POST THIS",
    product: product,
    title: `${hook}: ${product}`,
    description: `${product} is trending and performing well on Amazon and Pinterest.\nPerfect for ${angle}.`,
    hashtags: hashtag,
    pin_style: angle,
    best_post_time: getBestTime(),
    recommendation_score: Math.floor(Math.random() * 40) + 60,
    affiliate_tip: "Use urgency words like: limited, trending, viral",
    decision: "POST NOW"
  };
}

// -----------------------------
// API ROUTES
// -----------------------------

app.get("/", (req,res)=>{
  res.send("Affiliate Brain System Running 🚀");
});

// DAILY PLAN (MAIN FEATURE)
app.get("/daily-plan", (req,res)=>{
  res.json(generateDailyPlan());
});

// MULTI PLAN (3 POSTS A DAY)
app.get("/weekly-plan", (req,res)=>{
  const plan = [];
  for(let i=0;i<3;i++){
    plan.push(generateDailyPlan());
  }
  res.json(plan);
});

app.listen(PORT, ()=>{
  console.log("Affiliate Brain running on port", PORT);
});