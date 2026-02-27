const Booking = require("../models/booking.model");
const Service = require("../models/service.model");


// ==============================
// CREATE BOOKING
// ==============================
exports.createBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const { serviceId, personalDetailId, transactionId } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const booking = await Booking.create({
      user: userId,
      service: serviceId,
      personalDetail: personalDetailId,
      price: service.price,
      sellingPrice: service.sellingPrice,
      transactionId,
      screenshot: req.file ? req.file.path : "",
      status: "booking_created",
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// ==============================
// GET MY BOOKINGS (USER)
// ==============================
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("service")
      .populate("personalDetail")
      .sort({ createdAt: -1 });

    res.json({ bookings });

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


// ==============================
// GET MY BOOKING BY ID (USER)
// ==============================
exports.getMyBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate("service")
      .populate("personalDetail");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ booking });

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// ==============================
// GET ALL BOOKINGS (ADMIN)
// ==============================
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("service")
      .populate("personalDetail")
      .sort({ createdAt: -1 });

    const totalBookings = await Booking.countDocuments();

    res.json({
      totalBookings,
      bookings,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// ==============================
// GET BOOKING BY ID (ADMIN)
// ==============================
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("service")
      .populate("personalDetail");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ booking });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// ==============================
// UPDATE BOOKING STATUS (ADMIN)
// ==============================
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Allow ANY → ANY status update
    booking.status = status;

    await booking.save();

    res.json({
      message: "Booking status updated successfully",
      booking,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
