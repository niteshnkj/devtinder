const express = require("express");
const { connectDb } = require("./config/database");
const User = require("./models/user.schema");
const { validateSignUpData } = require("./utils/validation");
const app = express();
const bcrypt = require("bcrypt");

//adding express.json() middleware to app level so that if json comes from anywhere it will convert that to js object

app.use(express.json());

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
// reading dummy data from the database
//finding an user with email
app.get("/user", async (req, res) => {
  const email = req.body.emailId;

  try {
    // console.log(email);
    // dont forget to select model=>User that you want to use for filtering this query
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
// api for deleting user from a collection
app.delete("/user", async (req, res) => {
  const id = req.body.id;
  try {
    await User.findByIdAndDelete(id);
    res.send("user deleted sucessfully");
  } catch (err) {
    res.status(404).send("something went wrong" + err);
  }
});

//api for updating an existing user document

app.patch("/user/:id", async (req, res) => {
  // to acess dynamic id as param
  const userId = req?.params.id;
  const data = req.body;

  try {
    // writing validations on api level for skills and email and empty field
    const ALLOWED_UPDATES = [
      "userId",
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    // console.log(userId);
    await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User updated sucessfully");
  } catch (err) {
    res.status(404).send("something went wrong" + err);
  }
});

// api for finding the user by email and update

// app.patch("/user", async (req, res) => {
//   const email = req.body.emailId;
//   const data = req.body;
//   try {
//     await User.findOneAndUpdate({ emailId: email }, { ...data });
//     res.send("user Updated sucessfully");
//   } catch (err) {
//     res.status(404).send("something went wrong" + err);
//   }
// });

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
