const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const authMiddlewares = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  // console.log(authHeader);
  // console.log(token);

  try {
    const { username, userid } = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { username, userid };

    next();
  } catch (error) {

    if (error.name === "TokenExpiredError") {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Token expired" });
    }

    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "invalid authentication" });
  }
};

module.exports = authMiddlewares;
