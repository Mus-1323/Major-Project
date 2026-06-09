const Listing=require("../models/listing.js");
//index 
module.exports.index=async (req, res) => {
     let allList = await Listing.find({});
     res.render("index.ejs", { allList });
};

//create New List//add karta hain main wala mein
module.exports.CreateList = async (req, res) => {

    let url = req.file.path;
    let filename = req.file.filename;

    let newList = new Listing(req.body.listing);

    // owner
    newList.owner = req.user._id;

    // image
    newList.image = { url, filename };

    // location
    let location = req.body.listing.location;

    const response = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${location}&apiKey=${process.env.MAP_TOKEN}`
    );

    const data = await response.json();

    // geometry
    if (data.features.length > 0) {
        newList.geometry = data.features[0].geometry;
    }

    await newList.save();

    req.flash("success", "New Listing Added!");

    res.redirect("/listing");
};

//show Route
module.exports.showRoute=async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id)
    .populate({path:"reviews",populate:{path:"authour",}}).populate("owner");
    if(!list){
     req.flash("err" ,"the list you are trying to show it is no longer available!");
     return res.redirect("/listing");
}
    res.render("show.ejs", { list,mapToken: process.env.MAP_TOKEN});
};

//Update Route render   
module.exports.UpdateRoute=async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
     if(!list){
     req.flash("err" ,"the list you are trying to update it is no longer available!");
     return res.redirect("/listing");
}
    //we replace to uploads beacuse hume upodate ke liye kam pixel chaiye
    let originalUrl =list.image.url;
    originalUrl.replace("/upload","/upload/h_300,width_250")
    res.render("edit1.ejs", { list });
};

//update krna hain submit karke
module.exports.SubmitUpdate=async (req, res) => {
    let { id } = req.params;
     let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file!=="undefined"){
     let url=req.file.path;
      let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();}
     req.flash("success" ,"List updated sucessfully");
    res.redirect("/listing");
};

//delete route
module.exports.destroyList=async (req,res) => {
   let { id }=req.params;
   let Delete1 = await Listing.findByIdAndDelete(id);
    req.flash("success" ,"Post Deleted Succesfully!");
   res.redirect("/listing");

};