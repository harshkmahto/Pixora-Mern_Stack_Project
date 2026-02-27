const PersonalDetail = require("../models/personalDetail.model");


// CREATE
exports.createPersonalDetail = async (req, res) => {
  try {
    const userId = req.user._id;

    const detail = await PersonalDetail.create({
      ...req.body,
      user: userId,
    });

    res.status(201).json({
      message: "Personal detail added",
      detail,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


// GET ALL (User Only)
exports.getUserPersonalDetails = async (req, res) => {
  try {
    const details = await PersonalDetail.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({ details });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


// UPDATE
exports.updatePersonalDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const detail = await PersonalDetail.findOneAndUpdate(
      { _id: id, user: req.user._id },
      req.body,
      { new: true }
    );

    res.json({
      message: "Updated successfully",
      detail,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


// DELETE
exports.deletePersonalDetail = async (req, res) => {
  try {
    const { id } = req.params;

    await PersonalDetail.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


// SELECT ONE DETAIL
exports.selectPersonalDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // First unselect all
    await PersonalDetail.updateMany(
      { user: userId },
      { isSelected: false }
    );

    // Then select chosen one
    const detail = await PersonalDetail.findOneAndUpdate(
      { _id: id, user: userId },
      { isSelected: true },
      { new: true }
    );

    res.json({
      message: "Selected successfully",
      detail,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};