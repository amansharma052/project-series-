const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt =require("bcryptjs")

// ✅ Register Function
const registerUser = async (req, res) => {
  try {
    const { email, username, profileImage, password, bio } = req.body;

    const isUserExists = await userModel.findOne({
      $or: [{ email }, { username }]
    });

    if (isUserExists) {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    // hash password
    const hash =  await bcrypt.hash(password,10)

    const user = await userModel.create({
      email,
      username,
      profileImage,
      password: hash,
      bio
    });

    // generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        email: user.email,
        username: user.username,
        bio: user.bio,
        profileImage: user.profileImage
      }
    });

  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      error: err.message
    });
  }
};

// ✅ Login Function
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // hash and compare
    const hash =  await bcrypt.compare(password,user.password)

    if (user.password !== hash) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        email: user.email,
        username: user.username,
        bio: user.bio,
        profileImage: user.profileImage
      }
    });

  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      error: err.message
    });
  }
};

// ✅ Export both functions
module.exports = { registerUser, loginUser };