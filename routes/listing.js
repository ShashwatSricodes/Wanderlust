const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const flash = require("connect-flash");
const { isLoggedIn } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require ('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer ({ storage });

const validateListing = (req, res, next) => {
    const result = listingSchema.validate(req.body.listing);
    if (result.error) {
        throw new ExpressError(400, result.error);
    } else {
        next();
    }
};

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn, // validateListing,
        upload.single('listing[image]'),
        wrapAsync(listingController.CreateListing)
    );

router.route("/new")
    .get(isLoggedIn, listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.ShowListing))
    .put(  isLoggedIn,  upload.single('listing[image]'),  wrapAsync(listingController.UpdateListing))
    .delete(isLoggedIn, wrapAsync(listingController.DeleteListing));

router
    .route("/:id/edit")
    .get(isLoggedIn, wrapAsync(listingController.EditListing));

    router
    .route("/")
    .get(wrapAsync(listingController.index));

    router.get("/", wrapAsync(listingController.filterListings));


module.exports = router;
