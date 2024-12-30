const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true, // Ensures a comment is provided
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true, // Ensures a rating is provided
    },
    createdAt: {
        type: Date,
        default: Date.now, // Corrected spelling and removed function call
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User" // Reference to the User model
    }
});

module.exports = mongoose.model("Review", reviewSchema);
