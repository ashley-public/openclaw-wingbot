const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express backend" });
});

app.post("/api/data", (req, res) => {
  const { name } = req.body;
  res.json({ received: name });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});