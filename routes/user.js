const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const UserController = require("../controllers/users.js")

// Signup Route
router
    .route("/signup")
    .get(UserController.SignUp)                   // Render signup form
    .post(wrapAsync(UserController.SignUppost));  // Handle signup logic

// Login Route
router
    .route("/login")
    .get(UserController.Login)                    // Render login form
    .post(
        saveRedirectUrl,                          // Save redirect URL for after login
        passport.authenticate("local", {         // Authenticate user
            failureRedirect: "/login", 
            failureFlash: true 
        }),
        UserController.Loginpost                  // Handle login logic
    );

// Logout Route
router.get("/logout", UserController.Logout);      // Handle logout logic

module.exports = router;