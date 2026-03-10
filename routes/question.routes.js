const express = require("express");
const router = express.Router();
var questionController = require("../controllers/questionController");
var AUTH = require("../middleware/authMiddleware");
var ADMIN = require("../middleware/adminMiddleware");

router.get(
  "/practice/:topicId",
  AUTH.authCheck,
  questionController.getForPractice,
);
router.get("/random", AUTH.authCheck, questionController.getRandomQuestions);

router.get("/", AUTH.authCheck, ADMIN.adminOnly, questionController.get);
router.post(
  "/createData",
  AUTH.authCheck,
  ADMIN.adminOnly,
  questionController.createData,
);
router.patch(
  "/editData/:id",
  AUTH.authCheck,
  ADMIN.adminOnly,
  questionController.editData,
);
router.delete(
  "/deleteData/:id",
  AUTH.authCheck,
  ADMIN.adminOnly,
  questionController.deleteData,
);

router.get(
  "/:id",
  AUTH.authCheck,
  ADMIN.adminOnly,
  questionController.getSingle,
);

module.exports = router;
