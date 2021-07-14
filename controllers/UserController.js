const User = require("../models/UserModel");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

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
                        image:savedUser.image,
                        token,
                        expires:new Date(new Date().setHours(2160)),
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
                        image:userExists.image,
                        token,
                        expires:new Date(new Date().setHours(2160)),
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

const getUser = async (req, res)=>{
    try{

        const _id = req.user;
        const userDetails = await User.findOne({_id}).select("-password");
        
        res.status(200).json({
            message:"Found User Details",
            data:[userDetails]
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

module.exports = {
    userExists,
    register,
    login,
    resetPassword,
    getUser
}