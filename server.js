import express from "express";

const app = express();
app.use(express.json());

/* =========================
   PROFIT OPTIMIZER ENGINE
========================= */

function detectCategory(product) {
  const p = product.toLowerCase();

  if (p.includes("course") || p.includes("ebook") || p.includes("software")) {
    return "digital";
  }

  if (p.includes("phone") || p.includes("laptop") || p.includes("kitchen") || p.includes("home")) {
    return "physical_high_value";
  }

  if (p.includes("deal") || p.includes("cheap") || p.includes("discount")) {
    return "budget";
  }

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
    amazon: { digital: 3, physical_high_value: 9, budget: 8, general: 8 },
    ebay: { digital: 4, physical_high_value: 7, budget: 9, general: 7 },
    cj: { digital: 8, physical_high_value: 6, budget: 5, general: 7 },
    admitad: { digital: 7, physical_high_value: 7, budget: 6, general: 7 },
    jvzoo: { digital: 10, physical_high_value: 2, budget: 3, general: 6 }
  };

  return matrix[network][category] || 5;
}

function optimize(product) {
  const category = detectCategory(product);
  const links = buildLinks(product);

  const scores = {};

  Object.keys(links).forEach((net) => {
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
   PIN GENERATION API
========================= */

app.post("/generate-pin", async (req, res) => {
  try {
    const { product } = req.body;

    if (!product) {
      return res.status(400).json({ error: "product is required" });
    }

    const optimizer = optimize(product);

    const pin = {
      title: `🔥 Best ${product} You Should Not Miss`,
      description: `${product} is trending right now. High demand product for 2026 buyers.`,
      hashtags: "#pinterest #viral #amazonfinds #affiliatemarketing #trending",
      overlay_text: "DON'T MISS THIS DEAL"
    };

    res.json({
      product,
      pin,
      profit_engine: optimizer
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ========================= */

app.get("/", (req, res) => {
  res.send("Pinterest AI Factory + Profit Optimizer Engine Running 🚀");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});