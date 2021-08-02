const mongoose = require("mongoose");

const savedHomeSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        propertyId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Property",
            required: true,

        }
    },
    {
        timestamps: true,
    }
);

const savedHomeModel = mongoose.model("SavedHome", savedHomeSchema);
module.exports = savedHomeModel;