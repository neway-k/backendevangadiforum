const db = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

// register
const register = async (req, res) => {
  const { username, firstname, lastname, email, password } = req.body;
  // console.log(" Register request received:", req.body);

  if (!username || !firstname || !lastname || !email || !password) {
    console.log(" Missing registration fields");
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "All fields are required" });
  }

  try {
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    const [existingUsername] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    // console.log(" Existing user check:", existingUser);

    if (existingUser.length > 0) {
      // console.log(" Email already registered:", email);
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Email already registered" });
    }

    if (existingUsername.length > 0) {
      // console.log(" username already registered:", username);
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Username already registered" });
    }

    if (password.length < 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Password must be at least 8 character" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // console.log(" Hashed password:", hashedPassword);

    await db.query(
      "INSERT INTO users (username, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)",
      [username, firstname, lastname, email, hashedPassword]
    );
    const [user] = await db.query("select userid from users where email=?", [
      email,
    ]);
    const userid = user[0].userid;
    const token = jwt.sign({ userid, username }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // console.log("User registered");
    return res.status(StatusCodes.CREATED).json({
      message: "User registered successfuly!",
      token,
      data: {
        userid,
        username,
        firstname,
        lastname,
        email,
      },
    });
  } catch (error) {
    console.error(" Register error:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Server error", details: error.message });
  }
};

// login
const login = async (req, res) => {
  const { email, password } = req.body;
  // console.log(" Login request received:", req.body);

  if (!email || !password) {
    console.log(" Missing login fields");
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Email and password required" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    const user = rows[0];
    // console.log(user);
    if (!user) {
      // console.log(" User not found:", email);
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "User not found" });
    }

    const { userid, username, firstname, lastname } = user;
    const isMatch = await bcrypt.compare(password, user.password);
    // console.log(" Password match:", isMatch);

    if (!isMatch) {
      // console.log(" Invalid password");
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userid, username }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    // console.log(" JWT generated");

    return res.status(StatusCodes.OK).json({
      message: "Login successful!",
      token,
      data: { userid, username, firstname, lastname, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Server error", details: error.message });
  }
};
// check
const check = (req, res) => {
  const { username, userid } = req.user;

  res.status(StatusCodes.OK).json({ message: "Valid user", username, userid });
};

module.exports = { register, login, check };
