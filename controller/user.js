const User=require("../models/user.js");
//joh singup Lata Hain
module.exports.PageSignup=(req,res)=>{
    res.render("signup.ejs");
};
//register karta hain
module.exports.signUp = async (req,res,next) => {

    try{

        let {username,email,password} = req.body;

        let newUser = new User({username,email});

        const registeredUser = await User.register(newUser,password);

        req.login(registeredUser,(err)=>{

            if(err){
                return next(err);
            }

            req.flash("success","Registration successful");

            return res.redirect("/listing");
        });

    } catch(e){

        req.flash("err","User already registered");

        res.redirect("/signup");
    }
};
//login get
module.exports.renderLoginForm = (req,res)=>{
    res.render("login.ejs");
};

module.exports.LoginPost=(req, res) => {
    req.flash("success", "Welcome back to Wanderlust");
     let redirectUrl = res.locals.redirectUrl || "/listing";
     res.redirect(redirectUrl);
  };


  module.exports.LogoutPost=(req,res)=>{
   req.logout((err)=>{
    if(err){
      //this send the req to the express handling   this 
      // tell ki maine apne side se solve krdi hain abhi iyeh next wale ke pass jayegi
      next(err);
    }
   });
   req.flash("err","there is something wrong");
   res.redirect("/listing");
};