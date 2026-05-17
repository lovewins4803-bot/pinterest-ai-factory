import express from "express";

const app = express();
app.use(express.json());

// FREE Pinterest AI generator (no API, no billing)
app.post("/generate-pin", (req, res) => {
  try {
    const { product } = req.body;

    if (!product) {
      return res.status(400).json({ error: "product is required" });
    }

    const title = `🔥 Must-Have ${product} You Didn’t Know You Needed`;

    const description = `Discover ${product} that is trending right now.
Perfect for everyday use and highly recommended by users on Pinterest.
Don’t miss out before it goes viral!`;

    const hashtags = `#${product.replace(/\s/g, "")} #pinterest #viral #amazonfinds #trending #musthave`;

    const overlay_text = `DON'T MISS THIS ${product.toUpperCase()}`;

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

// Test route
app.get("/", (req, res) => {
  res.send("Pinterest AI Factory FREE VERSION is running 🚀");
});

// Render port fix
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
