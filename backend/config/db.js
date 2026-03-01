const mongoose = require("mongoose");

let isConnected = false;

async function connectToDb() {
  if (isConnected) {
    return;
  }

  if (!process.env.DB_URI) {
    throw new Error("DB_URI is missing in environment variables");
  }

  try {
    const db = await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = db.connections[0].readyState;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error; // IMPORTANT
  }
}

module.exports = connectToDb;