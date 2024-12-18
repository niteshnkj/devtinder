const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const SAFE_USER_DATA = "firstName lastName photoUrl age gender about skills";
//get all pending connection requests from the loggedIn user.
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    // check for loggedin user
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", SAFE_USER_DATA);
    //also you can pass an array of fields that you need to populate [firstName,lastName.....]
    res.json({
      message: "data fetched sucessfully",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//get all the connections list for logged in user
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser._id,
          status: "accepted",
        },
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", SAFE_USER_DATA)
      .populate("toUserId", SAFE_USER_DATA);
    console.log(connectionRequests);
    const data = connectionRequests.map((row) => {
      if (row.toUserId._id.toString() === loggedInUser._id.toString()) {
        return row.fromUserId;
      }
      return row.toUserId;
    });

    res.json({
      data,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    //find all the connection request that are present in logged in user
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser }, { toUserId: loggedInUser }],
    }).select("fromUserId  toUserId");
    //filter unique ids of connection requests that are present for current user
    const hideUserData = new Set();
    connectionRequest.forEach((req) => {
      hideUserData.add(req.fromUserId.toString());
      hideUserData.add(req.toUserId.toString());
    });
    //exclude all the connections that are already present for logged in user in thier requests and send rest of the data
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserData) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(SAFE_USER_DATA)
      .skip(skip)
      .limit(limit);
    res.json({ data: users });
  } catch (error) {
    res.send(error.message);
  }
});
module.exports = userRouter;
