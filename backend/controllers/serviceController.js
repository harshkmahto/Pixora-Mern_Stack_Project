const Service = require("../models/service.model");

// CREATE SERVICE (Admin)
exports.createService = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      features,
      status,
      price,
      sellingPrice,
    } = req.body;

    const service = await Service.create({
      title,
      description,
      category,
      price,
      sellingPrice,
      features: JSON.parse(features),
      status,
      image: req.file ? req.file.path : "",
    });

    res.status(201).json({
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET ALL SERVICES (Admin)
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json({ services });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET ACTIVE SERVICES (User)
exports.getActiveServices = async (req, res) => {
  try {
    const services = await Service.find({ status: "active" });
    res.json({ services });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET SINGLE ACTIVE SERVICE (User)
exports.getActiveServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findOne({
      _id: id,
      status: "active",
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({ service });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE SERVICE
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = req.file.path;
    }

    if (req.body.removeImage === "true") {
      updateData.image = "";
    }

    if (updateData.features && typeof updateData.features === "string") {
      updateData.features = JSON.parse(updateData.features);
    }

    if (updateData.price !== undefined) {
      updateData.price = Number(updateData.price);
    }

    if (updateData.sellingPrice !== undefined) {
      updateData.sellingPrice = Number(updateData.sellingPrice);
    }

    const service = await Service.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.json({ message: "Service updated successfully", service });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE SERVICE
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    await Service.findByIdAndDelete(id);

    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};