const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();
const models = require("./models");
const port = 8080;
const static = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "static/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

app.use(express.json());
app.use(cors());
app.use("/static", express.static("static"));

app.get("/products", (req, res) => {
  models.Product.findAll({
    order: [["createdAt", "DESC"]],
    attributes: ["id", "name", "price", "seller", "imageUrl", "createdAt"],
  })
    .then((result) => {
      res.send({ products: result });
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send("Cannot get data");
    });
});

app.post("/image", static.single("image"), function (req, res) {
  const file = req.file;
  console.log(file);
  res.send({ imageUrl: file.path });
});

app.post("/products", (req, res) => {
  const body = req.body;
  const { name, price, imageUrl, description, seller } = body;
  if (!name || !price || !description || !seller) {
    res.status(400).send("You must fill out all the fields.");
  } else {
    models.Product.create({
      name,
      price,
      imageUrl,
      description,
      seller,
    })
      .then((result) => {
        res.send({ result });
      })
      .catch((err) => {
        console.error(err);
        res.status(400).send("There was a problem uploading the product.");
      });
  }
});

app.get("/products/:id", (req, res) => {
  const params = req.params;
  const { id } = params;
  models.Product.findOne({
    where: {
      id: id,
    },
  })
    .then((result) => {
      res.send({ product: result });
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send("There was a problem getting the product.");
    });
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:8080`);
  models.sequelize
    .sync()
    .then(() => {
      console.log("... DB Connection Success ✓");
    })
    .catch((err) => {
      console.err(err);
      console.status(500).log("... DB Connection failed ✗ ");
      process.exit();
    });
});
