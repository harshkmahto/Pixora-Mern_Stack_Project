const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const controller = require("../controllers/personalDetailController");

router.post("/", protect, controller.createPersonalDetail);
router.get("/", protect, controller.getUserPersonalDetails);
router.put("/:id", protect, controller.updatePersonalDetail);
router.delete("/:id", protect, controller.deletePersonalDetail);
router.put("/select/:id", protect, controller.selectPersonalDetail);

module.exports = router;