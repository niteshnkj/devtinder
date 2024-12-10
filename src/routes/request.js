const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      //extract all the fields
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      //check for status if there is random status coming from request throw error
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        res.status(400).json({ message: "Invalid status type: " + status });
      }
      //check for random user if there is no registered user in db then dont allow send connection to any random user
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({ message: "user not found." });
      }
      //check if userid is not same as loggedin user before sending connection requst on schema level validation
      //check if there is an existing sent connection or check from profile B also if they have already a pending connection request from profile A.
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      //if there is an existing connecting in profile A or B (i.e in db) throw an error
      if (existingConnectionRequest) {
        return res.status(400).send({ message: "Connection already Exist!!" });
      }
      // create an instance of Connection Request
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      //save to db and send a json response
      const data = await connectionRequest.save();
      res.json({
        message:
          req.user.firstName +
          " sent " +
          status +
          " connection to " +
          toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      // find if the user is logged in or not
      const loggedInuser = req.user;
      // if user is loggedin check for incoming status is valid or not
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ messaage: "Status not allowed!" });
      }
      // if status is valid check for requestID is valid or not by finding request id in db
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInuser,
        status: "interested",
      });
      if (!connectionRequest) {
        res.status(400).json({
          message: "connection request not found",
        });
        return;
      }
      // if request id is valid change the status accordingly and save it to the db
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: "connection request " + status, data });
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
  }
);
module.exports = requestRouter;
