const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const bookingController = require("../controllers/bookingController");


// USER
router.post("/", protect, upload.single("screenshot"), bookingController.createBooking);
router.get("/my", protect, bookingController.getMyBookings);
router.get("/my/:id", protect, bookingController.getMyBookingById);

// ADMIN
router.get("/", protect, admin, bookingController.getAllBookings);
router.get("/:id", protect, admin, bookingController.getBookingById);
router.put("/:id/status", protect, admin, bookingController.updateBookingStatus);

module.exports = router;