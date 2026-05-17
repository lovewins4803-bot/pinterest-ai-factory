import express from "express";

const app = express();
app.use(express.json());

// -----------------------------
// PIN AI FACTORY CORE ENGINE (MVP)
// -----------------------------

function getUSPostingTime() {
  // Simple US best posting window simulation
  const times = [
    "08:30 AM EST",
    "12:30 PM EST",
    "08:30 PM EST"
  ];
  return times[Math.floor(Math.random() * times.length)];
}

function convertToEthiopiaTime(usTime) {
  return `${usTime} (≈ Ethiopia next day shift window)`;
}

function generateHashtags(product) {
  return `#amazonfinds #viral #pinterest #affiliatemarketing #${product.replace(/\s/g, "").toLowerCase()}`;
}

function generatePin(product) {
  const hooks = [
    "🔥 Everyone is buying this right now",
    "💡 You didn’t know you needed this",
    "🚀 Viral Amazon find trending now",
    "⚡ Game-changing home upgrade",
    "🎯 Best hidden gem product"
  ];

  const angles = [
    "Problem Solver",
    "Gift Idea",
    "Home Upgrade",
    "Budget Hack",
    "Viral Trend"
  ];

  const hook = hooks[Math.floor(Math.random() * hooks.length)];
  const angle = angles[Math.floor(Math.random() * angles.length)];

  return {
    product,
    title: `${hook}: ${product}`,
    description: `${product} is trending right now on Pinterest and Amazon.\nPerfect for everyday use and highly recommended by buyers.\nDon’t miss this viral opportunity!`,
    hashtags: generateHashtags(product),
    overlay_text: `${product.toUpperCase()} MUST HAVE`,
    pin_angle: angle,
    affiliate_hook: `Grab this ${product} before it sells out!`,
    seo_keywords: `${product}, amazon finds, viral products, trending items`,
    board_suggestion: "Amazon Finds / Viral Products",
    best_post_time: getUSPostingTime(),
    ethiopia_time: convertToEthiopiaTime(getUSPostingTime()),
    manual_edit: [
      "Improve hook strength if needed",
      "Add urgency words like 'limited', 'viral', 'trending'",
      "Check affiliate link placement"
    ]
  };
}

// -----------------------------
// API ROUTE
// -----------------------------

app.post("/generate-pin", (req, res) => {
  try {
    const { product } = req.body;

    if (!product) {
      return res.status(400).json({ error: "Product is required" });
    }

    const pin = generatePin(product);

    res.json(pin);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// HEALTH CHECK
// -----------------------------

app.get("/", (req, res) => {
  res.send("Pin AI Factory MVP is running 🚀");
});

// -----------------------------

app.listen(3000, () => {
  console.log("Pin AI Factory MVP running on port 3000");
});