const express = require("express");
const userModel = require("../models/user.model");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
    try {
        const { email, password, username, profileImage, bio } = req.body;

        // check user exists
        const isExists = await userModel.findOne({
            $or: [{ email }, { username }]
        });

        if (isExists) {
            return res.status(409).json({
                message: "User already registered"
            });
        }

        // hash password
        const hash = crypto
            .createHash("sha256")
            .update(password)
            .digest("hex");

        // create user
        const user = await userModel.create({
            username,
            email,
            bio,
            profileImage,
            password: hash
        });

        // generate token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // set cookie
        res.cookie("token", token);

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
});

module.exports = authRouter;