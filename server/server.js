const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const uploadRoute = require('./routes/upload');
const collegesRoute = require('./routes/colleges');

app.use('/api/upload', uploadRoute);
app.use('/api/colleges', collegesRoute);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});