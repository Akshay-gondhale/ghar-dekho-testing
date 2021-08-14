const mongoose = require("mongoose");

const chatRoomSchema = mongoose.Schema(
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

        },
        brokerId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Broker",
            required: true,
        },
        lastMsg:{
            type:Object,
            default:null
        },
        isUserSeen:{
            type:Boolean,
            defaul:false,
            required:true,
        },
        isBrokerSeen:{
            type:Boolean,
            defaul:false,
            required:true
        }
    },
    {
        timestamps: true,
    }
);

const chatRoomModel = mongoose.model("chatRoom", chatRoomSchema);
module.exports = chatRoomModel;