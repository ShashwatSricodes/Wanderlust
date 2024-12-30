const User = require("../models/user");

module.exports.SignUp = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.SignUppost = async (req, res, next) => { // Add next here for proper error handling
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password); // passport ka use kar rhe hain. 
        
        req.login(registeredUser, (err) => { // this line automatically registers the user once they sign up. 
            if (err) {
                return next(err); // Properly pass the error to next middleware
            }
            req.flash("success", "User was registered");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.Login = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.Loginpost = async (req, res) => {
    req.flash("success", "Welcome to Wanderlust, you are logged in"); // I don't see the lgin logic will have to see to that. 
    res.redirect(res.locals.redirectUrl || "/listings") ; // Ensure it redirects to the intended URL or default to "/listings" 
};

module.exports.Logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err); // Pass the error to the next middleware if it exists
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};

