const express = require("express");
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// -------------------
// CORE DATA
// -------------------

app.get("/daily-plan", (req, res) => {

  const products = [
    { name: "Air Fryer Rack", niche: "kitchen", demand: 9 },
    { name: "Fridge Organizer", niche: "home", demand: 8 },
    { name: "Silicone Cooking Set", niche: "kitchen", demand: 7 }
  ];

  const pick = products[Math.floor(Math.random() * products.length)];

  let score = 40;
  score += pick.demand * 4;

  if (pick.niche === "kitchen") score += 10;
  if (pick.niche === "home") score += 8;

  const title = `Amazon trending 🔥 ${pick.name}`;
  const hashtags = "#amazonfinds #viral #pinterest";
  const best_time = "2 PM Ethiopia (US morning peak)";
  const decision = score > 70 ? "POST" : "SKIP";

  res.json({
    product: pick.name,
    title,
    hashtags,
    best_time,
    decision,
    score
  });

});
const products = [
  "Sink Organizer",
  "Vegetable Chopper",
  "Air Fryer Rack",
  "Closet Organizer",
  "Shower Caddy",
  "Under Sink Storage"
];

const hooks = [
  "🔥 Trending on Amazon",
  "💡 Viral Pinterest Product",
  "🚀 Everyone is buying this",
  "⚡ TikTok viral item",
  "🎯 Must-have home upgrade"
];

const hashtags = [
  "#amazonfinds #viral #pinterest",
  "#homehacks #kitchen #musthave",
  "#trending #amazonmusthaves",
  "#organization #cleanhome #lifehack"
];

// -------------------
// TIME ENGINE
// -------------------

function getBestTime(){
  const times = [
    "2 PM Ethiopia (US morning peak)",
    "8 PM Ethiopia (US afternoon peak)",
    "3 AM Ethiopia (US night peak)"
  ];
  return times[Math.floor(Math.random()*times.length)];
}

// -------------------
// 1. TEXT MODE ENGINE
// -------------------

app.post("/generate-pin", (req,res)=>{
  const { product } = req.body;

  const title = `${hooks[Math.floor(Math.random()*hooks.length)]}: ${product}`;
  const description = `${product} is trending in the US market. Perfect for home improvement and daily use.`;
  const hashtag = hashtags[Math.floor(Math.random()*hashtags.length)];

  res.json({
    product,
    title,
    description,
    hashtags: hashtag,
    best_time: getBestTime(),
    action: "POST",
    score: Math.floor(Math.random()*30)+70
  });
});

// -------------------
// 2. DAILY AFFILIATE BRAIN
// -------------------

  const product = products[Math.floor(Math.random()*products.length)];

  res.json({
    product,
    title: `${hooks[Math.floor(Math.random()*hooks.length)]}: ${product}`,
    description: `${product} is a high-performing affiliate product.`,
    hashtags: hashtags[Math.floor(Math.random()*hashtags.length)],
    best_time: getBestTime(),
    decision: "POST",
    score: Math.floor(Math.random()*40)+60,
    tip: "Use urgency words like: limited, viral, trending"
  });
});

// -------------------
// 3. IMAGE MODE ENGINE (NO DUPLICATE CREATION)
// -------------------

app.post("/image-pin",(req,res)=>{
  const { image_description } = req.body;

  const styles = [
    "Minimal aesthetic Pinterest design",
    "Luxury product showcase style",
    "Problem-solution infographic",
    "Before vs After transformation",
    "High contrast viral layout"
  ];

  const angles = [
    "Home improvement focus",
    "Kitchen optimization angle",
    "Lifestyle upgrade concept",
    "Gift idea positioning",
    "Organization hack style"
  ];

  res.json({
    input: image_description,
    improvement_style: styles[Math.floor(Math.random()*styles.length)],
    pin_title: "🔥 Viral Pinterest Visual Upgrade",
    pin_description: `This concept was enhanced into a high-performing Pinterest pin. Style: ${styles[Math.floor(Math.random()*styles.length)]}`,
    angle: angles[Math.floor(Math.random()*angles.length)],
    hashtags: "#pinterest #viral #aesthetic #design #amazonfinds",
    note: "Non-duplicate transformation engine (variation-based system)"
  });
});

// -------------------
// HEALTH CHECK
// -------------------

app.get("/", (req,res)=>{
  res.send("PIN AI FACTORY v2 RUNNING 🚀");
});

app.listen(PORT,()=>{
  console.log("System running on port",PORT);
});