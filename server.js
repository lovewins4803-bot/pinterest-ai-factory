import express from "express";

const app = express();
app.use(express.json());

// ==============================
// PINTEREST AI FACTORY v4
// (CONTENT + IMAGE + AUTOMATION READY)
// ==============================

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function cleanTag(text) {
  return text.replace(/\s/g, "").replace(/[^a-zA-Z0-9]/g, "");
}

// Affiliate link placeholder (safe)
function generateAffiliateLink(product) {
  return "https://www.amazon.com/s?k=" + encodeURIComponent(product);
}

// IMAGE PROMPT ENGINE (NEW 🔥)
function generateImagePrompt(product, style) {
  const styles = {
    aesthetic: "minimal aesthetic Pinterest style, soft lighting, clean background",
    luxury: "luxury modern design, high-end product photography, soft shadows",
    viral: "viral Pinterest pin style, bold text overlay space, eye-catching composition"
  };

  return `
A ${styles[style]} image of ${product}.
Centered composition, high resolution, Pinterest optimized, 4:5 aspect ratio,
text overlay space at top, soft natural lighting, ultra detailed.
`;
}

// MAIN ENDPOINT
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
      "Pinterest can’t stop this",
      "Hidden gem everyone missed"
    ];

    const hook = pick(hooks);

    const affiliate_link = generateAffiliateLink(product);

    const hashtags = [
      `#${cleanTag(product)}`,
      "#pinterest",
      "#viral",
      "#trending",
      "#aesthetic",
      "#amazonfinds",
      "#musthave"
    ].join(" ");

    // 3 IMAGE STYLES (VERY IMPORTANT FOR PINTEREST)
    const images = {
      aesthetic: generateImagePrompt(product, "aesthetic"),
      luxury: generateImagePrompt(product, "luxury"),
      viral: generateImagePrompt(product, "viral")
    };

    // MULTIPLE PIN VARIATIONS
    const pins = Array.from({ length: 5 }).map((_, i) => ({
      title: `${hook}: ${product} (${i + 1})`,
      description: `
${product} is trending on Pinterest.

✔ Useful & aesthetic
✔ Highly shareable
✔ Saves time and money
      `,
      hashtags,
      overlay_text: hook.toUpperCase(),
      affiliate_link
    }));

    res.json({
      product,
      hook,
      affiliate_link,
      pins,
      image_prompts: images
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// HEALTH
app.get("/", (req, res) => {
  res.send("Pinterest AI Factory v4 (CONTENT + IMAGE ENGINE) 🚀");
});

// RENDER FIX
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));