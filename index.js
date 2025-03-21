const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/config.end` });

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require("./app");
const port = process.env.PORT || 7676;

const mongoose = require("mongoose");

