import express from "express";

const app = express();
app.use(express.json());

/* ===============================
   TREND DATABASE (FREE)
================================ */

const monthlyTrends = {
  1: ["New Year goals", "Home reset", "Declutter"],
  2: ["Valentines gifts", "Self care", "Romantic home"],
  3: ["Spring cleaning", "Organization", "Fresh home"],
  4: ["Spring decor", "Outdoor living", "Gardening"],
  5: ["Mother's day", "Kitchen upgrades", "Home refresh"],
  6: ["Summer prep", "Travel essentials", "Beach items"],
  7: ["Summer hacks", "Outdoor kitchen", "Vacation home"],
  8: ["Back to school", "Study setup", "Dorm essentials"],
  9: ["Fall decor", "Cozy home", "Organization reset"],
  10:["Halloween", "Autumn home", "Cozy kitchen"],
  11:["Black Friday", "Gift ideas", "Holiday prep"],
  12:["Christmas gifts", "Holiday kitchen", "Winter home"]
};

const marketingAngles = [
  "Problem solving",
  "Before and after",
  "Listicle",
  "Urgency",
  "Curiosity",
  "Luxury aesthetic",
  "Budget hack",
  "Gift idea",
  "Trend alert"
];

function randomItem(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

/* ===============================
   TREND REACTIVE PIN GENERATOR
================================ */

app.post("/generate-pin", (req,res)=>{
  const { product, niche } = req.body;
  const month = new Date().getMonth()+1;

  const trend = randomItem(monthlyTrends[month]);
  const angle = randomItem(marketingAngles);

  const title = `🔥 ${trend}: ${product} Everyone Is Buying`;
  const description =
  `This ${product} is trending for ${trend}. 
Perfect for people searching ${niche}. 
Pinterest users are saving this like crazy!`;

  const hashtags = `#amazonfinds #viralproducts #${niche.replace(" ","")} #musthave #trendingnow`;

  const overlay = `${trend.toUpperCase()} MUST HAVE`;

  res.json({
    trend,
    angle,
    title,
    description,
    hashtags,
    overlay
  });
});

app.get("/", (req,res)=>res.send("Trend Engine Running 🚀"));

app.listen(3000, ()=>console.log("Server running"));