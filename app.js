require('dotenv').config();

// The line:

// require('dotenv').config();
// is used to load environment variables from a .env file into the process.env object in a Node.js application. Here’s a breakdown of what’s happening:

// Explanation:
// require('dotenv'):

// dotenv is a Node.js package that loads environment variables from a .env file into process.env.
// process.env is a global object in Node.js that contains all the environment variables for the current process.
// You need to install the dotenv package in your project for this to work. You can install it via npm by running:
// npm install dotenv
// .config():

// This method reads the .env file, parses the key-value pairs inside it, and then loads them into process.env.
// By calling .config(), the environment variables defined in the .env file will be accessible anywhere in your application through process.env.

const express = require("express");
const MongoStore = require("connect-mongo");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

// The line const path = require("path"); imports the built-in Node.js path module,
//  which provides utilities for working with file and directory paths, such as joining, resolving, and manipulating paths.

const methodOverride = require("method-override");
// In web development, HTTP methods like GET, POST, PUT, and DELETE are commonly used to handle different types of requests.
//  However, some clients (like forms in HTML or older browsers) can only send GET or POST requests.

// method-override is a middleware for Node.js that allows you to simulate HTTP methods like PUT or
//  DELETE (which are often used in RESTful APIs) in situations where only GET and POST are supported.

const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local"); // used to authenticate Users. 
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

// Models & Routes
const User = require("./models/user.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// MongoDB Connection
// const MURL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to DB"))
    .catch(err => console.log("Error connecting to DB:", err));

mongoose.set('debug', true);

// App Configuration
app.set("view engine", "ejs"); // This tells Express to use EJS as the template engine for rendering views (HTML files).
app.set("views", path.join(__dirname, "views")); //Specifies the views directory: This sets the path to the folder where your EJS template files are located.
app.engine("ejs", ejsMate); //Registers a custom EJS engine: This tells Express to use ejsMate as the EJS rendering engine.

app.use(express.urlencoded({ extended: true })); //Middleware to parse URL-encoded data: This middleware parses incoming
//  requests with URL-encoded payloads (from forms, for example) and makes the data available in req.body.
app.use(methodOverride("_method")); // Allows HTTP method overriding: This middleware enables the use
//  of PUT, DELETE, or other HTTP methods in forms, even though HTML forms only support GET and POST methods.
app.use(express.static(path.join(__dirname, "public"))); //Serve static files: This tells Express to serve static files (like images, CSS, JavaScript) from the public folder

// Session and Flash Configuration
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600, // time period in seconds
    crypto: {
        secret: process.env.SECRET,
    },
});
// Session configuration
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

store.on("error", function (e) {
    console.log("Session Store Error", e);
});

app.use(session(sessionOptions)); // we have created a session using cookies.
app.use(flash());

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate())); // Ensure it's invoked as a function
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//locals is used to store values which can be used anywhere in the app.

// Flash Middleware for Global Messages
//res.locals is an object provided by Express that stores local variables for the response.

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// Routes
app.use("/listings", listingRouter);
app.use("/", reviewRouter); // Use only the common part of the route
app.use("/", userRouter);


// Catch-All Route for Undefined Paths
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { statusCode, message });
});

// Server Listener
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
