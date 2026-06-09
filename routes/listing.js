const express = require("express");
const router=express.Router();
const {listingSchema}=require("../schema.js");
const wrapASync=require("../uitil/asyncWrap.js");
const ExpressError=require("../uitil/ExpressError.js");
const Listing = require("../models/listing.js");
const methodOverride = require("method-override");
const {isLoggedin}=require("../middleware.js");
const {isowner}=require("../middleware.js");
const listingController=require("../controller/listing.js");
const multer  = require('multer');
const {storage}=require("../CLoudcongir.js");
const upload = multer({storage});



const validateError=(req,res,next)=>{
let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg)
    }else{
        next();
    }
};
router.route("/")
.get( wrapASync(listingController.index))
.post(isLoggedin,upload.single("listing[image]"),validateError, wrapASync(listingController.CreateList));







// 2. New Route: Render creation form
router.get("/new",isLoggedin, (req, res) => {
    res.render("edit.ejs"); 
});

router.route("/:id")
.get(wrapASync(listingController.showRoute))
.put(isLoggedin,isowner,upload.single("listing[image]"),validateError, wrapASync(listingController.SubmitUpdate))
.delete(isowner,wrapASync(listingController.destroyList));




// 4. update form means edit 
router.get("/:id/edit",isLoggedin,isowner,wrapASync(listingController.UpdateRoute));



module.exports=router;