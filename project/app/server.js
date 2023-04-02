const express = require("express");
const bodyParser = require("body-parser");
const geocodeAddress = require("./geo");
const synthesizeSpeech = require("./text-to-speech");
const cors = require("cors");
const {
  createConnectionPool,
  getAllOrase,
  postOrase,
  putOrase,
  deleteOrase,
} = require("./db");
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.get("/orase", async (req, res) => {
  try {
    const orase = await getAllOrase();
    res.json(orase);
  } catch (error) {
    res
      .status(500)
      .send(`Error retrieving data from database: ${error.message}`);
  }
});

app.post("/orase", async (req, res) => {
  const { nume, tara, latitude, longitude } = req.body;
  try {
    const id = await postOrase(nume, tara, latitude, longitude);
    res.status(201).json({ id, nume, tara, latitude, longitude });
  } catch (error) {
    res.status(500).send(`Error creating orase: ${error.message}`);
  }
});

// Update an orase record
app.put("/orase/:id", async (req, res) => {
  const { id } = req.params;
  const { nume, tara, latitude, longitude } = req.body;

  try {
    const updated = await putOrase(id, nume, tara, latitude, longitude);
    if (updated) {
      res.status(200).json({ id, nume, tara, latitude, longitude });
    } else {
      res.status(404).send(`Orase with id ${id} not found`);
    }
  } catch (error) {
    res
      .status(500)
      .send(`Error updating orase with id ${id}: ${error.message}`);
  }
});

// Delete an orase record
app.delete("/orase/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await deleteOrase(id);
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).send(`Orase with id ${id} not found`);
    }
  } catch (error) {
    res
      .status(500)
      .send(`Error deleting orase with id ${id}: ${error.message}`);
  }
});

app.get("/synthesize", async (req, res) => {
  const text = "Hello World";
  try {
    const audioContent = await synthesizeSpeech(text);
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(audioContent);
  } catch (error) {
    console.error(`Error synthesizing text: ${error.message}`);
    res.status(500).send(`Error synthesizing text: ${error.message}`);
  }
});

app.post("/synthesize", async (req, res) => {
  const text = req.body.text;
  try {
    const audioContent = await synthesizeSpeech(text);
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(audioContent);
  } catch (error) {
    console.error(`Error synthesizing text: ${error.message}`);
    res.status(500).send(`Error synthesizing text: ${error.message}`);
  }
});

app.get("/geocode/:address", async (req, res) => {
  const { address } = req.params;
  try {
    const location = await geocodeAddress(address);
    res.status(200);
    res.send(location);
  } catch (error) {
    res
      .status(500)
      .send(`Error retrieving location information: ${error.message}`);
  }
});

const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});

module.exports = app;
