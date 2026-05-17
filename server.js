import express from "express";

const app = express();
app.use(express.json());

// ==============================
// FREE SAAS CORE ENGINE
// ==============================

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function cleanTag(text) {
  return text.replace(/\s/g, "").replace(/[^a-zA-Z0-9]/g, "");
}

// FREE affiliate system
function affiliate(product) {
  return "https://www.amazon.com/s?k=" + encodeURIComponent(product);
}

// ==============================
// FREE IMAGE GENERATION (NO API KEY)
// Pollinations AI
// ==============================
function generateImageURL(prompt) {
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
}

// ==============================
// PIN ENGINE
// ==============================
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
      "Pinterest obsession alert",
      "Hidden gem you need"
    ];

    const hook = pick(hooks);

    const hashtags = `#${cleanTag(product)} #pinterest #viral #trending #amazonfinds`;

    // IMAGE PROMPTS (FREE API COMPATIBLE)
    const imagePrompt = `
Pinterest viral product photo of ${product},
aesthetic lighting, clean background,
minimal style, 4:5 vertical composition,
space for text overlay
`;

    const image_url = generateImageURL(imagePrompt);

    const pins = Array.from({ length: 5 }).map((_, i) => ({
      id: i + 1,
      title: `${hook}: ${product}`,
      description: `${product} is trending on Pinterest. Highly aesthetic and viral.`,
      hashtags,
      overlay_text: hook.toUpperCase(),
      affiliate_link: affiliate(product),
      image_url
    }));

    res.json({
      product,
      hook,
      pins,
      image_engine: "Pollinations AI (FREE)",
      affiliate: affiliate(product),
      saas_ready: {
        status: "WORKING FREE SAAS",
        next_step: "Add user accounts + dashboard UI"
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================
// HEALTH
// ==============================
app.get("/", (req, res) => {
  res.send("Pinterest AI Factory v7 SAAS (FREE VERSION) 🚀");
});

// ==============================
// RENDER FIX
// ==============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));