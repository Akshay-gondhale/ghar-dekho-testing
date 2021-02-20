const mongoose = require("mongoose");
require('dotenv').config()
mongoose.connect(process.env.DB_CONN, {
    useCreateIndex: true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:true
}).then(() =>{
    console.log("connection to db successfull!")
}).catch((e)=>{
    console.log("db not connect due to = " + e)
})