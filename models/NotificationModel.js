const mongoose = require("mongoose");


const NotificationSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
            // unique: true,
        },
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true
        }
    },
    {
        timestamps: true,
    }
);

const notificationModel = mongoose.model("Notification", NotificationSchema);
module.exports = notificationModel;