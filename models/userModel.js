const mongoose = require("mongoose");
// const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please enter confirmed password"],
      validator: {
        //only work when we run create or save commands
        validate: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt fields

const User = mongoose.model("User", userSchema);
module.exports = User;
