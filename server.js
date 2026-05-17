import express from "express";

const app = express();
app.use(express.json());

// ==============================
// SMART PINTEREST AI ENGINE v2
// ==============================

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function cleanTag(text) {
  return text.replace(/\s/g, "").replace(/[^a-zA-Z0-9]/g, "");
}

// Main endpoint
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
      "Pinterest can’t stop sharing this",
      "Hidden gem you need to see"
    ];

    const benefits = [
      "saves time instantly",
      "makes life easier",
      "looks aesthetic and clean",
      "budget-friendly solution",
      "trending in 2026"
    ];

    const hook = pick(hooks);
    const benefit = pick(benefits);

    const title = `🔥 ${hook}: ${product} That ${benefit}`;

    const description = `
${product} is one of the most trending ideas right now on Pinterest.

✔ ${benefit}
✔ Highly shareable
✔ Perfect for daily use

People are saving this fast — don’t miss the trend.
`;

    const hashtags = [
      `#${cleanTag(product)}`,
      "#pinterest",
      "#viral",
      "#trending",
      "#aesthetic",
      "#musthave",
      "#lifehack"
    ].join(" ");

    const overlay_text = `${hook.toUpperCase()}`;

    // BONUS: multiple variations (for scaling Pinterest)
    const variations = [
      `${hook}: ${product}`,
      `Why everyone is talking about ${product}`,
      `${product} that is going viral`
    ];

    res.json({
      title,
      description,
      hashtags,
      overlay_text,
      variations
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("Pinterest AI Factory v2 is LIVE 🚀");
});

// Render fix
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));