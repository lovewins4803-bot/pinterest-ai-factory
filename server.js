import express from "express";

const app = express();
app.use(express.json());

/* =========================
   PROFIT ENGINE
========================= */

function detectCategory(product) {
  const p = product.toLowerCase();

  if (p.includes("course") || p.includes("ebook") || p.includes("software")) return "digital";
  if (p.includes("phone") || p.includes("laptop") || p.includes("home") || p.includes("kitchen")) return "physical";
  if (p.includes("deal") || p.includes("cheap") || p.includes("discount")) return "budget";
  return "general";
}

function buildLinks(product) {
  const q = encodeURIComponent(product);

  return {
    amazon: `https://www.amazon.com/s?k=${q}`,
    ebay: `https://www.ebay.com/sch/i.html?_nkw=${q}`,
    cj: `https://www.cj.com/search?query=${q}`,
    admitad: `https://www.admitad.com/search/?q=${q}`,
    jvzoo: `https://www.jvzoo.com/content-search/${q}`
  };
}

function score(network, category) {
  const matrix = {
    amazon: { digital: 3, physical: 9, budget: 8, general: 8 },
    ebay: { digital: 4, physical: 7, budget: 9, general: 7 },
    cj: { digital: 8, physical: 6, budget: 5, general: 7 },
    admitad: { digital: 7, physical: 7, budget: 6, general: 7 },
    jvzoo: { digital: 10, physical: 2, budget: 3, general: 6 }
  };

  return matrix[network][category] || 5;
}

function optimize(product) {
  const category = detectCategory(product);
  const links = buildLinks(product);

  const scores = {};
  Object.keys(links).forEach(net => {
    scores[net] = score(net, category);
  });

  const bestNetwork = Object.keys(scores).reduce((a, b) =>
    scores[a] > scores[b] ? a : b
  );

  return {
    category,
    bestNetwork,
    bestLink: links[bestNetwork],
    allLinks: links,
    scores
  };
}

/* =========================
   API ENDPOINT
========================= */

app.post("/generate-pin", (req, res) => {
  const { product } = req.body;

  if (!product) {
    return res.status(400).json({ error: "product required" });
  }

  const optimizer = optimize(product);

  const pin = {
    title: `🔥 Viral ${product} You Must See`,
    description: `${product} is trending right now. High converting affiliate product.`,
    hashtags: "#viral #amazonfinds #affiliatemarketing #trending #pinterest",
    overlay_text: "DON'T MISS THIS DEAL"
  };

  res.json({
    product,
    pin,
    profit_engine: optimizer
  });
});

/* =========================
   DASHBOARD UI (NEW)
========================= */

app.get("/", (req, res) => {
  res.send(`
  <html>
  <head>
    <title>Pinterest AI Factory Dashboard</title>
    <style>
      body { font-family: Arial; background:#0f172a; color:white; padding:20px; }
      input, button { padding:10px; width:300px; margin:5px; }
      button { cursor:pointer; background:#22c55e; border:none; color:white; }
      pre { background:#1e293b; padding:10px; overflow:auto; }
    </style>
  </head>

  <body>
    <h1>🚀 Pinterest AI Factory Dashboard</h1>

    <input id="product" placeholder="Enter product e.g kitchen organizer" />
    <button onclick="testAPI()">Generate</button>

    <h3>Output:</h3>
    <pre id="output">Waiting...</pre>

    <script>
      async function testAPI() {
        const product = document.getElementById('product').value;

        const res = await fetch('/generate-pin', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ product })
        });

        const data = await res.json();
        document.getElementById('output').innerText = JSON.stringify(data, null, 2);
      }
    </script>
  </body>
  </html>
  `);
});

app.listen(3000, () => {
  console.log("SAAS DASHBOARD RUNNING ON PORT 3000");
});