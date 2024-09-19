const adminAuth = (req, res, next) => {
  console.log("checking for admin auth");
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";
  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized Admin");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("checking for user auth");
  const token = "xyz";
  const isUserAuthorized = token === "xyz";
  if (!isUserAuthorized) {
    res.status(401).send("Unauthorized User");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
