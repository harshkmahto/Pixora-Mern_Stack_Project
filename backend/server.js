const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectToDb = require("./config/db");

const dns = require("dns");

const authRoutes = require("./routes/auth.routes");
const serviceRoutes = require("./routes/service.routes");
const personalDetailRoutes = require("./routes/personalDetail.route");
const bookingRoutes = require("./routes/booking.routes");

const app = express();

// ✅ FIXED: Pass an array of DNS servers
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Connect DB per request (Vercel safe)
connectToDb();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));


// Root route
app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/personal-details", personalDetailRoutes);
app.use("/api/bookings", bookingRoutes);

module.exports = app;