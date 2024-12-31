const User = require("../models/user");

module.exports.SignUp = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.SignUppost = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
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
    req.flash("success", "Welcome to Wanderlust, you are logged in");
    res.redirect(res.locals.redirectUrl || "/listings");
};

module.exports.Logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};
