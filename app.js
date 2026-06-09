if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engineMate=require("ejs-mate");
const ExpressError=require("./uitil/ExpressError.js");
const listingRoute=require("./routes/listing.js");
const reviewRoute=require("./routes/review.js");
const signupRoute=require("./routes/signup.js");
const port = 8080;
const session = require('express-session');
var flash = require('connect-flash');
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User = require("./models/user.js");
const dbUrl = process.env.ATLASDB_URL;

const MongoStore = require("connect-mongo");

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600,
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e);
});
const sessionOption = {
    store,
    secret:process.env.SECREAT,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

// --- MIDDLEWARE ---
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs",engineMate);
app.use(express.static(path.join(__dirname,"public")));
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 


// --- VIEWS SETUP ---
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// --- DATABASE CONNECTION ---
async function main() {
   await mongoose.connect(dbUrl);
}

main()
.then(() => console.log("Connected to DB"))
.catch(err => console.log(err));


// --- ROUTES ---

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("err");
    res.locals.curr = req.user;
    next();
});


app.use("/listing", listingRoute);
app.use("/listing/:id/reviews", reviewRoute);
app.use("/", signupRoute);


//error handlings
// 1. Corrected catch-all route matcher
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// 2. Corrected Error-handling middleware (err must be first!)
app.use((err, req, res, next) => {

    if(res.headersSent){
        return next(err);
    }

    let { status = 500, message = "Something went wrong" } = err;

    res.status(status).render("error.ejs", { message });
});





// --- START SERVER ---
app.listen(port, () => {
    console.log(`this is the port ${port}`);
});