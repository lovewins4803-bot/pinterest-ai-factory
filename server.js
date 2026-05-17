import express from "express";

const app = express();
app.use(express.json());

/* =========================
   MEMORY (SIMULATED DB)
========================= */

let postQueue = [];

/* =========================
   PIN GENERATOR
========================= */

function generatePin(product) {
  return {
    title: `🔥 Viral ${product} You Need Today`,
    description: `${product} is trending on Pinterest. Don’t miss this deal.`,
    hashtags: "#viral #pinterest #amazonfinds #trending #affiliatemarketing",
    overlay_text: "LIMITED TIME DEAL"
  };
}

/* =========================
   BOARD SYSTEM (SIMULATED)
========================= */

const boards = [
  "Kitchen Finds",
  "Home Essentials",
  "Amazon Must Haves",
  "Trending Products",
  "Affiliate Deals"
];

/* =========================
   CREATE PIN (NO POST YET)
========================= */

app.post("/create-pin", (req, res) => {
  const { product } = req.body;

  if (!product) return res.status(400).json({ error: "product required" });

  const pin = generatePin(product);

  res.json({
    product,
    pin,
    boards
  });
});

/* =========================
   SCHEDULE POST (QUEUE SYSTEM)
========================= */

app.post("/schedule-post", (req, res) => {
  const { product, board } = req.body;

  if (!product || !board) {
    return res.status(400).json({ error: "product + board required" });
  }

  const pin = generatePin(product);

  const task = {
    id: Date.now(),
    product,
    board,
    pin,
    status: "queued"
  };

  postQueue.push(task);

  res.json({
    message: "POST SCHEDULED",
    task
  });
});

/* =========================
   AUTO PROCESSOR (SIMULATED POSTER)
========================= */

function processQueue() {
  postQueue = postQueue.map(task => {
    if (task.status === "queued") {
      return {
        ...task,
        status: "posted",
        postedAt: new Date().toISOString()
      };
    }
    return task;
  });
}

// auto run every 10 seconds
setInterval(processQueue, 10000);

/* =========================
   DASHBOARD UI
========================= */

app.get("/", (req, res) => {
  res.send(`
  <html>
  <head>
    <title>Auto Poster SaaS</title>
    <style>
      body { font-family: Arial; background:#0f172a; color:white; padding:20px; }
      input, select, button { padding:10px; margin:5px; width:300px; }
      button { background:#22c55e; color:white; border:none; cursor:pointer; }
      pre { background:#1e293b; padding:10px; }
    </style>
  </head>

  <body>
    <h1>🚀 AUTO POSTER SAAS DASHBOARD</h1>

    <h3>Create Pin</h3>
    <input id="product" placeholder="Enter product" />
    <button onclick="createPin()">Generate Pin</button>

    <h3>Schedule Post</h3>
    <select id="board">
      ${boards.map(b => `<option>${b}</option>`).join("")}
    </select>

    <button onclick="schedule()">Schedule Post</button>

    <h3>Output</h3>
    <pre id="out">Waiting...</pre>

    <script>
      let lastProduct = "";

      async function createPin() {
        const product = document.getElementById("product").value;
        lastProduct = product;

        const res = await fetch("/create-pin", {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({ product })
        });

        const data = await res.json();
        document.getElementById("out").innerText = JSON.stringify(data, null, 2);
      }

      async function schedule() {
        const board = document.getElementById("board").value;

        const res = await fetch("/schedule-post", {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({
            product: lastProduct,
            board
          })
        });

        const data = await res.json();
        document.getElementById("out").innerText = JSON.stringify(data, null, 2);
      }
    </script>
  </body>
  </html>
  `);
});

app.listen(3000, () => {
  console.log("AUTO POSTER SAAS RUNNING");
});