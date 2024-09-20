const express = require("express");
const { connectDb } = require("./config/database");
const User = require("./models/user.schema");
const app = express();

//saving dummy data to database for user schema

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "akshay",
    lastName: "saini",
    age: "28",
    emailId: "aksay@saini.com",
  });
  try {
    await user.save();
    res.send("user Saved sucessfully");
  } catch (error) {
    console.log("error while signup" + error.message);
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
