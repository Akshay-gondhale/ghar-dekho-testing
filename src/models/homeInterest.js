const mongoose = require("mongoose");



const homeInterestSchema = mongoose.Schema({
    home_id: {
        type: String,
        trim: true,
    },
    owner: {
        type: String,
        trim: true,
    },
    sellOrRent: {
        type: String,
        trim: true,
    },
    ammount: {
        type: String,
        trim: true,
    },
    firstImage: {
        type: String,
        trim: true,
    },
    secondImage: {
        type: String,
        trim: true,
    },
    thirdImage: {
        type: String,
        trim: true,
    },
    fourthImage: {
        type: String,
        trim: true,
    },
    homeType: {
        type: String,
        trim: true,
    },
    add_areaName: {
        type: String,
        trim: true,
    },
    add_city: {
        type: String,
        trim: true,
    },
    add_landmark: {
        type: String,
        trim: true,
    },
    carpetArea: {
        type: String,
        trim: true,
    },
    parking: {
        type: String,
        trim: true,
    },
    floor: {
        type: String,
        trim: true,
    },
    totalFloor: {
        type: String,
        trim: true,
    },
    age: {
        type: String,
        trim: true,
    },
    vegetarian: {
        type: String,
        trim: true,
    },
    user_id: {
        type: String,
        trim: true,
    },
    userName: {
        type: String,
        trim: true,
    },
    userPhone: {
        type: String,
        trim: true,
    },
    requestedAt: {
        type: String,
        default: new Date()
    },
   
})
const homeInterest = new mongoose.model("homeInterest", homeInterestSchema);

module.exports = homeInterest;