const express = require("express");
const bodyParser = require('body-parser');
const { createConnectionPool, getAllOrase, postOrase, putOrase, deleteOrase } = require('./db');
const app = express();

app.use(bodyParser.json());

app.get('/orase', async (req, res) => {
  try {
    const orase = await getAllOrase();
    res.json(orase);
  } catch (error) {
    res.status(500).send(`Error retrieving data from database: ${error.message}`);
  }
});

app.post('/orase', async (req, res) => {
  const { nume, tara, latitude, longitude } = req.body;
  try {
    const id = await postOrase(nume, tara, latitude, longitude);
    res.status(201).json({ id, nume, tara, latitude, longitude });
  } catch (error) {
    res.status(500).send(`Error creating orase: ${error.message}`);
  }
});

// Update an orase record
app.put('/orase/:id', async (req, res) => {
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
    res.status(500).send(`Error updating orase with id ${id}: ${error.message}`);
  }
});

// Delete an orase record
app.delete('/orase/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await deleteOrase(id);
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).send(`Orase with id ${id} not found`);
    }
  } catch (error) {
    res.status(500).send(`Error deleting orase with id ${id}: ${error.message}`);
  }
});

app.get("/", (req, res) => {
  res.status(200).send("testnou!").end();
});

const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});

module.exports = app;
