const express = require("express");
const cors = require("cors");
const bodyParser = require("express").json;
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser());

// Routes
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to the Social Media App API");
});

module.exports = app;
