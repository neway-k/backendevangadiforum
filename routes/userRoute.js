const express = require("express");
const userRouter = express.Router();
const { register, login, check } = require("../controller/userController");

const authMiddlewares = require("../midllewares/authMiddleware");

userRouter.post("/register", register);

userRouter.post("/login", login);

userRouter.get("/check", authMiddlewares, check);

module.exports = userRouter;
