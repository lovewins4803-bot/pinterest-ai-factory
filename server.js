import express from "express";

const app = express();
app.use(express.json());

// =============================
// PINTEREST AI VIRAL ENGINE
// =============================
app.post("/generate-pin", (req, res) => {
  try {
    const { product } = req.body;

    if (!product) {
      return res.status(400).json({ error: "product is required" });
    }

    const hooks = [
      "You won’t believe this",
      "This is blowing up right now",
      "Everyone is saving this",
      "Stop scrolling for this",
      "Pinterest is obsessed with this"
    ];

    const hook = hooks[Math.floor(Math.random() * hooks.length)];

    const title = `🔥 ${hook}: ${product} That Everyone Wants`;

    const description = `
${product} is trending right now on Pinterest.

✔ Budget-friendly
✔ Highly aesthetic
✔ Extremely useful

This is going viral because people can’t stop saving it.
`;

    const hashtags = `#${product.replace(/\s/g, "")} #pinterest #viral #trending #aesthetic #musthave #lifehack`;

    const overlay_text = `${hook.toUpperCase()}`;

    res.json({
      title,
      description,
      hashtags,
      overlay_text
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================
// HEALTH CHECK ROUTE
// =============================
app.get("/", (req, res) => {
  res.send("Pinterest AI Factory is LIVE 🚀 (FREE VIRAL ENGINE)");
});

// =============================
// RENDER PORT FIX
// =============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));