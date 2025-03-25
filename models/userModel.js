const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
    passwordChangedAt: {
      type: Date, // Stores when the password was last changed
    },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt fields

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if password is modified

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined; // Remove passwordConfirm from the database

  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000; // Subtract 1s to prevent JWT token issues
  }
  next();
});

userSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return jwtTimestamp < changedTimestamp;
  }
  return false;
};
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const User = mongoose.model("User", userSchema);
module.exports = User;
