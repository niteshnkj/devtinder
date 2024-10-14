const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLenght: 3,
      maxLength: 50,
    },
    lastName: {
      type: String,
      minLength: 1,
      maxLength: 50,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      toLowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("write an appropriate email");
        }
      },
    },
    password: {
      type: String,
      required: true,

      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("write a strong password");
        }
      },
    },
    age: {
      type: String,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("slect aprropriate gender");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://previews.123rf.com/images/triken/triken1608/triken160800029/61320775-male-avatar-profile-picture-default-user-avatar-guest-avatar-simply-human-head-vector-illustration.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("provide an url for profile photo");
        }
      },
    },
    about: {
      type: String,
      default: "This is a system default about string",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJwt = async function () {
  user = this;
  const token = await jwt.sign({ _id: user._id }, "DEVtinder$435", {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (PasswordInputByUser) {
  user = this;
  passwordHash = user.password;
  isPasswordValid = await bcrypt.compare(PasswordInputByUser, passwordHash);
  return isPasswordValid;
};

module.exports = mongoose.model("user", userSchema);
