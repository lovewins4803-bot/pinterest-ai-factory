import express from "express";

const app = express();
app.use(express.json();

// ==============================
// PINTEREST AI FACTORY v6 FINAL
// ==============================

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function cleanTag(text) {
  return text.replace(/\s/g, "").replace(/[^a-zA-Z0-9]/g, "");
}

function affiliate(product) {
  return "https://www.amazon.com/s?k=" + encodeURIComponent(product);
}

// ==============================
// IMAGE PROMPT ENGINE (FINAL)
// ==============================
function imagePrompt(product, style) {
  const styles = {
    pinterest: "viral Pinterest aesthetic, clean background, soft lighting, 4:5 ratio",
    luxury: "high-end luxury product photography, cinematic lighting",
    minimal: "minimal clean aesthetic, white space, modern design"
  };

  return `
Create a professional Pinterest pin image of ${product}.
Style: ${styles[style]}.
Include empty space for bold text overlay.
Ultra sharp, high resolution, social media optimized.
`;
}

// ==============================
// MAIN ENGINE
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
      "Pinterest is obsessed with this",
      "Hidden gem alert"
    ];

    const hook = pick(hooks);

    const pins = Array.from({ length: 5 }).map((_, i) => ({
      id: i + 1,
      title: `${hook}: ${product}`,
      description: `${product} is trending on Pinterest. Highly recommended and widely shared.`,
      hashtags: `#${cleanTag(product)} #pinterest #viral #trending #aesthetic #amazonfinds`,
      overlay_text: hook.toUpperCase(),
      affiliate_link: affiliate(product)
    }));

    const images = {
      pinterest_style: imagePrompt(product, "pinterest"),
      luxury_style: imagePrompt(product, "luxury"),
      minimal_style: imagePrompt(product, "minimal")
    };

    res.json({
      product,
      hook,
      pins,
      images,
      monetization: {
        affiliate_link: affiliate(product),
        note: "Use affiliate link in pin description or bio"
      },
      automation_ready: {
        step1: "Generate content (DONE)",
        step2: "Send image prompts to AI image generator (DALL·E / SD / Leonardo)",
        step3: "Upload images + text to Pinterest manually or via API"
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================
// HEALTH CHECK
// ==============================
app.get("/", (req, res) => {
  res.send("Pinterest AI Factory v6 FINAL SYSTEM 🚀");
});

// ==============================
// RENDER FIX
// ==============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));