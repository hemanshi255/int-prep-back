const Topic = require("../models/Topic");

exports.createData = async (req, res) => {
  const { name, icon, description, targetRoles } = req.body;
  try {
    const existing = await Topic.findOne({ name, isActive: true });

    if (existing) {
      return res.status(400).json({ message: "Topic already exists" });
    }

    const inactiveTopic = await Topic.findOne({ name, isActive: false });

    if (inactiveTopic) {
      const reactivated = await Topic.findByIdAndUpdate(
        inactiveTopic._id,
        { icon, description, targetRoles, isActive: true },
        { new: true },
      );
      return res.status(201).json({
        status: "Success",
        message: "Topic Reactivated",
        data: reactivated,
      });
    }

    let data = await Topic.create({ name, icon, description, targetRoles });
    res.status(201).json({
      status: "Success",
      message: "Topic Created",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.get = async (req, res) => {
  try {
    let data = await Topic.find({ isActive: true });
    res.status(200).json({
      status: "Success",
      message: "Topic Get",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.deleteData = async (req, res) => {
  try {
    let deleteId = req.params.id;
    let data = await Topic.findByIdAndUpdate(
      deleteId,
      { isActive: false },
      { new: true },
    );
    res.status(200).json({
      status: "Success",
      message: "Topic delete",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.editData = async (req, res) => {
  try {
    let editId = req.params.id;
    let data = await Topic.findByIdAndUpdate(editId, req.body, { new: true });
    res.status(200).json({
      status: "Success",
      message: "Topic Update",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      message: error.message,
    });
  }
};
