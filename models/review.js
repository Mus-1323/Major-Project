const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const ReviewSchema = new Schema({
    comment: {          // Fixed: lowercase 'c' and two 'm's
        type: String,
        required: true   
    },
    rating: {           // Fixed: lowercase 'r'
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now // Dynamic timestamp for when the review is submitted
    },
    authour:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});

// Fixed: Correct spelling "Review" so it connects to your 'reviews' collection
module.exports = mongoose.model("Review", ReviewSchema);