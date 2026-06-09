const express = require("express");
const router=express.Router({mergeParams: true});
const User=require("../models/user.js");
const wrapASync=require("../uitil/asyncWrap.js");
const passport=require("passport");
const {saveRedirectUrl }=require("../middleware.js");
const userController=require("../controller/user.js");

router.route("/signup")
.get(userController.PageSignup)
.post(wrapASync (userController.signUp));

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  userController.LoginPost
);

router.get("/logout",userController.LogoutPost);

module.exports=router;