const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB Connect
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

// Schema
const emergencySchema = new mongoose.Schema({
  phone: String,
  latitude: Number,
  longitude: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
});
const Emergency = mongoose.model('Emergency', emergencySchema);

// Routes
app.post('/api/emergency', async (req, res) => {
  const { phone, latitude, longitude, timestamp } = req.body;

  if (!phone || !latitude || !longitude) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const entry = new Emergency({
      phone,
      latitude,
      longitude,
      timestamp: timestamp || new Date()
    });

    await entry.save();
    res.status(200).json({ message: "Location saved to MongoDB." });
  } catch (err) {
    res.status(500).json({ message: "Error saving data." });
  }
});

app.get('/', (req, res) => {
  res.send("BD-ELS Emergency Server is running with MongoDB.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
