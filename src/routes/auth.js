const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");

const bcrypt = require("bcrypt");

//saving dummy data to database for user schema

authRouter.post("/signup", async (req, res) => {
  try {
    //validate incoming requests
    validateSignUpData(req,res);

    const { firstName, lastName, emailId, password } = req.body;
    //encrypt passwords using bcrypt

    const passwordHash = await bcrypt.hash(password, 10);
    //and ideal way to deciede hash rounds is 10 you can give any
    //the number of round we increase our password will get more stronger but it takes time for hashing
    //for creating an instance of user never ever ttrus req.body always pass required fields as object
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    const userData = await user.save();
    const generatejwtToken = await user.getJwt();
    res.cookie("token", generatejwtToken, {
      expires: new Date(Date.now() + 86400000),
      secure: true,
      sameSite: "none",
      httpOnly: true,
    });
    res.json({ messsage: "user Saved sucessfully", data: userData });
  } catch (error) {
    console.log("error while signup" + error.message);
    res.status(400).send("bad request");
  }
});

//create a login api
authRouter.post("/login", async (req, res) => {
  try {
    //request email and password from req.body
    const { emailId, password } = req.body;
    //match email with collection from database
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    //using schema methods for validating password and signing jwt tokens
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      //create a jwt token
      const generatejwtToken = await user.getJwt();

      // console.log(generatejwtToken);
      // wrap jwt inside a cookie and send it
      res.cookie("token", generatejwtToken, {
        expires: new Date(Date.now() + 86400000),
        secure: true,
        sameSite: "none",
        httpOnly: true,
      });

      res.send(user);
    } else {
      //never throw exact error for user else attacker can check for specific email or password
      // never explicitly write extra informations or never expose your db.111
      //this is known as information leaking
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    // console.log("error while Login " + error.message);
    res.status(401).send("Invalid Credentials");
  }
});

//create a logout api
authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    secure: true,
    sameSite: "none",
    httpOnly: true,
  });

  res.send("Logout sucessfull");
});
module.exports = authRouter;
