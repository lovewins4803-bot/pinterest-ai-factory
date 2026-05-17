import express from "express";

const app = express();
app.use(express.json());

/* =========================
   SIMPLE "DATABASE"
========================= */

let users = {};
let campaigns = [];

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
    title: `🔥 Viral ${product} You Need Now`,
    description: `${product} is trending across Pinterest and affiliate networks.`,
    hashtags: "#viral #pinterest #affiliate #amazonfinds #trending",
    overlay_text: "LIMITED TIME DEAL"
  };
}

/* =========================
   USER SYSTEM (SIMULATED LOGIN)
========================= */

app.post("/login", (req, res) => {
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ error: "userId required" });

  if (!users[userId]) {
    users[userId] = {
      id: userId,
      earnings: 0,
      clicks: 0
    };
  }

  res.json(users[userId]);
});

/* =========================
   CREATE CAMPAIGN
========================= */

app.post("/create-campaign", (req, res) => {
  const { userId, product } = req.body;

  if (!userId || !product) {
    return res.status(400).json({ error: "userId + product required" });
  }

  const pin = generatePin(product);
  const links = buildAffiliateLinks(product);

  const campaign = {
    id: Date.now(),
    userId,
    product,
    pin,
    links,
    clicks: 0,
    earnings: 0,
    createdAt: new Date().toISOString()
  };

  campaigns.push(campaign);

  res.json({
    message: "CAMPAIGN CREATED",
    campaign
  });
});

/* =========================
   TRACK CLICK (SIMULATED PROFIT)
========================= */

app.post("/click", (req, res) => {
  const { campaignId, network } = req.body;

  const campaign = campaigns.find(c => c.id === campaignId);

  if (!campaign) return res.status(404).json({ error: "not found" });

  campaign.clicks += 1;

  let profit = 0;

  if (network === "amazon") profit = 0.5;
  if (network === "ebay") profit = 0.7;
  if (network === "cj") profit = 1.2;
  if (network === "admitad") profit = 1.0;
  if (network === "jvzoo") profit = 2.5;

  campaign.earnings += profit;

  if (users[campaign.userId]) {
    users[campaign.userId].clicks += 1;
    users[campaign.userId].earnings += profit;
  }

  res.json({
    message: "CLICK TRACKED",
    profit,
    campaign
  });
});

/* =========================
   DASHBOARD
========================= */

app.get("/", (req, res) => {
  res.send(`
  <html>
  <head>
    <title>SAAS PROFIT DASHBOARD</title>
    <style>
      body { font-family: Arial; background:#0f172a; color:white; padding:20px; }
      input, button { padding:10px; width:300px; margin:5px; }
      button { background:#22c55e; border:none; color:white; cursor:pointer; }
      pre { background:#1e293b; padding:10px; }
    </style>
  </head>

  <body>
    <h1>🚀 SAAS PROFIT ENGINE</h1>

    <h3>Login</h3>
    <input id="userId" placeholder="Enter user ID" />
    <button onclick="login()">Login</button>

    <h3>Create Campaign</h3>
    <input id="product" placeholder="Product name" />
    <button onclick="create()">Create Campaign</button>

    <h3>Output</h3>
    <pre id="out">Waiting...</pre>

    <script>
      let userIdGlobal = "";

      async function login() {
        const userId = document.getElementById("userId").value;
        userIdGlobal = userId;

        const res = await fetch("/login", {
          method:"POST",
          headers:{ "Content-Type":"application/json" },
          body: JSON.stringify({ userId })
        });

        const data = await res.json();
        document.getElementById("out").innerText = JSON.stringify(data, null, 2);
      }

      async function create() {
        const product = document.getElementById("product").value;

        const res = await fetch("/create-campaign", {
          method:"POST",
          headers:{ "Content-Type":"application/json" },
          body: JSON.stringify({ userId: userIdGlobal, product })
        });

        const data = await res.json();
        document.getElementById("out").innerText = JSON.stringify(data, null, 2);
      }
    </script>
  </body>
  </html>
  `);
});

app.listen(3000, () => {
  console.log("SAAS PROFIT ENGINE V1 RUNNING");
});