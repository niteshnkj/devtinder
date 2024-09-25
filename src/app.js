const express = require("express");
const { connectDb } = require("./config/database");
const User = require("./models/user.schema");
const { validateSignUpData } = require("./utils/validation");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/auth");

//adding express.json() middleware to app level so that if json comes from anywhere it will convert that to js object

app.use(express.json());
app.use(cookieParser());

//saving dummy data to database for user schema

app.post("/signup", async (req, res) => {
  try {
    //validate incoming requests
    validateSignUpData(req);

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
    await user.save();
    res.send("user Saved sucessfully");
  } catch (error) {
    console.log("error while signup" + error.message);
    res.status(400).send("bad request");
  }
});

//create a login api
app.post("/login", async (req, res) => {
  try {
    //request email and password from req.body
    const { emailId, password } = req.body;
    //match email with collection from database
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      //create a jwt token
      const generatejwtToken = await jwt.sign(
        { _id: user._id },
        "DEVtinder$435",
        { expiresIn: "1d" }
      );
      console.log(generatejwtToken);
      // wrap jwt inside a cookie and send it
      res.cookie("token", generatejwtToken);

      res.send("Login sucessfull");
    } else {
      //never throw exact error for user else attacker can check for specific email or password
      // never explicitly write extra informations or never expose your db.111
      //this is known as information leaking
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    console.log("error while Login" + error.message);
    res.status(400).send("bad request");
  }
});
//create an api to view user profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
    // res.send("welcome user");
  } catch (err) {
    console.log("Error: " + err.message);
    res.status(400).send("bad request");
  }
});

// database connection
connectDb()
  .then(() => {
    console.log("Database connection established");
    app.listen(7777, () => {
      console.log("server is running at 7777");
    });
  })
  .catch((err) => {
    console.error("database can't be connected" + err);
  });
