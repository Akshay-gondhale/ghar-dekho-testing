const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;

const cookieParser = require("cookie-parser")
app.use(cookieParser());

var cors = require('cors');
app.use(cors())
require("dotenv").config();


const db = require("./config/db");
const { Chatrooms } = require("./socketNamespaces/Chatrooms");
const { Chats } = require("./socketNamespaces/Chat");
db();



//middlewares
app.use(express.static("public"));
app.use(express.json()); // JSON Body Parser

// routes
app.get("/", (req, res) => res.send("Hey, API is working!!"));
app.use("/user", require("./routes/UserRoutes"));
app.use("/broker", require("./routes/BrokerRoutes"));

const server = app.listen(PORT, () => console.log("APP is running"));
const io = require("socket.io")(server, {
    cors: {
        origin: '*',
    }
});

io.of("/chat-rooms").on("connection", Chatrooms)
io.of("/chat").on("connection", Chats)