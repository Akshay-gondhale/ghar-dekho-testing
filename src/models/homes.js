const mongoose = require("mongoose");



const homeSchema = mongoose.Schema({
    uploaderName: {
        type: String,
        required: true,
        trim: true,
    },
    uploaderEmail: {
        type: String,
        required: true,
        trim: true,
    },
    uploaderPhone: {
        type: String,
        required: true,
        trim: true,
    },
    ownerName: {
        type: String,
        required: true,
        trim: true,
    },
    ownerEmail: {
        type: String,
        required: true,
        trim: true,
    },
    ownerPhone: {
        type: String,
        required: true,
        trim: true,
    },
    add_houseNumber: {
        type: String,
        required: true,
        trim: true,
    },
    add_bldgAreaName: {
        type: String,
        required: true,
        trim: true,
    },
    add_areaName: {
        type: String,
        required: true,
        trim: true,
    },
    add_city: {
        type: String,
        required: true,
        trim: true,
    },
    add_landmark: {
        type: String,
        required: true,
        trim: true,
    },
    homeType: {
        type: String,
        required: true,
        trim: true,
    },
    parking: {
        type: String,
        required: true,
        trim: true,
    },
    floor: {
        type: String,
        required: true,
        trim: true,
    },
    totalFloor: {
        type: String,
        required: true,
        trim: true,
    },
    carpetArea: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: String,
        required: true,
        trim: true,
    },
    vegetarian:{
        
        type: String,
        required: true,
        trim: true,
        default: "no"
    },
    firstImage: {
        type: String,
        required: true,
        trim: true,
    },
    secondImage: {
        type: String,
        required: true,
        trim: true,
    },
    thirdImage: {
        type: String,
        required: true,
        trim: true,
    },
    fourthImage: {
        type: String,
        required: true,
        trim: true,
    },
    sellOrRent: {
        type: String,
        required: true,
        trim: true,
    },
    ammount: {
        type: String,
        required: true,
        trim: true,
        default:null,
    },
 
    createdAt: {
        type: String,
        default: new Date(),
    },
    isVerified: {
        type: Boolean,
        default: false,
    }

})
const home = new mongoose.model("home", homeSchema);

module.exports = home;