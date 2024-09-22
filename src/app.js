const express = require("express");
const { connectDb } = require("./config/database");
const User = require("./models/user.schema");
const app = express();

//adding express.json() middleware to app level so that if json comes from anywhere it will convert that to js object

app.use(express.json());

//saving dummy data to database for user schema

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  // write validations before starting  encrypting passwords episode
  /**
   *  4 fields are required
   */
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
