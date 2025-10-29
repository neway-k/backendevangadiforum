const express = require('express')
const questionRouter = express.Router()
const {
  postQuestion,
  getAllQuestions,
  getSingleQuestion,
  updateQuestion,  // temporarily comment out
  deleteQuestion   // temporarily comment out
} = require("../controller/questionsController");

questionRouter.post("/post-question", postQuestion);
questionRouter.get("/all-questions", getAllQuestions);
questionRouter.get("/single-question/:questionid", getSingleQuestion);
questionRouter.put("/update-question/:questionid", updateQuestion);
questionRouter.delete("/delete-question/:questionid", deleteQuestion);

module.exports = questionRouter



// // PUT /api/questions/:id - Update question
// router.put("/:id", updateQuestion);

// // DELETE /api/questions/:id - Delete question
// router.delete("/:id", deleteQuestion);

module.exports = questionRouter;
