import express from "express";

const app = express();
app.use(express.json());

// ==============================
// PINTEREST BULK + AFFILIATE AI
// ==============================

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function cleanTag(text) {
  return text.replace(/\s/g, "").replace(/[^a-zA-Z0-9]/g, "");
}

// Fake affiliate generator (safe placeholder system)
function generateAffiliateLink(product) {
  const base = "https://www.amazon.com/s?k=";
  return base + encodeURIComponent(product);
}

// MAIN BULK ENGINE
app.post("/generate-pin", (req, res) => {
  try {
    const { product } = req.body;

    if (!product) {
      return res.status(400).json({ error: "product is required" });
    }

    const hooks = [
      "This is going viral",
      "Everyone is saving this",
      "Stop scrolling now",
      "Pinterest is obsessed with this",
      "Hidden gem you need"
    ];

    const benefits = [
      "saves time instantly",
      "makes life easier",
      "looks aesthetic",
      "is budget-friendly",
      "is trending in 2026"
    ];

    const hook = pick(hooks);
    const benefit = pick(benefits);

    const affiliate_link = generateAffiliateLink(product);

    const baseTitle = `${hook}: ${product}`;

    const description = `
${product} is trending fast on Pinterest.

✔ ${benefit}
✔ Highly shareable idea
✔ Used by thousands of people

Don’t miss this trending product.
`;

    const hashtags = [
      `#${cleanTag(product)}`,
      "#pinterest",
      "#viral",
      "#trending",
      "#aesthetic",
      "#musthave",
      "#amazonfinds"
    ].join(" ");

    const overlay_text = hook.toUpperCase();

    // 🔥 BULK VARIATIONS (CORE UPGRADE)
    const pins = Array.from({ length: 5 }).map((_, i) => ({
      title: `${baseTitle} (${i + 1})`,
      description,
      hashtags,
      overlay_text,
      affiliate_link
    }));

    res.json({
      product,
      affiliate_link,
      pins
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("Pinterest AI Factory v3 (BULK + AFFILIATE) is LIVE 🚀");
});

// Render port fix
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));