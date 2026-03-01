const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT;
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
    origin: process.env.CLIENT_URL , // Your frontend URL
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options("*", cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/personal-details", personalDetailRoutes);
app.use("/api/bookings", bookingRoutes);



module.exports = app;