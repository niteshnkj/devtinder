const express = require("express");
const { connectDb } = require("./config/database");
const User = require("./models/user.schema");
const app = express();

//adding express.json() middleware to app level so that if json comes from anywhere it will convert that to js object

app.use(express.json());

//saving dummy data to database for user schema

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("user Saved sucessfully");
  } catch (error) {
    console.log("error while signup" + error.message);
    res.status(400).send("bad request");
  }
});

// reading dummy data from the database
//finding an user with email
app.get("/user", async (req, res) => {
  const email = req.body.emailId;

  try {
    // console.log(email);
    // dont forget to select schema or model that you want to use for filtering this query
    const user = await User.find({ emailId: email });
    if (user.length === 0) {
      res.status(404).send("user with emailId not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(404).send("something went wrong" + err);
  }
});

// writing query to get all users

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(404).send("something went wrong..!!");
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
