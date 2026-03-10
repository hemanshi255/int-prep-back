const Question = require("../models/Question");
const Topic = require("../models/Topic");

exports.createData = async (req, res) => {
  try {
    const {
      topicId,
      question,
      options,
      correctOption,
      explanation,
      difficulty,
    } = req.body;

    const data = await Question.create({
      topicId,
      question,
      options,
      correctOption,
      explanation,
      difficulty,
      isAIGenerated: false,
    });

    await Topic.findByIdAndUpdate(topicId, {
      $inc: { totalQuestions: 1 },
    });

    res.status(201).json({
      status: "Success",
      message: "Question Created",
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
    const { topicId, difficulty } = req.query;
    let filter = { isActive: true };
    if (topicId) filter.topicId = topicId;
    if (difficulty) filter.difficulty = difficulty;

    let data = await Question.find(filter)
      .populate("topicId", "name icon")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "Success",
      message: "Questions Get",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.getSingle = async (req, res) => {
  try {
    const data = await Question.findById(req.params.id).populate(
      "topicId",
      "name",
    );

    if (!data) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({
      status: "Success",
      message: "Question Get",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.getForPractice = async (req, res) => {
  try {
    const { difficulty } = req.query;
    let filter = { topicId: req.params.topicId, isActive: true };
    if (difficulty && difficulty !== "mixed") {
      filter.difficulty = difficulty;
    }

    const data = await Question.find(filter)
      .select("-correctOption -explanation")
      .limit(10);

    if (data.length === 0) {
      return res.status(404).json({
        message: "No questions found for this topic",
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Practice Questions Get",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.getRandomQuestions = async (req, res) => {
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

    const data = await Question.aggregate([
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

    res.status(200).json({
      status: "Success",
      message: "Random Questions Get",
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

    const question = await Question.findById(deleteId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    await Question.findByIdAndUpdate(
      deleteId,
      { isActive: false },
      { new: true },
    );

    await Topic.findByIdAndUpdate(question.topicId, {
      $inc: { totalQuestions: -1 },
    });

    res.status(200).json({
      status: "Success",
      message: "Question deleted",
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
    let data = await Question.findByIdAndUpdate(editId, req.body, {
      new: true,
    });
    res.status(200).json({
      status: "Success",
      message: "Question Updated",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      message: error.message,
    });
  }
};
