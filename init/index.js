const mongoose = require("mongoose");
const initdata=require("./data.js");
const Listing = require("../models/listing.js");

main()
.then(() => {
    console.log("connected successfully");
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDb=async ()=>{
    await Listing.deleteMany({});
    //this ..obj create the copy of listings all
    //  properties and then make the new object with the owner 
    initdata.data= initdata.data.map((obj) => ({
        ...obj, 
        owner: "6a1c9a6b58e98fddf6470b3f"
    }));
    await Listing.insertMany(initdata.data);
    console.log("data initailalize");
}

initDb();