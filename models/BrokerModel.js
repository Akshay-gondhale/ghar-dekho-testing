const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const brokerSchema = mongoose.Schema(
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
        is_verified: {
            type: Boolean,
            default: false
            // required: true,
        }
    },
    {
        timestamps: true,
    }
);

brokerSchema.pre("save", async function (next) {
    if (this.isNew) {
        this.password = await bcrypt.hash(this.password.toString(), 10);
    }
    next();
});

brokerSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
const brokerModel = mongoose.model("Broker", brokerSchema);
module.exports = brokerModel;