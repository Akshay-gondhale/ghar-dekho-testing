const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;

const cookieParser = require("cookie-parser")
app.use(cookieParser());

require("dotenv").config();


const db = require("./config/db");
db();


var cors = require('cors');
app.use(cors({credentials:true}))
//middlewares
app.use(express.static("public"));
app.use(express.json()); // JSON Body Parser

// routes
app.get("/", (req, res) => res.send("Hey, API is working!!"));
app.use("/user", require("./routes/UserRoutes"));

app.listen(PORT, () => console.log("APP is running"));