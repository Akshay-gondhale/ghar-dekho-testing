const mongoose = require("mongoose");
require("dotenv").config();
const connection = async () => {
  try {
    const con = await mongoose.connect(
        process.env.MONGO_URL,
        {
          useFindAndModify: false,
          useCreateIndex: true,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
    );
    console.log("MONGOOSE CONNECTED");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connection;