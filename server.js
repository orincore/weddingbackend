const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const connectDB = require('./config/db');
const uploadRoutes = require('./routes/uploadRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middlewares
app.use(express.json());

// CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'wedding-photos-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/admin', adminRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Wedding Photo Sharing API is running');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 