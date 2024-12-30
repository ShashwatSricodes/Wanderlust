const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Mongoose object hai jo ki schema define karta hai 
const Review = require("./review.js"); // ./ refers to file in the current directory. & ../ refers to the parent directory.


const ListingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: String,
        filename: String
        
    },
    price: Number,
    location: String,
    country: String,

    reviews: // Relationship stablish karta hai between reviews and Listings
    [
        {
            type : Schema.Types.ObjectId,
            ref : "Review", //Indicates that the ObjectId corresponds to a document in the Review collection.
        }
    ], // a listing can have multiple reviews that is why an array is used.
    owner: {
        type : Schema.Types.ObjectId,
        ref : "User",        
    },
    category: {
        type: String, // Category should be a string
        enum: ['Trending', 'Rooms', 'Iconic-cities', 'Beaches', 'Castles'], // Optional: Define allowed categories
      
    }
});

ListingSchema.post("findOneAndDelete" , async(listing)=> // It is a middleware Automatically deletes all reviews associated with a listing when the listing is deleted.
{
    if(listing){
    await Review.deleteMany({_id : {$in : listing.reviews}})
    }
});

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;


