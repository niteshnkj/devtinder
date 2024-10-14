const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  //get the cookied and extract token from req.coookies

  try {
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) {
      throw new Error("Invalid Token");
    }

    //verify the token and extract id from that token

    const secretKey = await jwt.verify(token, "DEVtinder$435");
    if (!secretKey) {
      throw new Error("Invalid Secret Key");
    }

    //if  token is valid the extract user and senfd user object as respose
    const { _id } = secretKey;
    const user = await User.findById(_id);
    if (!user) {
      res.send("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = { userAuth };
