const Joi = require('joi'); //Schema validation ke liye hota hai ye.

module.exports.listingSchema = Joi.object({
    title: Joi.string().required(),  // Required field
    description: Joi.string().required(),  // Required field
    image: Joi.object({
        filename: Joi.string().optional(),  // Optional field
        url: Joi.string().uri().optional()  // Optional field, must be a valid URL
    }).default({}),  // Optional image object, default to empty object if not provided
    price: Joi.number().required(),  // Required field
    location: Joi.string().required(),  // Required field
    country: Joi.string().required()  // Required field
});


const reviewSchema = Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required()
});

module.exports = {
    reviewSchema,
};
