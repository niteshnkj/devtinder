const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
//create an api to view user profile
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
    // res.send("welcome user");
  } catch (err) {
    console.log("Error: " + err.message);
    res.status(400).send("bad request");
  }
});

module.exports = profileRouter;
