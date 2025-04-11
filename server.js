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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Define allowed origins
const allowedOrigins = [
  'https://engagement-gallery.onrender.com',
  'http://localhost:5173'
];
if (process.env.FRONTEND_URL && !allowedOrigins.includes(process.env.FRONTEND_URL)) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS: ', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Allow pre-flight requests for all routes
app.options('*', cors(corsOptions));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'wedding-photos-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'none',  // Allow cross-site cookies
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined
  },
}));

// Debug middleware for session
app.use((req, res, next) => {
  console.log('Session:', req.session);
  console.log('Cookies:', req.headers.cookie);
  next();
});

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/admin', adminRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Wedding Photo Sharing API is running');
});

// Ping endpoint for keep-alive
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
