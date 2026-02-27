const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    personalDetail: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PersonalDetail",
      required: true,
    },

    price: Number,
    sellingPrice: Number,

    transactionId: {
      type: String,
    },

    screenshot: {
      type: String,
    },

    status: {
      type: String,
      enum: [
        "booking_created",
        "pending",
        "approved",
        "confirmed",
        "completed",
        "cancelled",
        "refund",
      ],
      default: "booking_created",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);