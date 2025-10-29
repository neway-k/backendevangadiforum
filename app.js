require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db/dbConfig");
const app = express();
const port = 5000;
const userRouter = require("./routes/userRoute");
const questionRouter = require("./routes/questionsRoute");
const answerRouter = require("./routes/answerRoute");
const aiRouter = require("./routes/aiRoute");
const authMiddlewares = require("./midllewares/authMiddleware");

// middlewares
app.use(cors({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ response: "success" });
});

app.get("/test", (req, res) => {
  res.json({ response: "working" });
});


app.use("/api/user",userRouter);
app.use("/api/question", authMiddlewares, questionRouter);
app.use("/api/answer", authMiddlewares, answerRouter);
app.use("/api/ai", authMiddlewares, aiRouter);

const start = async () => {
  try {
    const result = await db.execute("select 'databaseConnected'");
    app.listen(port);
    console.log(result[0][0].databaseConnected);
    console.log("server listening at ", port);
  } catch (error) {
    console.log(error.message);
  }
};

start();
