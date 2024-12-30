const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn } = require("../middleware.js");
const ReviewController = require("../controllers/reviews.js")


// Review validation
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body.review);  // Validate the review object
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        return next(new ExpressError(400, msg));  // Throw custom error for validation failure
    } else {
        next();
    }
};

router
    .route("/listings/:id/reviews")
    .post(
        isLoggedIn,          // Ensure user is logged in before adding a review
        validateReview,      // Validate the review object
        wrapAsync(ReviewController.CreateReview)
    );

router
    .route("/listings/:id/reviews/:reviewId")
    .delete(
        isLoggedIn,          // Ensure user is logged in before deleting a review
        wrapAsync(ReviewController.DeleteReviews)
    );

module.exports = router;