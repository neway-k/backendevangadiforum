const express= require('express')
const { postAnswer, getAnswer } = require("../controller/answersController");
const answerRouter = express.Router()


answerRouter.post("/post-answer", postAnswer);
answerRouter.get("/get-answer/:questionid", getAnswer);

module.exports= answerRouter