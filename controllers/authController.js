const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {
  try {
    const { name, email, password, targetRole } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email Already Registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      targetRole,
      profile: req.file ? req.file.filename : "",
    });

    res.status(201).json({
      status: "success",
      message: "Register Successfully Done",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const emailVerify = await User.findOne({ email: req.body.email });

    if (!emailVerify) throw new Error("Invalid email");

    const passVerify = await bcrypt.compare(
      req.body.password,
      emailVerify.password,
    );

    if (!passVerify) throw new Error("Invalid password");

    const token = generateToken(emailVerify._id);

    res.status(200).json({
      status: "Success",
      message: "login success",
      data: emailVerify,
      token,
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: error.message,
    });
  }
};

exports.get = async (req, res) => {
  try {
    let data = await User.find();
    res.status(200).json({
      status: "success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      message: error.message,
    });
  }
};
