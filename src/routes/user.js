const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    // check for loggedin user
    const logggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: logggedInUser._id,
      status: "interested",
    }).populate(
      "fromUserId",
      "firstName lastName photoUrl age gender about skills"
    );
    //also you can pass an array of fields that you need to populate [firstName,lastName.....]
    res.json({
      message: "data fetched sucessfully",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = userRouter;
