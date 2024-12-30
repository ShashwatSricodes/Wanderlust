const Review = require("../models/review"); // we are requiring the models.
const Listing = require("../models/listing");

module.exports.CreateReview = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    
    if (!listing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }

    const review = new Review(req.body.review); // we create a new review and pass the review details as req.body.review
    review.author = req.user._id; // we assign the author 
    listing.reviews.push(review); // we push the reviews in our database. It is an array so we add one more element in that array via push. 
    await review.save();
    await listing.save();
    req.flash('success', 'Review added successfully!');
    res.redirect(`/listings/${listing._id}`);
};
module.exports.DeleteReviews = async (req, res) => {
    let { id, reviewId } = req.params;
    
    // Remove review from the listing's reviews array
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    
    // Delete the review from the Review collection
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
};

// $pull: { reviews: reviewId }:

// $pull is a MongoDB operator that removes elements from an array that match a specified condition.
// reviews is the field in the Listing schema that stores an array of ObjectIds referencing the review documents.
// reviewId is the ID of the review to be removed from the reviews array.
// This line effectively removes the reference to the review with the given reviewId from the reviews array in the Listing document.