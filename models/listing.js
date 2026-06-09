const mongoose=require("mongoose");
const { listingSchema } = require("../schema");
const review = require("./review");
const Schema=mongoose.Schema;
const Review=require("./review.js");

let ListingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image: {
    url:String,
    filename:String,
  },
    price:Number,
    location:String,
    country:String,
    reviews:[
      {
        type: Schema.Types.ObjectId,
        ref:"Review"
      },
    ],
    owner:{
      type:Schema.Types.ObjectId,
      ref:"User",
    },
    geometry:{
   type:{
      type:String,
      enum:["Point"]
   },
   coordinates:{
      type:[Number]
   }
},
    
});

  ListingSchema.post("findOneAndDelete" ,async(listing)=>{
    if(listing){
      await review.deleteMany({_id:{$in:listing.reviews}});
    }
  });

const Listing = mongoose.model("Listing", ListingSchema);
module.exports=Listing;