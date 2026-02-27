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

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Your frontend URL
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/personal-details", personalDetailRoutes);
app.use("/api/bookings", bookingRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({ message: "API is running..." });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});