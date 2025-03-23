// process.on("unhandledRejection", (err) => {
//   console.log(err.name, err.message);
//   console.log("UNHANDLED REJECTION! shutting down...");
//   server.close(() => {
//     process.exit(1);
//   });
// });

// process.on("uncaughtException", (err) => {
//   console.log("UNCAUGHT EXCEPTION Shutting down...");
//   console.log(err.name, err.message);
//   process.exit(1);
// });

const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/config.env` });

const app = require("./app");
const port = process.env.PORT || 7676;

const mongoose = require("mongoose");
const DB = process.env.CONNECTION_STRING;

mongoose
  .connect(DB)
  .then(() => console.log("DB connection successful"))
  .catch((err) => console.error("DB connection error:", err));

console.log(app.get("env"));

const server = app.listen(port, () => {
  console.log(`Listening on port - ${port}`);
});
