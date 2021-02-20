const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  created_at: {
    type: String,
    default: new Date(),
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
    required: true,
  },
});

//generating token
userSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign({ _id: this._id }, process.env.TOKEN_KEY);
    // this.tokens = this.tokens.concat({token:token});
    this.token = token;
    console.log(token);
    await this.save();
    return token;
  } catch (e) {}
};

//password hashing
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 7);
  }
  next();
});

const user = new mongoose.model("user", userSchema);

module.exports = user;
