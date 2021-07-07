const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            // unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            max: 10,
            min: 10,
        },
        image: {
            type: String,
            default: null
            // required: true,
        }
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (this.isNew) {
        this.password = await bcrypt.hash(this.password.toString(), 10);
    }
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
const userModel = mongoose.model("User", userSchema);
module.exports = userModel;