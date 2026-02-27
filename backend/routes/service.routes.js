const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const serviceController = require("../controllers/serviceController");

// Admin Routes
router.post("/", protect, admin, upload.single("image"), serviceController.createService);
router.get("/", protect, admin, serviceController.getAllServices);
router.put("/:id", protect, admin, upload.single("image"), serviceController.updateService);
router.delete("/:id", protect, admin, serviceController.deleteService);

// User Route
// User Routes
router.get("/public", serviceController.getActiveServices);
router.get("/public/:id", serviceController.getActiveServiceById);

module.exports = router;