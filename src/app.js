const express = require("express");
const app = express();

// order of execution matters if this remains here execution will not go to the next route 
app.use("/user",(req,res)=>{
    res.send("HAHAHAHAHAHAHAHAHAHA")
})

app.get("/user", (req, res) => {
  res.send({ firstname: "Nitesh", lastname: "Jha" });
});
app.post("/user", (req, res) => {
    res.send("User saved sucessfully!");
});
app.patch("/user", (req, res) => {
    res.send("User updated sucessfully ");
});
app.delete("/user", (req, res) => {
    res.send("User deleted sucessfully");
});

app.use("/hello", (req, res) => {
  res.send("hello from server");
});
app.use("/test", (req, res) => {
  res.send("testing output for test route");
});
// app.use("/", (req, res) => {
//   res.send("hello Nitesh");
// });
app.listen(7777, () => {
  console.log("server is running at 7777");
});
