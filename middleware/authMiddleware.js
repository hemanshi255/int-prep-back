const jwt = require("jsonwebtoken");
let User = require("../models/User");

exports.authCheck = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) throw new Error("Attach Token");

    const tokenVerify = jwt.verify(token, process.env.JWT_SECRET);

    if (!tokenVerify) throw new Error("Invalid Token");

    const user = await User.findById(tokenVerify.id);

    if (!user) throw new Error("Invalid User");

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      status: "Fail",
      message: error.message,
    });
  }
};
