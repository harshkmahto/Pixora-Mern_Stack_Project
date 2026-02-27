const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const connectToDb = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const serviceRoutes = require("./routes/service.routes");
const personalDetailRoutes = require("./routes/personalDetail.route");
const bookingRoutes = require("./routes/booking.routes");

// Connect to database
connectToDb();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Get client URL from env or use default
const clientURL = process.env.CLIENT_URL || 'https://pixora-mern.vercel.app';

// CORS configuration
app.use(cors({
    origin: clientURL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests for all routes
app.options('*', cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/personal-details", personalDetailRoutes);
app.use("/api/bookings", bookingRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({ message: "API is running..." });
});

// For local development only
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

module.exports = app;