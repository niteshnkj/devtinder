const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  //get the cookied and extract token from req.coookies

  try {
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) {
      return res.status(401).json({ message: "Access Denied" });
    }

    //verify the token and extract id from that token

    const secretKey = await jwt.verify(token, "DEVtinder$435");
    if (!secretKey) {
      res.status(400).json({ message: "Invalid Token" });
    }

    //if  token is valid then extract user and send user object as respose
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
