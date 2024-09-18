const express = require("express");
const app = express();

app.use("/",(req, res) => {
  res.send("hello from server");
});
app.use("/hello", (req, res) => {
  res.send("hello grom server");
});
app.use("/test", (req, res) => {
  res.send("testing output for test route");
});

app.listen(7777, () => {
  console.log("server is running at 7777");
});
