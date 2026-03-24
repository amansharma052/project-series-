
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email"]
    },

    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        minlength: [3, "Username must be at least 3 characters"],
        maxlength: [20, "Username must be less than 20 characters"],
        trim: true
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"]
    },

    bio: {
        type: String,
        maxlength: [200, "Bio cannot exceed 200 characters"],
        default: ""
    },

    profileImage: {
        type: String,
        default: "https://example.com/default-profile.png"
    }

}, { timestamps: true });

const userModel =mongoose.model("user", userSchema)

module.exports=userModel