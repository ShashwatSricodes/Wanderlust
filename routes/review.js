const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn } = require("../middleware.js");
const ReviewController = require("../controllers/reviews.js")



const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body.review);  
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        return next(new ExpressError(400, msg));  
    } else {
        next();
    }
};

router
    .route("/listings/:id/reviews")
    .post(
        isLoggedIn,         
        validateReview,    
        wrapAsync(ReviewController.CreateReview)
    );

router
    .route("/listings/:id/reviews/:reviewId")
    .delete(
        isLoggedIn,          
        wrapAsync(ReviewController.DeleteReviews)
    );

module.exports = router;