const mongoose = require("mongoose");


const ContactUsMessageSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
            required: true,
            // unique: true,
        },
        message:{
            type:String,
            required:true
        }
    },
    {
        timestamps: true,
    }
);

const contactUsMessageModel = mongoose.model("ContactUsMessage", ContactUsMessageSchema);
module.exports = contactUsMessageModel;