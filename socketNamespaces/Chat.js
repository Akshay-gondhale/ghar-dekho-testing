const ChatRoom = require("../models/ChatRoomsModel")
const Chat = require("../models/ChatModel")
const Property = require("../models/PropertyModel")
const fs = require("fs")
const path = require("path")

const { Storage } = require("@google-cloud/storage");
require("dotenv").config();


// console.log(path.join(__dirname , "../utils/SERVICE_KEY.json"))
// init google cloud storage
const GC_Storage = new Storage({
    keyFilename: path.join(__dirname, "../utils/SERVICE_KEY.json")
});

const bucket = GC_Storage.bucket("ghardekho-c3029.appspot.com");


const Chats = async (socket) => {

    console.log("someone joined chat namespace - " + socket.id)
    socket.on("user-join-room", async (data, callback) => {
        try {
            const foundProperty = await Property.findOne({ shortId: data.id })
            if (foundProperty) {
                const foundChatRoom = await ChatRoom.findOne({ propertyId: foundProperty._id, userId: data.userId }).populate("propertyId")

                if (foundChatRoom) {
                    foundChatRoom.isUserSeen = true;
                    await foundChatRoom.save();
                    socket.join(`${foundChatRoom._id}`)
                    const foundChatMessages = await Chat.find({ chatRoomId: foundChatRoom._id }).sort({ createdAt: -1 }).limit(25)
                    callback({
                        status: "ok",
                        message: "ChatRoom Details",
                        data: [foundChatRoom],
                        messages: foundChatMessages
                    })
                }
                else {
                    callback({
                        status: "ok",
                        message: "ChatRoom Details",
                        data: [
                            {
                                _id: null,
                                userId: data.userId,
                                propertyId: foundProperty,
                                brokerId: foundProperty.brokerId,
                                lastMsg: null,
                                messages: null
                            }
                        ],
                        messages: []
                    })
                }
            }
            else {
                callback({
                    status: "404",
                    message: "Property Not Found"
                })
            }
        }
        catch (e) {
            console.log(e)
            callback({
                status: "503",
                message: "Something went wrong..!"
            })
        }

    })

    socket.on("broker-join-room", async (data, callback) => {
        try {
            const foundChatRoom = await ChatRoom.findOne({ _id: data.id }).populate("propertyId userId")

            if (foundChatRoom) {
                foundChatRoom.isBrokerSeen = true;
                await foundChatRoom.save();
                socket.join(`${foundChatRoom._id}`)
                const foundChatMessages = await Chat.find({ chatRoomId: foundChatRoom._id }).sort({ createdAt: -1 }).limit(25)
                callback({
                    status: "ok",
                    message: "ChatRoom Details",
                    data: [foundChatRoom],
                    messages: foundChatMessages
                })
            }
            else {
                callback({
                    status: "ok",
                    message: "ChatRoom Details",
                    data: [
                        {
                            _id: null,
                            userId: null,
                            propertyId: null,
                            brokerId: null,
                            lastMsg: null,
                            messages: null
                        }
                    ]
                })
            }


        }
        catch (e) {
            console.log(e)
            callback({
                status: "503",
                message: "Something went wrong..!"
            })
        }

    })

    socket.on("user-init-room", async (data, callback) => {
        try {
            const { userId, propertyId, brokerId, message, msgType } = data;
            const createNewChatRoom = new ChatRoom({
                userId,
                propertyId,
                brokerId,
                isUserSeen: true,
                isBrokerSeen: false
            })
            const createChatMsg = new Chat({
                userId,
                chatRoomId: createNewChatRoom._id,
                brokerId,
                senderId: userId,
                msgType,
                message,
            })
            const insertChatMsg = await createChatMsg.save();
            createNewChatRoom.lastMsg = insertChatMsg
            const insertNewChatRoom = await createNewChatRoom.save();
            socket.join(`${insertNewChatRoom._id}`)

            socket.nsp.to(`${insertNewChatRoom._id}`).emit("newMessage", insertChatMsg)

            callback({
                status: "ok",
                message: "initiated new chat room",
                data: [insertNewChatRoom],
                messages: [insertChatMsg]
            })

        }
        catch (e) {
            console.log(e)
            callback({
                status: "503",
                message: "Something went wrong..!"
            })
        }
    })

    socket.on("user-newMsg", async (data, callback) => {
        const { userId, chatRoomId, brokerId, message, msgType } = data;

        console.log(chatRoomId)
        const foundChatRoom = await ChatRoom.findById(chatRoomId);
        console.log(foundChatRoom)

        const createChatMsg = new Chat({
            userId,
            chatRoomId,
            brokerId,
            senderId: userId,
            msgType,
            message,
        })
        const insertChatMsg = await createChatMsg.save();

        foundChatRoom.lastMsg = insertChatMsg;
        foundChatRoom.isBrokerSeen = false
        await foundChatRoom.save()

        socket.nsp.to(`${foundChatRoom._id}`).emit("newMessage", insertChatMsg)

        callback({
            status: "ok",
            message: "message inserted.!",
            messages: [insertChatMsg]
        })
    })
    socket.on("user-newMsg-file", async (data, callback) => {
        try {
            const { userId, chatRoomId, brokerId, message, msgType, blobData } = data;
            const fileExtArray = data.fileName.split(".")
            const fileExt = fileExtArray[fileExtArray.length - 1]
            console.log(fileExt)
            const fileName = "Chat__" + Date.now() + "." + fileExt;
            var imagePath = path.join(__dirname, "../LocalStorage/") + fileName;
            var destinationPath = "Chat/" + fileName;
            const uintData = new Uint8Array(blobData.buffer)
            fs.createWriteStream(imagePath).write(uintData, async () => {
                await bucket.upload(imagePath, { destination: destinationPath })
                await fs.unlinkSync(imagePath);
                console.log("file uploaded")
                const foundChatRoom = await ChatRoom.findById(chatRoomId);
                console.log(foundChatRoom)

                const createChatMsg = new Chat({
                    userId,
                    chatRoomId,
                    brokerId,
                    senderId: userId,
                    msgType,
                    message,
                    fileUrl: destinationPath

                })
                const insertChatMsg = await createChatMsg.save();
                
                foundChatRoom.lastMsg = insertChatMsg;
                foundChatRoom.isBrokerSeen = false

                await foundChatRoom.save()

                socket.nsp.to(`${foundChatRoom._id}`).emit("newMessage", insertChatMsg)

                callback({
                    status: "ok",
                    message: "message inserted.!",
                    messages: [insertChatMsg]
                })
            })

        }
        catch (e) {
            console.log(e)
            callback({
                status: "503",
                message: "Something went wrong"
            })

        }
    })

    socket.on("broker-newMsg", async (data, callback) => {
        const { userId, chatRoomId, brokerId, message, msgType } = data;

        const foundChatRoom = await ChatRoom.findById(chatRoomId);

        const createChatMsg = new Chat({
            userId,
            chatRoomId,
            brokerId,
            senderId: brokerId,
            msgType,
            message,
        })
        const insertChatMsg = await createChatMsg.save();
        
        foundChatRoom.lastMsg = insertChatMsg;
        foundChatRoom.isUserSeen = false

        await foundChatRoom.save()
        socket.nsp.to(`${foundChatRoom._id}`).emit("newMessage", insertChatMsg)

        callback({
            status: "ok",
            message: "message inserted.!",
            messages: [insertChatMsg]
        })
    })

    socket.on("user-seen", async (data, callback) => {
        try {
            const foundChatRoom = await ChatRoom.findOne({ _id: data.id });
            if (foundChatRoom) {
                foundChatRoom.isUserSeen = true;
                await foundChatRoom.save()
                callback({
                    status: "ok",
                    message: "set user seen true"
                })
            }
            else {
                callback({
                    status: "404",
                    message: "No ChatRoom Found with given id..!"
                })

            }
        }
        catch (e) {
            console.log(e)
            callback({
                status: "503",
                message: "Something went wrong..!"
            })
        }

    })

    socket.on("broker-seen", async (data, callback) => {
        try {
            const foundChatRoom = await ChatRoom.findOne({ _id: data.id });
            if (foundChatRoom) {
                foundChatRoom.isBrokerSeen = true;
                await foundChatRoom.save()
                callback({
                    status: "ok",
                    message: "set broker seen true"
                })
            }
            else {
                callback({
                    status: "404",
                    message: "No ChatRoom Found with given id..!"
                })

            }
        }
        catch (e) {
            console.log(e)
            callback({
                status: "503",
                message: "Something went wrong..!"
            })
        }

    })



}

module.exports = {
    Chats
}