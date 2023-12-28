var express = require("express");
var router = express.Router();
const userModel = require("./users");
const passport = require("passport");
const upload = require("./multer");
const upload2 = require("./multer2");
const postModel = require("./posts");
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get("/test",(req,res)=>{
  res.render("test")
})
router.get("/dash",async(req,res)=>{
  const userData = await userModel.find()
  res.render("dash",{user:userData})
})
router.get("/", function (req, res, next) {
  res.redirect("profile",);
});
router.get("/profile", isLogggedin, async function (req, res, next) {
  const userData = await userModel
    .findOne({
      username: req.session.passport.user,
    })
    .populate("posts");

  res.render("test", { userData });
});
router.get("/login", function (req, res) {
  res.render("login", { error: req.flash("error") });
});
router.post("/register", function (req, res) {
  const { email, username, fullname, password } = req.body;
  const userData = new userModel({ email, username, fullname });

  userModel
    .register(userData, password)
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
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {}
);
router.post(
  "/pfp",
  isLogggedin,
  upload.single("file"),
  async function (req, res) {
    if (!req.file) {
      return res.status(400).send("no files selected");
    }
    const user = await userModel.updateOne(
      { username: req.session.passport.user },
      { $set: { image: req.file.filename } }
    );
    res.redirect("/profile");
  }
);
router.post(
  "/photos",
  isLogggedin,
  upload2.single("photo"),
  async function (req, res) {
    if (!req.file) {
      return res.status(400).send("no files selected");
    }
    const user = await userModel.findOne({
      username: req.session.passport.user,
    });
    const post = await postModel.create({
      postText: req.body.postText,
      image: req.file.filename,
      user: user._id,
    });
    user.posts.push(post._id);
    await user.save();
    res.redirect("/profile");
  }
);

function isLogggedin(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("login");
}

module.exports = router;
