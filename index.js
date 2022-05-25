const express = require("express");
const cors = require("cors");
const app = express();
const models = require("./models");
const { send } = require("express/lib/response");
const port = 8080;

app.use(express.json());
app.use(cors());

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
      res.send("Cannot get data");
    });
});

app.post("/products", (req, res) => {
  const body = req.body;
  const { name, price, imageUrl, description, seller } = body;
  if (!name || !price || !description || !seller) {
    res.send("You must fill out all the fields.");
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
        res.send("There was a problem uploading the product.");
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
      res.send("There was a problem getting the product.");
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
      console.log("... DB Connection failed ✗ ");
      process.exit();
    });
});
