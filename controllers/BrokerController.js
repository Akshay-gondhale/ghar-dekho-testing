const Broker = require("../models/BrokerModel");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const Property = require("../models/PropertyModel");
const Notification = require("../models/NotificationModel");
// const path = require("path");
// const { uploadFile, deleteFile } = require("../utils/RemoteFileUpload");

const brokerExists = async (req, res) => {
    try {
        const { phone } = req.params;
        const brokerExists = await Broker.findOne({ phone });
        if (brokerExists) {
            res.status(200).json({ message: "Broker exists", data: [] });
        }
        else {
            res.status(401).json({ message: "Broker does not exists", data: [] });
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
        const brokerExists = await Broker.findOne({ phone });
        if (brokerExists) {
            console.log(brokerExists)
            res.status(403).json({ message: "Broker already exists", data: [] });
            return;
        }
        const broker = new Broker({
            name,
            email,
            password,
            phone
        });

        const savedBroker = await broker.save();

        if (savedBroker) {
            const token = jwt.sign(
                {
                    _id: savedBroker._id,
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
                        _id: savedBroker._id,
                        name: savedBroker.name,
                        email: savedBroker.email,
                        phone: savedBroker.phone,
                        image: savedBroker.image,
                        token,
                        createdAt: savedBroker.createdAt,
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
        const brokerExists = await Broker.findOne({ phone });
        if (!brokerExists) {
            res.status(403).json({
                message: "No broker account found with this number! Please register first."
            })
            return;
        }
        if(brokerExists.is_verified === false){
            res.status(403).json({
                message: "Your account is not verified yet. Please wait till admin verifies you account!"
            })
            return;
        }
        if (brokerExists && (await brokerExists.matchPassword(password))) {
            const token = jwt.sign(
                {
                    _id: brokerExists._id
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
                        _id: brokerExists._id,
                        name: brokerExists.name,
                        email: brokerExists.email,
                        phone: brokerExists.phone,
                        image: brokerExists.image,
                        token,
                        createdAt: brokerExists.createdAt,
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
        const brokerExists = await Broker.findOne({ phone });
        if (!brokerExists) {
            res.status(401).json({
                message: "Broker does not exists",
                data: []
            })
            return;
        }
        
        if(brokerExists.is_verified === false){
            res.status(403).json({
                message: "Your account is not verified yet. Please wait till admin verifies you account!"
            })
            return;
        }
        brokerExists.password = await bcrypt.hash(password, 10)
        const savedBroker = await brokerExists.save();
        res.status(200).json({
            message: "Password reset successfully",
            data: [savedBroker]
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

const getBroker = async (req, res) => {
    try {

        const _id = req.broker;
        const brokerDetails = await Broker.findOne({ _id, is_verified:true }).select("-password");

        res.status(200).json({
            message: "Found Broker Details",
            data: [brokerDetails]
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
const getPropertiesByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const {_id} = req.broker;
        var { id, recordsPerPage } = req.query;
        // console.log({ id, recordsPerPage })

        if (typeof recordsPerPage == "undefined") {
            // if no recordsPerPage is not passed in request then records will set to default value 5
            recordsPerPage = 5;
        }

        var query = {status};
        if(status === "in-progress"){
            query.status = status;
            query.brokerId = _id;
        }
        else if(status === "verified"){
            query.status = status;
            query.brokerId = _id;
        }
        else if(status === "rejected"){
            query.status = status;
            query.brokerId = _id;

        }
        else{
            query.status = status;
            query.brokerId = null;
        }
        if (id) {
            query._id = { $lt: id };
        }

        var foundProperties = await Property.find(query)
            .sort({ _id: -1 })
            .limit(parseInt(recordsPerPage));
        var isNext = await Property.find(query)
            .sort({ _id: -1 })
            .limit(parseInt(recordsPerPage) + 1)
            .countDocuments();

            var isNextAvailable;
        if (isNext > recordsPerPage) {
            // if next page is available
            isNextAvailable = true;
            lastId = foundProperties[recordsPerPage - 1]._id;
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


const getHomeById = async (req,res) => {
    try{
        const {id} = req.params;
        const foundProperty = await  Property.findOne({shortId:id}).populate("userId", "name email phone image");
        if(foundProperty){
            res.status(200).json({
                message:"Found Property Details",
                data:[foundProperty]
            })
        }
        else{
            res.status(404).json({
                message:"No property found",
                data:[]
            })
        }
    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Something Went Wrong!",
            data: []
        })
    }
}

const setHomeInProgress = async (req,res) => {
    try{
        const {id} = req.params;
        const {_id} = req.broker;
        const foundHome = await Property.findOne({shortId:id})
        if(!(foundHome.status === "register") && !(foundHome.brokerId === null)){
            res.status(403).json({
                message:"This home is already assigned to different home. Choose different one!",
                data:[]
            })
            return;
        }
        if(!foundHome){
            res.status(404).json({
                message:"No Home Found",
                data:[]
            })
            return;
        }

        foundHome.status = "in-progress";
        foundHome.brokerId = _id;

        const updatedHome = await foundHome.save();

        const notification = new Notification({
            title:"Home Status Updated!",
            description:`Your home with title ${foundHome.title}'s status is updated to In Progress by an broker.`,
            userId:foundHome.userId
        })
        const savedNotification = await notification.save();

        res.status(200).json({
            message:"Status set to In Progress!",
            data:[updatedHome]
        })


    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Something Went Wrong!",
            data: []
        })
    }
}

const setHomeVerified = async (req, res) => {
    try{
        const {id} = req.params;
        const foundHome = await Property.findOne({shortId:id})
        
        if(!foundHome){
            res.status(404).json({
                message:"No Home Found",
                data:[]
            })
            return;
        }

        foundHome.status = "verified";

        const updatedHome = await foundHome.save();

        const notification = new Notification({
            title:"Home Verified!",
            description:`Your home with title ${foundHome.title}'s status is updated to verified by an broker. Now your home is visible to all on website.`,
            userId:foundHome.userId
        })
        const savedNotification = await notification.save();

        res.status(200).json({
            message:"Status set to Verified!",
            data:[updatedHome]
        })


    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Something Went Wrong!",
            data: []
        })
    }
}

const setHomeRejected = async (req, res) => {
    try{
        const {id} = req.params;
        const {_id} = req.broker;
        const {rejectedReason} = req.body;
        const foundHome = await Property.findOne({shortId:id, brokerId:_id})
        if(!foundHome){
            res.status(404).json({
                message:"No Home Found",
                data:[]
            })
            return;
        }
        if(!rejectedReason){
            res.status(403).json({
                message:"Please provide rejection reason!",
                data:[]
            })
            return;
        }
        foundHome.status = "rejected";
        foundHome.rejectedReason = rejectedReason;

        const updatedHome = await foundHome.save();

        const notification = new Notification({
            title:"Home Details Rejected!",
            description:`Your home with title ${foundHome.title}'s details are rejected by broker. This is the reason of rejecting: "${rejectedReason}"`,
            userId:foundHome.userId
        })
        const savedNotification = await notification.save();

        res.status(200).json({
            message:"Status set to Rejected!",
            data:[updatedHome]
        })



    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Something Went Wrong!",
            data: []
        })
    }
}

const setHomeUnAvailable = async (req, res) =>{
    try{
        const {id} = req.params;
        const foundProperty = await Property.findOne({shortId:id});
        if(!foundProperty){
            res.status(403).json({
                message:"No home found!",
                data:[]
            })
            return;
        }
        foundProperty.isAvailable = false;
        const updatedProperty = await foundProperty.save()
        const notification = new Notification({
            title:"Home Details Set Unavailable!",
            description:`Your home with title ${foundProperty.title}'s details are set to unavailable to other users by broker.`,
            userId:foundProperty.userId
        })
        const savedNotification = await notification.save();
        res.status(200).json({
            message:"Property set to unavailable!",
            data:[updatedProperty]
        })
    }
    catch(e){
        console.log(e)
        res.status(500).json({
            message:"Something went wrong!",
            data:[]
        })

    }
}
const setHomeAvailable = async (req, res) =>{
    try{
        const {id} = req.params;
        const foundProperty = await Property.findOne({shortId:id});
        if(!foundProperty){
            res.status(403).json({
                message:"No home found!",
                data:[]
            })
            return;
        }
        foundProperty.isAvailable = true;
        const updatedProperty = await foundProperty.save()
        const notification = new Notification({
            title:"Home Details Set Available!",
            description:`Your home with title ${foundProperty.title}'s details are set to available to other users by broker.`,
            userId:foundProperty.userId
        })
        const savedNotification = await notification.save();
        res.status(200).json({
            message:"Property set to available!",
            data:[updatedProperty]
        })
    }
    catch(e){
        console.log(e)
        res.status(500).json({
            message:"Something went wrong!",
            data:[]
        })

    }
}

module.exports = {
    brokerExists,
    register,
    login,
    resetPassword,
    getBroker,
    getPropertiesByStatus,
    getHomeById,
    setHomeInProgress,
    setHomeVerified,
    setHomeRejected,
    setHomeUnAvailable,
    setHomeAvailable
}