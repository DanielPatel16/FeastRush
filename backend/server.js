const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());                        // Allow frontend to call this API
app.use(express.json());               // Parse incoming JSON body

// Routes
app.use('/api/auth',         require('./routes/auth.routes'));
app.use('/api/restaurants',  require('./routes/restaurant.routes'));
app.use('/api/orders',       require('./routes/order.routes'));
app.use('/api/admin',        require('./routes/admin.routes'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🍕 FeastRush API is running!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});