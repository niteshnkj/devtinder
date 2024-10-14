const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
  try {
    const user = req.user;
    res.send("Got a new connection request from: " + user.firstName);
  } catch (err) {
    console.log("Error: " + err.message);
    res.status(400).send("bad request");
  }
});

module.exports = requestRouter;
