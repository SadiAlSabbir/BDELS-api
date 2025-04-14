const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connect
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected.'))
.catch((err) => console.error('MongoDB connection error:', err));

// Mongoose Schema
const emergencySchema = new mongoose.Schema({
  phone: String,
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now }
});

const Emergency = mongoose.model('Emergency', emergencySchema);

// API route
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
  } catch (error) {
    console.error('Error saving:', error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send("BD-ELS Emergency Server with MongoDB is running.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
