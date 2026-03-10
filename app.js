require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

connectDB();

const app = express();

const authRouter = require("./routes/auth.routes");
const topicRouter = require("./routes/topic.routes");
const questionRouter = require("./routes/question.routes");

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.use("/api/auths", authRouter);
app.use("/api/topics", topicRouter);
app.use("/api/questions", questionRouter);

app.use((err, req, res, next) => {
  console.log("ERROR:", err.message);
  res.status(500).json({ message: err.message });
});

module.exports = app;
