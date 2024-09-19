const express = require("express");
const app = express();

// *? playing with multiple route handlers

app.use(
  "/user",
  (req, res, next) => {
    console.log("Request handler 1");
    // res.send("Response 1");
    next();
  },
  (req, res, next) => {
    console.log("Request handler 2");
    // res.send("Response 2");
    next();
  }
  ,
  (req, res, next) => {
    console.log("Request handler 3");
    // res.send("Response 3");
    next();
  }
  ,
  (req, res, next) => {
    console.log("Request handler 4");
    // res.send("Response 4");
    next();
  }
  ,
  (req, res, next) => {
    console.log("Request handler 5");
    res.send("Response 5");
    next();
  }
);

app.listen(7777, () => {
  console.log("server is running at 7777");
});
