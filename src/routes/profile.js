const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditprofileData } = require("../utils/validation");

//create an api to view user profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
    // res.send("welcome user");
  } catch (err) {
    console.log("Error: " + err.message);
    res.status(400).send("bad request");
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditprofileData(req)) {
      throw new Error("Invalid Edit Request");
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated sucessfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
// todo delete profile
// todo patch/profile/password -> forgot password api
/**
 * check if user is loggedin or not
 * if loggedIn
 * take existing password
 * validate and compare existing pasword
 * if validated take new password
 * match new pasword with confirm password field
 * encypt pasword
 * send a response with success code
 */
module.exports = profileRouter;
