const express = require("express");
const app = express();

app.use(express.json());

/* =========================
   MEMORY
========================= */
let pinQueue = [];
let postedPins = [];

/* =========================
   HOME
========================= */
app.get("/", (req, res) => {
res.send("PIN AI FACTORY RUNNING");
});

/* =========================
   HEALTH
========================= */
app.get("/health", (req, res) => {
  res.json({ status: "ok", version: "v5-fixed" });
});

/* =========================
   GENERATE BASIC PIN
========================= */
app.get("/generate-pin", (req, res) => {

  const pin = {
    id: Date.now(),
    product: "Auto Product",
    status: "QUEUED",
    createdAt: new Date().toISOString()
  };

  pinQueue.push(pin);

  res.json({
    message: "queued",
    pin,
    queueSize: pinQueue.length
  });

});

/* =========================
   GENERATE FROM IMAGE
========================= */
app.get("/generate-from-image", (req,res)=>{

const pin = {
 id: Date.now(),
 product: "Image Based Product",
 title: "Stop scrolling 😍 You need this!",
 description: "This viral Pinterest product is trending in the USA right now.",
 hashtags: "#pinteresttrends #amazonfinds #viral",
 best_time: "2 PM Ethiopia (US morning peak)",
 status: "QUEUED",
 createdAt: new Date()
};

pinQueue.push(pin);

res.json({
 message:"Image pin generated",
 pin,
 queueSize: pinQueue.length
});

});

/* =========================
   GENERATE FROM AMAZON LINK
========================= */
app.get("/generate-from-link", (req,res)=>{

const productLink = req.query.link || "Amazon Product";
const productName = req.query.name || "Amazon Product";

const pin = {
 id: Date.now(),
 product: productName,
 link: productLink,
 title: "Amazon Find You Didn’t Know You Needed 😍",
 description: productName + " is trending on Pinterest USA right now.",
 hashtags: "#amazonfinds #pinteresttrends #viralproducts",
 best_time: "3 AM Ethiopia (US night peak)",
 image_source: "Amazon product image (auto)",
 status: "QUEUED",
 createdAt: new Date()
};

pinQueue.push(pin);

res.json({
 message:"Amazon link processed",
 pin,
 queueSize: pinQueue.length
});

});

/* =========================
   QUEUE VIEW
========================= */
app.get("/queue", (req, res) => {
  res.json({ total: pinQueue.length, pins: pinQueue });
});

/* =========================
   POSTED VIEW
========================= */
app.get("/posted", (req, res) => {
  res.json({ total: postedPins.length, pins: postedPins });
});

/* =========================
   CLEAR QUEUE
========================= */
app.get("/clear", (req,res)=>{
pinQueue.length = 0;
res.json({message:"queue cleared"});
});

/* =========================
   AUTO SCHEDULER
========================= */
setInterval(() => {

  if (pinQueue.length === 0) return;

  const pin = pinQueue.shift();

  pin.status = "POSTED";
  pin.postedAt = new Date().toISOString();

  postedPins.push(pin);

  console.log("POSTED:", pin.id);

}, 60000);

/* =========================
   START SERVER (LAST!)
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`PIN AI FACTORY running on port ${PORT}`);
});