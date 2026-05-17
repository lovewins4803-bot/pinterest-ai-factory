import express from "express";

const app = express();
app.use(express.json());

/* =========================
   AFFILIATE ENGINE
========================= */

function buildAffiliateLinks(product) {
  const q = encodeURIComponent(product);

  return {
    amazon: `https://www.amazon.com/s?k=${q}`,
    ebay: `https://www.ebay.com/sch/i.html?_nkw=${q}`,
    cj: `https://www.cj.com/search?query=${q}`,
    admitad: `https://www.admitad.com/search/?q=${q}`,
    jvzoo: `https://www.jvzoo.com/content-search/${q}`
  };
}

/* =========================
   PIN GENERATOR
========================= */

function generatePin(product) {
  return {
    title: `🔥 ${product} You Need Now`,
    description: `${product} is trending right now and getting viral attention.`,
    hashtags: "#viral #affiliate #pinterest #amazonfinds #trending",
    overlay_text: "LIMITED TIME DEAL"
  };
}

/* =========================
   CREATE CAMPAIGN
========================= */

let campaigns = [];

app.post("/create-campaign", (req, res) => {
  const { product } = req.body;

  if (!product) {
    return res.status(400).json({ error: "product required" });
  }

  const campaign = {
    id: Date.now(),
    product,
    pin: generatePin(product),
    links: buildAffiliateLinks(product),
    clicks: 0,
    earnings: 0
  };

  campaigns.push(campaign);

  res.json({
    message: "CAMPAIGN CREATED",
    campaign
  });
});

/* =========================
   CLICK TRACKING
========================= */

app.post("/click", (req, res) => {
  const { campaignId, network } = req.body;

  const campaign = campaigns.find(c => c.id === campaignId);

  if (!campaign) {
    return res.status(404).json({ error: "not found" });
  }

  campaign.clicks += 1;

  let profit = 0;

  if (network === "amazon") profit = 0.5;
  if (network === "ebay") profit = 0.7;
  if (network === "cj") profit = 1.2;
  if (network === "admitad") profit = 1.0;
  if (network === "jvzoo") profit = 2.5;

  campaign.earnings += profit;

  res.json({
    message: "CLICK TRACKED",
    profit,
    campaign
  });
});

/* =========================
   VIEW ALL CAMPAIGNS
========================= */

app.get("/campaigns", (req, res) => {
  res.json(campaigns);
});

/* =========================
   PIN GENERATOR API
========================= */

app.post("/generate-pin", (req, res) => {
  const { product } = req.body;

  res.json(generatePin(product));
});

/* =========================
   HOME DASHBOARD
========================= */

app.get("/", (req, res) => {
  res.send(`
    <h1>💰 Affiliate Profit Engine v2</h1>
    <p>System Running 🚀</p>
  `);
});

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Profit Engine v2 running on port", PORT);
});