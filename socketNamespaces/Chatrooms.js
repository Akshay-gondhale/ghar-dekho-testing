const ChatRoom = require("../models/ChatRoomsModel")
var ObjectId = require('mongodb').ObjectID;
const Chatrooms = async (socket) => {

    console.log("someone connected to chatroom " + socket.id)


    socket.on("disconnect", () => {
        console.log("user disconnected from chatroom")
    })
    console.log(socket.handshake.query)
    socket.on("get-chatrooms", async (data, callback) => {
        const userId = data.userId;
        console.log("getChatRoom called from userId - " + userId)

        const new_latestChats = await ChatRoom.find({ userId, isUserSeen: false }).sort({ updatedAt: -1 }).limit(25).populate("propertyId brokerId")
        var new_isNext = await ChatRoom.find({ userId, isUserSeen: false })
            .sort({ updatedAt: -1 })
            .limit(26)
            .countDocuments();

        var new_isNextAvailable, new_lastId;
        if (new_isNext > 25) {
            // if next page is available
            new_isNextAvailable = true;
            new_lastId = new_latestChats[25 - 1]._id;
        } else {
            // if next is not available
            new_isNextAvailable = false;
            new_lastId = null;
        }

        var newMessage = {};
        newMessage.isNextAvailable = new_isNextAvailable;
        newMessage.lastId = new_lastId;
        newMessage.data = new_latestChats

        //for old messages

        const old_latestChats = await ChatRoom.find({ userId, isUserSeen: true }).sort({ updatedAt: -1 }).limit(25).populate("propertyId brokerId")
        var old_isNext = await ChatRoom.find({ userId, isUserSeen: true })
            .sort({ updatedAt: -1 })
            .limit(26)
            .countDocuments();

        var old_isNextAvailable, old_lastId;
        if (old_isNext > 25) {
            // if next page is available
            old_isNextAvailable = true;
            old_lastId = old_latestChats[25 - 1]._id;
        } else {
            // if next is not available
            old_isNextAvailable = false;
            old_lastId = null;
        }

        var oldMessage = {};
        oldMessage.isNextAvailable = old_isNextAvailable;
        oldMessage.lastId = old_lastId;
        oldMessage.data = old_latestChats


        const pipeline = [
            {
                '$match': {
                    "fullDocument.userId": ObjectId(userId),
                    // "fullDocument.isUserSeen": data.type === "oldMessage" ? true : false
                }
            }
        ]


        ChatRoom.watch(pipeline, { "fullDocument": "updateLookup" }).on("change", async (change) => {


            const new_latestChats = await ChatRoom.find({ userId, isUserSeen: false }).sort({ updatedAt: -1 }).limit(25).populate("propertyId brokerId")
            var new_isNext = await ChatRoom.find({ userId, isUserSeen: false })
                .sort({ updatedAt: -1 })
                .limit(26)
                .countDocuments();

            var new_isNextAvailable, new_lastId;
            if (new_isNext > 25) {
                // if next page is available
                new_isNextAvailable = true;
                new_lastId = new_latestChats[25 - 1]._id;
            } else {
                // if next is not available
                new_isNextAvailable = false;
                new_lastId = null;
            }

            var newMessage = {};
            newMessage.isNextAvailable = new_isNextAvailable;
            newMessage.lastId = new_lastId;
            newMessage.data = new_latestChats

            //for old messages

            const old_latestChats = await ChatRoom.find({ userId, isUserSeen: true }).sort({ updatedAt: -1 }).limit(25).populate("propertyId brokerId")
            var old_isNext = await ChatRoom.find({ userId, isUserSeen: true })
                .sort({ updatedAt: -1 })
                .limit(26)
                .countDocuments();

            var old_isNextAvailable, old_lastId;
            if (old_isNext > 25) {
                // if next page is available
                old_isNextAvailable = true;
                old_lastId = old_latestChats[25 - 1]._id;
            } else {
                // if next is not available
                old_isNextAvailable = false;
                old_lastId = null;
            }

            var oldMessage = {};
            oldMessage.isNextAvailable = old_isNextAvailable;
            oldMessage.lastId = old_lastId;
            oldMessage.data = old_latestChats


            socket.emit("chatrooms-updates", {
                oldMessage: oldMessage,
                newMessage: newMessage
            }, (res) => {
                console.log("Received from client - ")
                console.log({ res })
            })



        })


        // console.log(newMessage, oldMessage)
        callback({
            oldMessage: oldMessage,
            newMessage: newMessage
        })


    })

    socket.on("get-broker-chatrooms", async (data, callback) => {
        const brokerId = data.brokerId;
        console.log("getChatRoom called from brokerId - " + brokerId)

        const new_latestChats = await ChatRoom.find({ brokerId, isBrokerSeen: false }).sort({ updatedAt: -1 }).limit(25).populate("propertyId userId")
        var new_isNext = await ChatRoom.find({ brokerId, isBrokerSeen: false })
            .sort({ updatedAt: -1 })
            .limit(26)
            .countDocuments();

        var new_isNextAvailable, new_lastId;
        if (new_isNext > 25) {
            // if next page is available
            new_isNextAvailable = true;
            new_lastId = new_latestChats[25 - 1]._id;
        } else {
            // if next is not available
            new_isNextAvailable = false;
            new_lastId = null;
        }

        var newMessage = {};
        newMessage.isNextAvailable = new_isNextAvailable;
        newMessage.lastId = new_lastId;
        newMessage.data = new_latestChats

        //for old messages

        const old_latestChats = await ChatRoom.find({ brokerId, isBrokerSeen: true }).sort({ updatedAt: -1 }).limit(25).populate("propertyId userId")
        var old_isNext = await ChatRoom.find({ brokerId, isBrokerSeen: true })
            .sort({ updatedAt: -1 })
            .limit(26)
            .countDocuments();

        var old_isNextAvailable, old_lastId;
        if (old_isNext > 25) {
            // if next page is available
            old_isNextAvailable = true;
            old_lastId = old_latestChats[25 - 1]._id;
        } else {
            // if next is not available
            old_isNextAvailable = false;
            old_lastId = null;
        }

        var oldMessage = {};
        oldMessage.isNextAvailable = old_isNextAvailable;
        oldMessage.lastId = old_lastId;
        oldMessage.data = old_latestChats


        const pipeline = [
            {
                '$match': {
                    "fullDocument.brokerId": ObjectId(brokerId),
                    // "fullDocument.isUserSeen": data.type === "oldMessage" ? true : false
                }
            }
        ]


        ChatRoom.watch(pipeline, { "fullDocument": "updateLookup" }).on("change", async (change) => {


            const new_latestChats = await ChatRoom.find({ brokerId, isBrokerSeen: false }).sort({ updatedAt: -1 }).limit(25).populate("propertyId userId")
            var new_isNext = await ChatRoom.find({ brokerId, isBrokerSeen: false })
                .sort({ updatedAt: -1 })
                .limit(26)
                .countDocuments();

            var new_isNextAvailable, new_lastId;
            if (new_isNext > 25) {
                // if next page is available
                new_isNextAvailable = true;
                new_lastId = new_latestChats[25 - 1]._id;
            } else {
                // if next is not available
                new_isNextAvailable = false;
                new_lastId = null;
            }

            var newMessage = {};
            newMessage.isNextAvailable = new_isNextAvailable;
            newMessage.lastId = new_lastId;
            newMessage.data = new_latestChats

            //for old messages

            const old_latestChats = await ChatRoom.find({ brokerId, isBrokerSeen: true }).sort({ updatedAt: -1 }).limit(25).populate("propertyId userId")
            var old_isNext = await ChatRoom.find({ brokerId, isBrokerSeen: true })
                .sort({ updatedAt: -1 })
                .limit(26)
                .countDocuments();

            var old_isNextAvailable, old_lastId;
            if (old_isNext > 25) {
                // if next page is available
                old_isNextAvailable = true;
                old_lastId = old_latestChats[25 - 1]._id;
            } else {
                // if next is not available
                old_isNextAvailable = false;
                old_lastId = null;
            }

            var oldMessage = {};
            oldMessage.isNextAvailable = old_isNextAvailable;
            oldMessage.lastId = old_lastId;
            oldMessage.data = old_latestChats


            socket.emit("broker-chatrooms-updates", {
                oldMessage: oldMessage,
                newMessage: newMessage
            }, (res) => {
                console.log("Received from client - ")
                console.log({ res })
            })



        })


        // console.log(newMessage, oldMessage)
        callback({
            oldMessage: oldMessage,
            newMessage: newMessage
        })


    })



}

module.exports = {
    Chatrooms
}