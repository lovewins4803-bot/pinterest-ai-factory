import express from "express";

const app = express();
app.use(express.json());

// ==============================
// PINTEREST AI FACTORY v5
// FULL BUSINESS PIPELINE ENGINE
// ==============================

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function cleanTag(text) {
  return text.replace(/\s/g, "").replace(/[^a-zA-Z0-9]/g, "");
}

// Affiliate system (safe placeholder)
function generateAffiliateLink(product) {
  return "https://www.amazon.com/s?k=" + encodeURIComponent(product);
}

// Hook engine
function getHook() {
  const hooks = [
    "This is going viral",
    "Everyone is saving this",
    "Stop scrolling now",
    "Pinterest is obsessed with this",
    "Hidden gem you need right now"
  ];
  return pick(hooks);
}

// Image prompt generator (REAL workflow core)
function buildImagePrompt(product, style) {
  const styles = {
    aesthetic: "soft aesthetic Pinterest style, minimal background, natural lighting",
    luxury: "luxury product photography, premium look, high-end branding",
    viral: "viral Pinterest pin design, bold composition, space for text overlay"
  };

  return `
Create a high-quality Pinterest pin image of ${product}.
Style: ${styles[style]}.
Aspect ratio 4:5, centered composition.
Include clean space for headline text overlay.
Ultra detailed, social media optimized.
`;
}

// MAIN ENGINE
app.post("/generate-pin", (req, res) => {
  try {
    const { product } = req.body;

    if (!product) {
      return res.status(400).json({ error: "product is required" });
    }

    const hook = getHook();
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

    // CONTENT GENERATION
    const pinContent = Array.from({ length: 5 }).map((_, i) => ({
      id: i + 1,
      title: `${hook}: ${product}`,
      description: `
${product} is trending right now on Pinterest.

✔ Saves time
✔ Looks aesthetic
✔ Highly recommended

People are saving this fast — don’t miss it.
      `,
      hashtags,
      overlay_text: hook.toUpperCase(),
      affiliate_link
    }));

    // IMAGE LAYER (IMPORTANT UPGRADE)
    const images = {
      aesthetic: buildImagePrompt(product, "aesthetic"),
      luxury: buildImagePrompt(product, "luxury"),
      viral: buildImagePrompt(product, "viral")
    };

    // FINAL PACKAGE (BUSINESS FORMAT)
    const responsePackage = {
      product,
      hook,
      affiliate_link,

      // content layer
      pins: pinContent,

      // visual layer
      image_prompts: images,

      // business insight layer
      strategy: {
        recommendation: "Post 3–5 variations daily for best Pinterest reach",
        best_style: "viral + aesthetic mix",
        monetization: "Use affiliate link in bio or pin description"
      }
    };

    res.json(responsePackage);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// health check
app.get("/", (req, res) => {
  res.send("Pinterest AI Factory v5 (FULL BUSINESS ENGINE) 🚀");
});

// server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));