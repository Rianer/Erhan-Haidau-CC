const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileRoutes = require("./routes/files");

const app = express();

app.use(cors());
app.use(bodyParser.json());

fileRoutes(app);

app.get("/orase", (req, res) => {
  res.status(200).send("Orase!").end();
});

app.get("/", (req, res) => {
  res.status(200).send("Test!").end();
});

const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});

module.exports = app;
