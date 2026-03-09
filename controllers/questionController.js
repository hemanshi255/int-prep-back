const Question = require("../models/Question");
const Topic = require("../models/Topic");

// Get all questions — Admin only
const getQuestions = async (req, res) => {
  try {
    const { topicId, difficulty } = req.query;
    let filter = {};
    if (topicId) filter.topicId = topicId;
    if (difficulty) filter.difficulty = difficulty;

    const questions = await Question.find(filter)
      .populate("topicId", "name icon")
      .sort({ createdAt: -1 });

    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get questions for practice — correct answer hidden
const getQuestionsForPractice = async (req, res) => {
  try {
    const { difficulty } = req.query;
    let filter = { topicId: req.params.topicId, isActive: true };
    if (difficulty && difficulty !== "mixed") {
      filter.difficulty = difficulty;
    }

    const questions = await Question.find(filter)
      .select("-correctOption -explanation")
      .limit(10);

    if (questions.length === 0) {
      return res.status(404).json({
        message: "No questions found for this topic and difficulty",
      });
    }

    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single question — Admin only
const getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate(
      "topicId",
      "name",
    );
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json({ success: true, question });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add question manually — Admin only
const addQuestion = async (req, res) => {
  try {
    const question = await Question.create({
      ...req.body,
      isAIGenerated: false,
    });

    await Topic.findByIdAndUpdate(req.body.topicId, {
      $inc: { totalQuestions: 1 },
    });

    res.status(201).json({ success: true, question });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update question — Admin only
const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json({ success: true, question });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Deactivate question — Admin only
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    await Question.findByIdAndUpdate(req.params.id, { isActive: false });

    await Topic.findByIdAndUpdate(question.topicId, {
      $inc: { totalQuestions: -1 },
    });

    res.json({ success: true, message: "Question deactivated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get random questions for mock interview
const getRandomQuestions = async (req, res) => {
  try {
    const { targetRole } = req.query;

    const topics = await Topic.find({
      targetRoles: { $in: [targetRole] },
      isActive: true,
    });

    if (topics.length === 0) {
      return res.status(404).json({
        message: "No topics found for this role",
      });
    }

    const topicIds = topics.map((t) => t._id);

    const questions = await Question.aggregate([
      {
        $match: {
          topicId: { $in: topicIds },
          isActive: true,
        },
      },
      { $sample: { size: 15 } },
      {
        $project: {
          correctOption: 0,
          explanation: 0,
        },
      },
    ]);

    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getQuestions,
  getQuestionsForPractice,
  getQuestion,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getRandomQuestions,
};
