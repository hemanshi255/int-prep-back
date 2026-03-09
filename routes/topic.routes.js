const express = require("express");
const router = express.Router();
var topicController = require("../controllers/topicController");
var AUTH = require("../middleware/authMiddleware");
var ADMIN = require("../middleware/adminMiddleware");

router.get("/", topicController.get);
router.post(
  "/createData",
  AUTH.authCheck,
  ADMIN.adminOnly,
  topicController.createData,
);
router.patch(
  "/editData/:id",
  AUTH.authCheck,
  ADMIN.adminOnly,
  topicController.editData,
);
router.delete(
  "/deleteData/:id",
  AUTH.authCheck,
  ADMIN.adminOnly,
  topicController.deleteData,
);

module.exports = router;
