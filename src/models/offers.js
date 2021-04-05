const mongoose = require("mongoose");

const offersSchema = mongoose.Schema({
    img:{
        type:String,
        trim:true
    },
    buildingName:{
        type:String,
        trim:true
    }
});

const offers = new mongoose.model("offers", offersSchema);

module.exports = offers;
