module.exports.isLoggedIn = (req, res, next)=> {
    
    if(!req.isAuthenticated())
    {   //redirectUrl save
        req.session.redirectUrl = req.originalUrl; // saves the original url where the user was trying to go but could not because he was not authenticated.
        req.flash("error", " You must be logged in");
       return res.redirect("/login");
    }
next();
};

 
module.exports.saveRedirectUrl = (req,res,next) =>
{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl =  req.session.redirectUrl; // This middleware ensures that the redirect URL is available in the view templates.
        //  It makes it easy to automatically redirect the user back to their originally intended page after they log in.
    }
    next();
};

