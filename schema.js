const joi=require("joi");

module.exports.listingSchema= joi.object({
    listing :joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    location:joi.string().required(),
    price: joi.number().required().min(500),
    image: joi.string().allow("",null),
    country:joi.string().required()
}).required(),
});