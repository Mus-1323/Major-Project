const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
module.exports.isLoggedin=(req,res,next)=>{
       if(!req.isAuthenticated()){
       req.session.redirectUrl = req.originalUrl;
       req.flash("err","user is not loggedin");
       return res.redirect("/login");
       }
       next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
   if(req.session.redirectUrl){
      res.locals.redirectUrl = req.session.redirectUrl;
   }
   next();
};

module.exports.isowner = async (req, res, next) => {
   let { id } = req.params;
   let listing=await Listing.findById(id);
   if(!listing.owner._id.equals(res.locals.curr._id)){
      req.flash("err","you don't  have  permission to do this ");
       return res.redirect(`/listing/${id}`)
   }
   next();
};
module.exports.isAuthor = async (req, res, next) => {
   let { id,reviewid } = req.params;
   let review=await Listing.findById(reviewidid);
   if(!review.authour._id.equals(res.locals.curr._id)){
      req.flash("err","you don't  have  permission to do this ");
       return res.redirect(`/listing/${id}`)
   }
   next();
};