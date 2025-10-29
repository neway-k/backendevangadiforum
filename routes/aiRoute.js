// const express = require("express");
// const {askAI,getAIHistory} = require('../controller/aiController.js')
// const aiRouter = express.Router();

// aiRouter.post("/ask", askAI);
// aiRouter.get("/history", getAIHistory);

// module.exports = aiRouter;
const express = require("express");
const router = express.Router();

const authMiddleware = require("../midllewares/authMiddleware"); // must be a function
const { askAI, getAIHistory } = require("../controller/aiController"); // must be functions

router.post("/ask", authMiddleware, askAI); // ✅ all handlers are functions
router.get("/history", authMiddleware, getAIHistory);

module.exports = router;
