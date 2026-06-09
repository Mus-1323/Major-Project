const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
//review Add
module.exports.ReviewPost=async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    newreview.authour=req.user._id;
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    
    console.log("new Db saved");
     req.flash("success" ,"Review Added!");
    res.redirect(`/listing/${listing._id}`); 
};
//Review Delete
module.exports.destroyReview=async (req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
     req.flash("success" ,"review deleted!");
    res.redirect(`/listing/${id}`);
};