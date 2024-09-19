const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
const app = express();

// ? writting middleware for admin and user

app.use("/admin", adminAuth);

app.get("/admin/getallusers", (req, res, next) => {
    console.log("All list fetched")
  res.send("users list fetched sucesfully");
});

app.get("/admin/deleteuser", (req, res) => {
  console.log("User deleted sucessfully");
  res.send("user deleted sucessfully");
});

app.post("/user/register", userAuth, (req, res) => {
  console.log("user registered");
  res.send("user created sucessfully");
});

app.get("/user/login", (req, res) => {
  console.log("loggedin user");
  res.send("user loggedin sucessfully");
});

app.listen(7777, () => {
  console.log("server is running at 7777");
});
