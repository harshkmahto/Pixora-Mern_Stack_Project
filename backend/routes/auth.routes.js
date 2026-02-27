const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");


const authController = require("../controllers/userController");
const controller = require("../controllers/personalDetailController");



// Public routes
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);

// Protected routes (require login)
router.get("/profile", protect, authController.getProfile);
router.put("/profile", protect, upload.single("profile"), authController.updateProfile);



// Admin only routes
router.get("/admin-only", protect, admin, (req, res) => {
    res.json({ message: "Welcome admin! This is admin only route" });
});

router.get("/all-users", protect, admin, authController.getAllUsers);


module.exports = router;