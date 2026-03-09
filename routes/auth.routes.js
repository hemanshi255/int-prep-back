const express = require("express");
const router = express.Router();
const multer = require("multer");

var authController = require("../controllers/authController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

router.post("/register", upload.single("profile"), authController.register);
router.get("/", authController.get);
router.post("/login", authController.loginUser);

module.exports = router;
