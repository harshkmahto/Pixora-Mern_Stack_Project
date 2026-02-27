const mongoose = require("mongoose");

const personalDetailSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: String,
    email: String,
    phone: String,
    city: String,
    state: String,
    pin: String,
    profession: String,
    addressType: {
      type: String,
      enum: ["home", "office", "other"],
      default: "home",
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PersonalDetail", personalDetailSchema);