const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        chatRoomId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "chatRoom",
            required: true,

        },
        brokerId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Broker",
            required: true,
        },
        senderId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        msgType:{
            type:String,
            required:true
        },
        message:{
            type:String,
            default:null
        },
        fileUrl:{
            type:String,
            default:null
        }
    },
    {
        timestamps: true,
    }
);

const chatModel = mongoose.model("chat", chatSchema);
module.exports = chatModel;