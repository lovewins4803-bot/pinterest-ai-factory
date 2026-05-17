import express from "express";

const app = express();
app.use(express.json());

// simple FREE Pinterest pin generator (no APIs needed)
app.post("/generate-pin", (req, res) => {
  const { product } = req.body;

  if (!product) {
    return res.status(400).json({ error: "product is required" });
  }

  const pin = {
    title: `🔥 ${product} You Need Right Now`,
    description: `${product} is trending right now on Pinterest. Perfect for everyday use and highly recommended.`,
    hashtags: "#viral #pinterest #trending #amazonfinds #affiliate",
    overlay_text: "DON'T MISS THIS"
  };

  res.json(pin);
});

// home route
app.get("/", (req, res) => {
  res.send("Pinterest AI Factory is running 🚀 (FREE VERSION)");
});

// IMPORTANT: Render uses process.env.PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});