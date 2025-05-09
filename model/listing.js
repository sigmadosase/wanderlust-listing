const mongoose=require("mongoose");
const reviews = require("./reviews");
const { ref } = require("joi");
const Schema=mongoose.Schema;

const listingSchema =new Schema({
    title:{
        type: String,
        required:true,
    },
    description:String,
    image:{
        type :String,
        default:" https://tse1.mm.bing.net/th?id=OIP.jqk4B_Mlq9qmMSBNM7FFJgHaEK&pid=Api&P=0&h=180" ,
        set: (v) => v === "" ? " https://tse1.mm.bing.net/th?id=OIP.jqk4B_Mlq9qmMSBNM7FFJgHaEK&pid=Api&P=0&h=180" : v ,
    },
    price: Number,
    location:String,
    country: String,
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
});

const listing =mongoose.model("listing", listingSchema);
module.exports =listing;