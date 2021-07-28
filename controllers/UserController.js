const User = require("../models/UserModel");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const path = require("path");
const { uploadFile, deleteFile } = require("../utils/RemoteFileUpload");
const Property = require("../models/PropertyModel");
const Notification = require("../models/NotificationModel")
const { nanoid } = require('nanoid');

// const pipeline = [
//     {
//         '$match':{
//             "fullDocument.name":"Akshay"
//         }
//     }
// ]

// User.watch(pipeline,{"fullDocument": "updateLookup"}).on("change", (change)=>{
//     console.log("something changed in user")
//     console.log(change)
// })

const userExists = async (req, res) => {
    try {
        const { phone } = req.params;
        const userExists = await User.findOne({ phone });
        if (userExists) {
            res.status(200).json({ message: "User exists", data: [] });
        }
        else {
            res.status(401).json({ message: "User does not exists", data: [] });
        }
    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Something went wrong",
            data: []
        })

    }

}

const register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const userExists = await User.findOne({ phone });
        if (userExists) {
            console.log(userExists)
            res.status(403).json({ message: "User already exists", data: [] });
            return;
        }
        const user = new User({
            name,
            email,
            password,
            phone
        });

        const savedUser = await user.save();

        if (savedUser) {
            const token = jwt.sign(
                {
                    _id: savedUser._id,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "2160h",
                }
            );

            res.status(200).json({
                message: "Registration successfull",
                data: [
                    {
                        _id: savedUser._id,
                        name: savedUser.name,
                        email: savedUser.email,
                        phone: savedUser.phone,
                        image: savedUser.image,
                        token,
                        createdAt: savedUser.createdAt,
                        expires: new Date(new Date().setHours(2160)),
                    },
                ],
            });
        }
    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Something went wrong",
            data: []
        })

    }
}

const login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const userExists = await User.findOne({ phone });
        if (!userExists) {
            res.status(403).json({
                message: "No user account found with this number! Please register first."
            })
        }
        if (userExists && (await userExists.matchPassword(password))) {
            const token = jwt.sign(
                {
                    _id: userExists._id
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "2160h",
                }
            );


            res.status(200).json({
                message: "Success",
                data: [
                    {
                        _id: userExists._id,
                        name: userExists.name,
                        email: userExists.email,
                        phone: userExists.phone,
                        image: userExists.image,
                        token,
                        createdAt: userExists.createdAt,
                        expires: new Date(new Date().setHours(2160)),
                    },
                ],
            });
        } else {
            res.status(401).json({
                message: "Invalid phone or password",
                data: [],
            });
        }
    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Something went wrong",
            data: []
        })

    }

}

const resetPassword = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const userExists = await User.findOne({ phone });
        if (!userExists) {
            res.status(401).json({
                message: "User does not exists",
                data: []
            })
            return;
        }
        userExists.password = await bcrypt.hash(password, 10)
        const savedUser = await userExists.save();
        res.status(200).json({
            message: "Password reset successfully",
            data: [savedUser]
        })
    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Something went wrong",
            data: []
        })

    }
}

const getUser = async (req, res) => {
    try {

        const _id = req.user;
        const userDetails = await User.findOne({ _id }).select("-password");

        res.status(200).json({
            message: "Found User Details",
            data: [userDetails]
        })
    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Something went wrong",
            data: []
        })

    }
}

const updateProfile = async (req, res) => {
    try {
        const { _id } = req.user;
        const { name, email } = req.body;
        const foundUser = await User.findOne({ _id });
        if (foundUser) {

            if (name) {
                foundUser.name = name;
            }
            if (email) {
                foundUser.email = email;
            }
            if (req.files.profile) {
                if (foundUser.image != null) {
                    deleteFile(foundUser.image)
                }
                var FilePath = path.join(
                    __dirname,
                    `../LocalStorage/${req.files.profile[0].filename}`
                );
                var Destination = `User_Profile/${req.files.profile[0].filename}`
                await uploadFile(FilePath, Destination, req.files.profile[0].filename)
                foundUser.image = Destination;

            }

            const updateUser = await foundUser.save();
            res.status(200).json({
                message: "Profile Updated",
                data: [updateUser]
            })


        }
        else {
            res.status(404).json({
                message: "No User Found",
                data: []
            })
        }

    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Something went wrong",
            data: []
        })

    }
}

const postProperty = async (req, res) => {
    console.log("property api hitted")
    try {
        console.log()
        const { _id } = req.user;
        console.log("got user id")
        const {
            ownerName,
            ownerEmail,
            ownerPhone,
            houseNumber,
            locality,
            area,
            city,
            landmark,
            homeType,
            parking,
            floor,
            totalFloor,
            carpetArea,
            age,
            isVeg,
            sellOrRent,
            ammount,
            description,
            title,
            brokerId
        } = req.body;

        console.log("got user body")
        if (typeof (req.files.images) == "undefined") {
            res.status(403).json({
                message: "Please upload images!.",
                data: []
            })
            return;
        }

        const createProperty = new Property({
            userId: _id,
            ownerName,
            ownerEmail,
            ownerPhone,
            houseNumber,
            locality,
            area,
            city,
            landmark,
            homeType,
            parking,
            floor,
            totalFloor,
            carpetArea,
            age,
            isVeg,
            sellOrRent,
            ammount,
            description,
            title,
            brokerId,
            shortId:nanoid(12),
            status: "registered"
        })
        console.log("created property")
        var images = [];
        for (let i = 0; i < req.files.images.length; i++) {
            const element = req.files.images[i];

            var FilePath = path.join(__dirname, `../LocalStorage/${element.filename}`);
            var DestinationFilePath = `Home_images/${element.filename}`;
            uploadFile(FilePath, DestinationFilePath, element.filename);
            images.push({ path: DestinationFilePath });
        }
        console.log("image uploaded property")
        createProperty.images = images;
        const insertProperty = await createProperty.save();
        console.log("property saved")
        res.status(200).json({
            message: "Property registered",
            data: [insertProperty]
        })
    }
    catch (e) {
        console.log(e)
        for (let i = 0; i < req.files.images.length; i++) {
            console.log("deleting files")
            const element = req.files.images[i];

            // var FilePath = path.join(__dirname, `../LocalStorage/${element.filename}`);
            var DestinationFilePath = `Home_images/${element.filename}`;
            // uploadFile(FilePath, DestinationFilePath, element.filename);
            deleteFile(DestinationFilePath)
        }
        res.status(500).json({
            message: "Something Went Wrong!",
            data: []
        })

    }
}

const getUserPropertiesByStatus = async (req, res) => {
    try {
        const { _id } = req.user;
        const { status } = req.params;
        var { id, recordsPerPage } = req.query;
        // console.log({ id, recordsPerPage })

        if (typeof recordsPerPage == "undefined") {
            // if no recordsPerPage is not passed in request then records will set to default value 5
            recordsPerPage = 5;
        }

        var query = {userId:_id, status};
        if (id) {
            query._id = { $lt: id };
        }

        console.log(query)
        var foundProperties = await Property.find(query)
            .sort({ _id: -1 })
            .limit(parseInt(recordsPerPage));
        var isNext = await Property.find(query)
            .sort({ _id: -1 })
            .limit(parseInt(recordsPerPage) + 1)
            .countDocuments();

            var isNextAvailable;
        if (isNext > parseInt(recordsPerPage)) {
            // if next page is available
            isNextAvailable = true;
            lastId = foundProperties[parseInt(recordsPerPage) - 1]._id;
        } else {
            // if next is not available
            isNextAvailable = false;
            lastId = null;
        }
        res.status(200).json({
            message: "Found Properties",
            data: [
                {
                    lastId,
                    isNextAvailable,
                    foundProperties,
                },
            ],
        });
    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Something Went Wrong!",
            data: []
        })
    }
}

const getNotifications = async (req, res) => {
try {
        const { _id } = req.user;
        var { id, recordsPerPage } = req.query;
        // console.log({ id, recordsPerPage })

        if (typeof recordsPerPage == "undefined") {
            // if no recordsPerPage is not passed in request then records will set to default value 5
            recordsPerPage = 5;
        }

        var query = {userId:_id};
        if (id) {
            query._id = { $lt: id };
        }

        console.log(query)
        var foundNotifications = await Notification.find(query)
            .sort({ _id: -1 })
            .limit(parseInt(recordsPerPage));
        var isNext = await Notification.find(query)
            .sort({ _id: -1 })
            .limit(parseInt(recordsPerPage) + 1)
            .countDocuments();

            var isNextAvailable;
        if (isNext > parseInt(recordsPerPage)) {
            // if next page is available
            isNextAvailable = true;
            lastId = foundNotifications[parseInt(recordsPerPage) - 1]._id;
        } else {
            // if next is not available
            isNextAvailable = false;
            lastId = null;
        }
        res.status(200).json({
            message: "Found Properties",
            data: [
                {
                    lastId,
                    isNextAvailable,
                    data:foundNotifications,
                },
            ],
        });
    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Something Went Wrong!",
            data: []
        })
    }
}

module.exports = {
    userExists,
    register,
    login,
    resetPassword,
    getUser,
    updateProfile,
    postProperty,
    getUserPropertiesByStatus,
    getNotifications
}