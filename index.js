const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

app.get("/products", (req, res) => {
  res.send("products GET page");
});

app.post("/products", (req, res) => {
  res.send("products POST page");
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:8080`);
});
