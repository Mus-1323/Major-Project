const express = require("express");
const router=express.Router({mergeParams: true});
const {reviewSchema}=require("../schema.js");
const Review = require("../models/review.js");
const ExpressError=require("../uitil/ExpressError.js");
const wrapASync=require("../uitil/asyncWrap.js");
const Listing = require("../models/listing.js");
const {isLoggedin}=require("../middleware.js");
const {isAuthor}=require("../middleware.js");
const ReviewController=require("../controller/review.js");


const validateReview=(req,res,next)=>{
let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg)
    }else{
        next();
    }
};

//review post
router.post("/",validateReview ,isLoggedin ,wrapASync(ReviewController.ReviewPost));
//review delete
router.delete("/reviewId" ,isLoggedin,isAuthor, wrapASync(ReviewController.destroyReview));


module.exports=router;