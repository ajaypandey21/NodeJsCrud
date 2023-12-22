var express = require("express");
var router = express.Router();
const userModel = require("./users");
const passport = require("passport");
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.get("/profile", isLogggedin, function (req, res, next) {
  res.render("profile");
});
router.get("/login", function (req, res) {
  res.render("login");
});
router.post("/register", function (req, res) {
  const { email, username, fullname, password } = req.body;
  const userData = new userModel({ email, username, fullname });
  
  userModel.register(userData, password)
    .then(() => {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/profile");
      });
    })
    .catch((error) => {
      console.error(error);
      // Handle registration failure, e.g., redirect to a registration error page
     
    });
  

});
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/",
  }),
  function (req, res) {}
);
function isLogggedin(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("login");
}

module.exports = router;
