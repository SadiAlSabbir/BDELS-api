const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Receive Location & Call Info
app.post('/api/emergency', (req, res) => {
  const { phone, latitude, longitude, timestamp } = req.body;

  if (!phone || !latitude || !longitude) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const entry = {
    phone,
    latitude,
    longitude,
    timestamp: timestamp || new Date().toISOString()
  };

  // Save to local file (you can replace this with MongoDB later)
  fs.readFile('data.json', (err, data) => {
    const records = err ? [] : JSON.parse(data);
    records.push(entry);
    fs.writeFile('data.json', JSON.stringify(records, null, 2), () => {
      res.status(200).json({ message: "Location saved." });
    });
  });
});

// Check if server is running
app.get('/', (req, res) => {
  res.send("BD-ELS Emergency Server is running.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
