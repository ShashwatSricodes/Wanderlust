const Listing = require("../models/listing");

//async is used when the database in involved.

// module.exports.index = async (req, res) => {
//     const { query } = req.query;  // Get the search term from the query parameter
//     let filter = {};

//     if (query) {
//         // If there's a query, filter by title
//         filter.title = { $regex: query, $options: 'i' };  // Case-insensitive search
//     }

//     // Fetch listings based on filter (empty filter returns all listings)
//     const allListings = await Listing.find(filter);

//     // Pass the filtered listings and the query to the view
//     res.render("listings/index.ejs", { allListings, query }); // We pass allListings to the EJS. It renders the page for you.
// };

module.exports.index = async (req, res) => {
    const { query, category } = req.query;  // Get both search term and category from query parameters
    let filter = {};

    if (query) {
        // If there's a query, filter by title
        filter.title = { $regex: query, $options: 'i' };  // Case-insensitive search
    }

    if (category) {
        // If category is provided, filter by category
        filter.category = category;
    }

    // Fetch listings based on filter (empty filter returns all listings)
    const allListings = await Listing.find(filter);

    // Pass the filtered listings and the query to the view
    res.render("listings/index.ejs", { allListings, query, category });
};

module.exports.filterListings = async (req, res) => {
    const { category } = req.query; // Get category from query params
    let filteredListings = [];

    if (category) {
        // If category is provided, filter listings by category
        filteredListings = await Listing.find({ category });
    } else {
        // If no category is provided, return all listings
        filteredListings = await Listing.find({});
    }

    res.render("listings/index.ejs", { allListings: filteredListings });
};

module.exports.renderNewForm =  (req, res) => {
    const categories = Listing.schema.paths.category.enumValues;
    res.render("listings/new.ejs",{categories});
};

module.exports.ShowListing = async (req, res) => {
    let { id } = req.params; //In Express.js, req.params is an object that contains route parameters from the URL of the incoming request. Parameters
    const listing = await Listing.findById(id).populate("reviews").populate("owner"); 
    // .populate This tells mongoose to replace the reviews field which is likely an array of objects with the actual review
    //documents from the review collection
    res.render("listings/shows.ejs", { listing });
};

module.exports.CreateListing = async (req, res, next) => { 
    let url = req.file.path;
    let filename = req.file.filename; // We can print and see what kind of object we are getting and then take the parameters accordingly
    const newListing = new Listing(req.body.listing); // a new listing object is created.
    newListing.owner = req.user._id; // multer se ye sab details mila hai
    newListing.image = { url , filename };
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};



// The next parameter in the function signature of the CreateListing method is part of the middleware pattern in Express.js. It is included in route handlers for error handling or passing control to the next middleware function in the stack.

// Why does this function have next?
// In this specific function, the next parameter is not actively used in the code, but it is included as a placeholder. This could be because the function is designed to follow the middleware pattern, where next would be used for error handling or passing control to the next middleware in the chain.


module.exports.EditListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
};

module.exports.UpdateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //... data ko spread karke send kardeta hai. This means the id is updated with the passed data.
   
   if(typeof req.file !== "undefined") // Means user ne image di hai hume.
    {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url , filename };
    await listing.save();}
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.DeleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!"); // to Flash a message.
    res.redirect("/listings");
};
