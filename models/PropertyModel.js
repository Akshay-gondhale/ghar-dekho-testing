const mongoose = require("mongoose");
const { nanoid } = require('nanoid');

const propertySchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        ownerName: {
            type: String,
            required:true
        },
        ownerPhone: {
            type: String,
            required:true
        },
        ownerEmail: {
            type: String,
            required:true
        },
        houseNumber: {
            type: String,
            required:true
        },
        locality: {
            type: String,
            required:true
        },
        area: {
            type: String,
            required:true
        },
        city: {
            type: String,
            required:true
        },
        landmark: {
            type: String,
            required:true
        },
        homeType: {
            type: String,
            required:true
        },
        parking: {
            type: String,
            required:true
        },
        floor: {
            type: String,
            required:true
        },
        totalFloor: {
            type: String,
            required:true
        },
        carpetArea: {
            type: String,
            required:true
        },
        age: {
            type: String,
            required:true
        },
        isVeg: {
            type: Boolean,
            required:true
        },
        sellOrRent: {
            type: String,
            required:true
        },
        ammount: {
            type: String,
            required:true
        },
        description: {
            type: String,
            required:true
        },
        title: {
            type: String,
            required:true
        },
        images: [
            {
                path: {
                    type:String,
                    // required: true
                },
            },
        ],
        status: {
            type: String,
            required:true
            //registerd
            //in-progress
            //verified
            //rejected
        },
        isAvailable:{
            type:Boolean,
            default:true,
            // required:true
        },
        brokerId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Broker",
            default:null
        },
        rejectedReason:{
            type:String,
            default:null,
        },
        shortId:{
            type:String,
            default:nanoid(12),
        }
    },
    {
        timestamps: true,
    }
);

const propertyModel = mongoose.model("Property", propertySchema);
module.exports = propertyModel;