const express = require("express");
const { connectDb } = require("./config/database");

const app = express();
// database connection
connectDb()
  .then(() => {
    console.log("Database connection established");
    app.listen(7777, () => {
      console.log("server is running at 7777");
    });
  })
  .catch((err) => {
    console.error("database can't be connected" + err);
  });
