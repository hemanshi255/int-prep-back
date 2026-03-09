const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    icon: {
      type: String,
      default: "📚",
    },
    description: {
      type: String,
      default: "",
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    targetRoles: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Topic", topicSchema);
