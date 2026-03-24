const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.router");

const app = express(); // ✅ first create app

app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRouter);

module.exports = app;