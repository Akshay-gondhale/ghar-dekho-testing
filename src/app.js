const express = require("express");
require("../src/db/conn");
const path = require("path");
const hbs = require("hbs");
const user = require("../src/models/users");
const home = require("../src/models/homes");
const homeInterest = require("../src/models/homeInterest");
const message = require("../src/models/message");
const bodyparser = require("body-parser");
const bcrypt = require("bcrypt");
const { mongo } = require("mongoose");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

require('dotenv').config()
const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cookieParser())
app.set('json spaces', '  ');
app.use(bodyparser.urlencoded({ extended: true }));

const template_path = path.join(__dirname, "/templates/views");
const static_path = path.join(__dirname, "../public");
app.use(express.static(static_path));
app.set("view engine", "ejs");
app.set("views", template_path);



// init multer 
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/TempUploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "__" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({ storage: storage });


app.get("/", async (req, res) => {
  try {
    const getHome = await home.find({}).sort({ _id: -1 }).limit(10);
    const userToken = req.cookies.jwt;
    const verifyUser = jwt.verify(userToken, process.env.TOKEN_KEY);
    console.log(verifyUser._id);
    const userDetails = await user.findOne({ _id: verifyUser._id })
    res.render("index", { getHome, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone });

  } catch (e) {
    const getHome = await home.find({}).sort({ _id: -1 }).limit(10);
    res.render("index", { getHome });
  }
});

app.get("/properties", async (req, res) => {

  try {

    const userToken = req.cookies.jwt;
    const verifyUser = jwt.verify(userToken, process.env.TOKEN_KEY);
    console.log(verifyUser._id);
    const userDetails = await user.findOne({ _id: verifyUser._id })


    var page = req.query.page;
    var filter = req.query.filter;

    var sellOrRent = req.query.sellOrRent;
    var homeType = req.query.homeType;
    var maxAmmount = req.query.maxAmmount;
    var carpetArea = req.query.carpetArea;
    var age = req.query.age;
    var floor = req.query.floor;
    var isVeg = req.query.isVeg;
    var isNext = true;


    if (typeof page == "undefined") {
      page = 1;
    }

    if (typeof filter == "undefined") {
      filter = 0;
    }

    if (filter == 0) {

      console.log(page)
      var skip_value = (page - 1) * 10;
      console.log(skip_value);
      const getHome = await home.find({}).sort({ _id: -1 }).limit(10).skip(skip_value);

      const nextValue = await home.find({}).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();

      if (nextValue != 11) {
        isNext = false;
      }
      if (typeof filter == "undefined") {
        filter = 0;
      }
      res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone });

    }
    else if (filter == 1) {


      console.log(page)
      var skip_value = (page - 1) * 10;
      console.log(skip_value);
      if (sellOrRent != "null" && homeType != "null") {
        console.log("im in sellOrRent And Hometype not null")
        if (isVeg == "no") {
          if (maxAmmount == "" && carpetArea == "" && age == "" && floor == "") {
            console.log("im in 1")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { homeType }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea == "" && age == "" && floor == "") {
            console.log("im in 2")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea != "" && age == "" && floor == "") {
            console.log("im in 3")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea != "" && age != "" && floor == "") {
            console.log("im in 4")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea != "" && age != "" && floor != "") {
            console.log("im in 5")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea != "" && age != "" && floor != "") {
            console.log("im in 6")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea == "" && age != "" && floor != "") {
            console.log("im in 7")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { age: { $lt: age } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { age: { $lt: age } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea == "" && age == "" && floor != "") {
            console.log("im in 8")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { floor: { $lt: floor } }]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea != "" && age == "" && floor == "") {
            console.log("im in 9")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { carpetArea: { $gt: carpetArea } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { carpetArea: { $gt: carpetArea } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea == "" && age != "" && floor != "") {
            console.log("im in 10")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }, { age: { $lt: age } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }, { age: { $lt: age } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea == "" && age != "" && floor == "") {
            console.log("im in 11")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { age: { $lt: age } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { age: { $lt: age } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea == "" && age != "" && floor == "") {
            console.log("im in 12")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }, { age: { $lt: age } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }, { age: { $lt: age } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea != "" && age == "" && floor != "") {
            console.log("im in 13")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea != "" && age == "" && floor != "") {
            console.log("im in 14")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { carpetArea: { $gt: carpetArea } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { carpetArea: { $gt: carpetArea } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea == "" && age == "" && floor != "") {
            console.log("im in 15")
            console.log(floor)
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea != "" && age != "" && floor == "") {
            console.log("im in 16")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }

          else {
            const getHome = await home.find({}).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({}).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });
          }
        }
        else if (isVeg == "yes") {
          if (maxAmmount == "" && carpetArea == "" && age == "" && floor == "") {
            console.log("im in 1")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea == "" && age == "" && floor == "") {
            console.log("im in 2")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea != "" && age == "" && floor == "") {
            console.log("im in 3")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea != "" && age != "" && floor == "") {
            console.log("im in 4")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea != "" && age != "" && floor != "") {
            console.log("im in 5")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea != "" && age != "" && floor != "") {
            console.log("im in 6")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea == "" && age != "" && floor != "") {
            console.log("im in 7")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { age: { $lt: age } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { age: { $lt: age } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea == "" && age == "" && floor != "") {
            console.log("im in 8")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea != "" && age == "" && floor == "") {
            console.log("im in 9")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { carpetArea: { $gt: carpetArea } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { carpetArea: { $gt: carpetArea } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea == "" && age != "" && floor != "") {
            console.log("im in 10")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }, { age: { $lt: age } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }, { age: { $lt: age } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea == "" && age != "" && floor == "") {
            console.log("im in 11")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { age: { $lt: age } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { age: { $lt: age } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea == "" && age != "" && floor == "") {
            console.log("im in 12")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }, { age: { $lt: age } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }, { age: { $lt: age } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea != "" && age == "" && floor != "") {
            console.log("im in 13")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea != "" && age == "" && floor != "") {
            console.log("im in 14")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { carpetArea: { $gt: carpetArea } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { carpetArea: { $gt: carpetArea } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea == "" && age == "" && floor != "") {
            console.log("im in 15")
            console.log(floor)
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea != "" && age != "" && floor == "") {
            console.log("im in 16")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }

          else {
            const getHome = await home.find({}).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({}).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });
          }
        }
      }
      else if (sellOrRent != "null" && homeType == "null") {
        if (isVeg == "no") {
          if (maxAmmount == "" && carpetArea == "" && age == "" && floor == "") {
            console.log("im in 1")
            const getHome = await home.find({
              $and: [
                { sellOrRent }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea == "" && age == "" && floor == "") {
            console.log("im in 2")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { ammount: { $lt: maxAmmount } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { ammount: { $lt: maxAmmount } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea != "" && age == "" && floor == "") {
            console.log("im in 3")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea != "" && age != "" && floor == "") {
            console.log("im in 4")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea != "" && age != "" && floor != "") {
            console.log("im in 5")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea != "" && age != "" && floor != "") {
            console.log("im in 6")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea == "" && age != "" && floor != "") {
            console.log("im in 7")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { age: { $lt: age } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { age: { $lt: age } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea == "" && age == "" && floor != "") {
            console.log("im in 8")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { floor: { $lt: floor } }]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea != "" && age == "" && floor == "") {
            console.log("im in 9")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { carpetArea: { $gt: carpetArea } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { carpetArea: { $gt: carpetArea } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea == "" && age != "" && floor != "") {
            console.log("im in 10")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { ammount: { $lt: maxAmmount } }, { age: { $lt: age } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { ammount: { $lt: maxAmmount } }, { age: { $lt: age } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea == "" && age != "" && floor == "") {
            console.log("im in 11")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { age: { $lt: age } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { age: { $lt: age } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea == "" && age != "" && floor == "") {
            console.log("im in 12")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { ammount: { $lt: maxAmmount } }, { age: { $lt: age } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { ammount: { $lt: maxAmmount } }, { age: { $lt: age } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea != "" && age == "" && floor != "") {
            console.log("im in 13")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea != "" && age == "" && floor != "") {
            console.log("im in 14")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { carpetArea: { $gt: carpetArea } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { carpetArea: { $gt: carpetArea } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea == "" && age == "" && floor != "") {
            console.log("im in 15")
            console.log(floor)
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { ammount: { $lt: maxAmmount } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { ammount: { $lt: maxAmmount } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea != "" && age != "" && floor == "") {
            console.log("im in 16")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }

          else {
            const getHome = await home.find({}).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({}).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });
          }
        }
        else if (isVeg == "yes") {
          if (maxAmmount == "" && carpetArea == "" && age == "" && floor == "") {
            console.log("im in 1")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea == "" && age == "" && floor == "") {
            console.log("im in 2")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { ammount: { $lt: maxAmmount } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { ammount: { $lt: maxAmmount } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea != "" && age == "" && floor == "") {
            console.log("im in 3")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea != "" && age != "" && floor == "") {
            console.log("im in 4")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea != "" && age != "" && floor != "") {
            console.log("im in 5")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea != "" && age != "" && floor != "") {
            console.log("im in 6")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea == "" && age != "" && floor != "") {
            console.log("im in 7")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { age: { $lt: age } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { age: { $lt: age } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea == "" && age == "" && floor != "") {
            console.log("im in 8")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea != "" && age == "" && floor == "") {
            console.log("im in 9")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { carpetArea: { $gt: carpetArea } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { carpetArea: { $gt: carpetArea } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea == "" && age != "" && floor != "") {
            console.log("im in 10")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { ammount: { $lt: maxAmmount } }, { age: { $lt: age } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { ammount: { $lt: maxAmmount } }, { age: { $lt: age } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea == "" && age != "" && floor == "") {
            console.log("im in 11")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { age: { $lt: age } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { age: { $lt: age } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea == "" && age != "" && floor == "") {
            console.log("im in 12")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { ammount: { $lt: maxAmmount } }, { age: { $lt: age } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { ammount: { $lt: maxAmmount } }, { age: { $lt: age } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea != "" && age == "" && floor != "") {
            console.log("im in 13")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea != "" && age == "" && floor != "") {
            console.log("im in 14")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { carpetArea: { $gt: carpetArea } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { carpetArea: { $gt: carpetArea } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea == "" && age == "" && floor != "") {
            console.log("im in 15")
            console.log(floor)
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { ammount: { $lt: maxAmmount } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { ammount: { $lt: maxAmmount } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea != "" && age != "" && floor == "") {
            console.log("im in 16")
            const getHome = await home.find({
              $and: [
                { sellOrRent }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }

          else {
            const getHome = await home.find({}).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({}).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });
          }
        }
      }
      else if (sellOrRent == "null" && homeType != "null") {
        if (isVeg == "no") {
          if (maxAmmount == "" && carpetArea == "" && age == "" && floor == "") {
            console.log("im in 1")
            const getHome = await home.find({
              $and: [
                { homeType }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { homeType }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea == "" && age == "" && floor == "") {
            console.log("im in 2")
            const getHome = await home.find({
              $and: [
                { homeType }, { ammount: { $lt: maxAmmount } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { homeType }, { ammount: { $lt: maxAmmount } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea != "" && age == "" && floor == "") {
            console.log("im in 3")
            const getHome = await home.find({
              $and: [
                { homeType }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { homeType }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea != "" && age != "" && floor == "") {
            console.log("im in 4")
            const getHome = await home.find({
              $and: [
                { homeType }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { homeType }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea != "" && age != "" && floor != "") {
            console.log("im in 5")
            const getHome = await home.find({
              $and: [
                { homeType }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { homeType }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea != "" && age != "" && floor != "") {
            console.log("im in 6")
            const getHome = await home.find({
              $and: [
                { homeType }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { homeType }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea == "" && age != "" && floor != "") {
            console.log("im in 7")
            const getHome = await home.find({
              $and: [
                { homeType }, { age: { $lt: age } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { homeType }, { age: { $lt: age } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea == "" && age == "" && floor != "") {
            console.log("im in 8")
            const getHome = await home.find({
              $and: [
                { homeType }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { homeType }, { floor: { $lt: floor } }]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea != "" && age == "" && floor == "") {
            console.log("im in 9")
            const getHome = await home.find({
              $and: [
                { homeType }, { carpetArea: { $gt: carpetArea } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { homeType }, { carpetArea: { $gt: carpetArea } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea == "" && age != "" && floor != "") {
            console.log("im in 10")
            const getHome = await home.find({
              $and: [
                { homeType }, { ammount: { $lt: maxAmmount } }, { age: { $lt: age } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { homeType }, { ammount: { $lt: maxAmmount } }, { age: { $lt: age } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea == "" && age != "" && floor == "") {
            console.log("im in 11")
            const getHome = await home.find({
              $and: [
                { homeType }, { age: { $lt: age } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { homeType }, { age: { $lt: age } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea == "" && age != "" && floor == "") {
            console.log("im in 12")
            const getHome = await home.find({
              $and: [
                { homeType }, { ammount: { $lt: maxAmmount } }, { age: { $lt: age } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { homeType }, { ammount: { $lt: maxAmmount } }, { age: { $lt: age } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea != "" && age == "" && floor != "") {
            console.log("im in 13")
            const getHome = await home.find({
              $and: [
                { homeType }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { homeType }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea != "" && age == "" && floor != "") {
            console.log("im in 14")
            const getHome = await home.find({
              $and: [
                { homeType }, { carpetArea: { $gt: carpetArea } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { homeType }, { carpetArea: { $gt: carpetArea } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea == "" && age == "" && floor != "") {
            console.log("im in 15")
            console.log(floor)
            const getHome = await home.find({
              $and: [
                { homeType }, { ammount: { $lt: maxAmmount } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { homeType }, { ammount: { $lt: maxAmmount } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea != "" && age != "" && floor == "") {
            console.log("im in 16")
            const getHome = await home.find({
              $and: [
                { homeType }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { homeType }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }

          else {
            const getHome = await home.find({}).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({}).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });
          }
        }
        else if (isVeg == "yes") {
          if (maxAmmount == "" && carpetArea == "" && age == "" && floor == "") {
            console.log("im in 1")
            const getHome = await home.find({
              $and: [
                { homeType }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { homeType }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea == "" && age == "" && floor == "") {
            console.log("im in 2")
            const getHome = await home.find({
              $and: [
                { homeType }, { ammount: { $lt: maxAmmount } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { homeType }, { ammount: { $lt: maxAmmount } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea != "" && age == "" && floor == "") {
            console.log("im in 3")
            const getHome = await home.find({
              $and: [
                { homeType }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { homeType }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea != "" && age != "" && floor == "") {
            console.log("im in 4")
            const getHome = await home.find({
              $and: [
                { homeType }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { homeType }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea != "" && age != "" && floor != "") {
            console.log("im in 5")
            const getHome = await home.find({
              $and: [
                { homeType }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { homeType }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea != "" && age != "" && floor != "") {
            console.log("im in 6")
            const getHome = await home.find({
              $and: [
                { homeType }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { homeType }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea == "" && age != "" && floor != "") {
            console.log("im in 7")
            const getHome = await home.find({
              $and: [
                { homeType }, { age: { $lt: age } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { homeType }, { age: { $lt: age } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea == "" && age == "" && floor != "") {
            console.log("im in 8")
            const getHome = await home.find({
              $and: [
                { homeType }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { homeType }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea != "" && age == "" && floor == "") {
            console.log("im in 9")
            const getHome = await home.find({
              $and: [
                { homeType }, { carpetArea: { $gt: carpetArea } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { homeType }, { carpetArea: { $gt: carpetArea } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea == "" && age != "" && floor != "") {
            console.log("im in 10")
            const getHome = await home.find({
              $and: [
                { homeType }, { ammount: { $lt: maxAmmount } }, { age: { $lt: age } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { homeType }, { ammount: { $lt: maxAmmount } }, { age: { $lt: age } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea == "" && age != "" && floor == "") {
            console.log("im in 11")
            const getHome = await home.find({
              $and: [
                { homeType }, { age: { $lt: age } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { homeType }, { age: { $lt: age } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea == "" && age != "" && floor == "") {
            console.log("im in 12")
            const getHome = await home.find({
              $and: [
                { homeType }, { ammount: { $lt: maxAmmount } }, { age: { $lt: age } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { homeType }, { ammount: { $lt: maxAmmount } }, { age: { $lt: age } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea != "" && age == "" && floor != "") {
            console.log("im in 13")
            const getHome = await home.find({
              $and: [
                { homeType }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { homeType }, { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea != "" && age == "" && floor != "") {
            console.log("im in 14")
            const getHome = await home.find({
              $and: [
                { homeType }, { carpetArea: { $gt: carpetArea } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { homeType }, { carpetArea: { $gt: carpetArea } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea == "" && age == "" && floor != "") {
            console.log("im in 15")
            console.log(floor)
            const getHome = await home.find({
              $and: [
                { homeType }, { ammount: { $lt: maxAmmount } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { homeType }, { ammount: { $lt: maxAmmount } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea != "" && age != "" && floor == "") {
            console.log("im in 16")
            const getHome = await home.find({
              $and: [
                { homeType }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { homeType }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }

          else {
            const getHome = await home.find({}).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({}).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });
          }
        }
      }
      else if (sellOrRent == "null" && homeType == "null") {
        if (isVeg == "no") {
          if (maxAmmount == "" && carpetArea == "" && age == "" && floor == "") {
            console.log("im in 1")
            const getHome = await home.find({

            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea == "" && age == "" && floor == "") {
            console.log("im in 2 maxAmmount not null")
            const getHome = await home.find({
              $and: [
                { ammount: { $lte: maxAmmount } }, {vegetarian:"no"}
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { ammount: { $lte: maxAmmount } }, { ammount: { $lte: maxAmmount } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea != "" && age == "" && floor == "") {
            console.log("im in 3")
            const getHome = await home.find({
              $and: [
                { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea != "" && age != "" && floor == "") {
            console.log("im in 4")
            const getHome = await home.find({
              $and: [
                { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea != "" && age != "" && floor != "") {
            console.log("im in 5")
            const getHome = await home.find({
              $and: [
                { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea != "" && age != "" && floor != "") {
            console.log("im in 6")
            const getHome = await home.find({
              $and: [
                { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea == "" && age != "" && floor != "") {
            console.log("im in 7")
            const getHome = await home.find({
              $and: [
                { age: { $lt: age } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { age: { $lt: age } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea == "" && age == "" && floor != "") {
            console.log("im in 8")
            const getHome = await home.find({
              $and: [
                { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { floor: { $lt: floor } }]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea != "" && age == "" && floor == "") {
            console.log("im in 9")
            const getHome = await home.find({
              $and: [
                { carpetArea: { $gt: carpetArea } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { carpetArea: { $gt: carpetArea } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea == "" && age != "" && floor != "") {
            console.log("im in 10")
            const getHome = await home.find({
              $and: [
                { ammount: { $lt: maxAmmount } }, { age: { $lt: age } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { ammount: { $lt: maxAmmount } }, { age: { $lt: age } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea == "" && age != "" && floor == "") {
            console.log("im in 11")
            const getHome = await home.find({
              $and: [
                { age: { $lt: age } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { age: { $lt: age } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea == "" && age != "" && floor == "") {
            console.log("im in 12")
            const getHome = await home.find({
              $and: [
                { ammount: { $lt: maxAmmount } }, { age: { $lt: age } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { ammount: { $lt: maxAmmount } }, { age: { $lt: age } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea != "" && age == "" && floor != "") {
            console.log("im in 13")
            const getHome = await home.find({
              $and: [
                { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea != "" && age == "" && floor != "") {
            console.log("im in 14")
            const getHome = await home.find({
              $and: [
                { carpetArea: { $gt: carpetArea } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { carpetArea: { $gt: carpetArea } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea == "" && age == "" && floor != "") {
            console.log("im in 15")
            console.log(floor)
            const getHome = await home.find({
              $and: [
                { ammount: { $lt: maxAmmount } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { ammount: { $lt: maxAmmount } }, { floor: { $lt: floor } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea != "" && age != "" && floor == "") {
            console.log("im in 16")
            const getHome = await home.find({
              $and: [
                { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { sellOrRent }, { homeType }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }

          else {
            const getHome = await home.find({}).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({}).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });
          }
        }
        else if (isVeg == "yes") {
          if (maxAmmount == "" && carpetArea == "" && age == "" && floor == "") {
            console.log("im in 1")
            const getHome = await home.find({
              $and: [
                { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea == "" && age == "" && floor == "") {
            console.log("im in 2")
            const getHome = await home.find({
              $and: [
                { ammount: { $lt: maxAmmount } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { ammount: { $lt: maxAmmount } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea != "" && age == "" && floor == "") {
            console.log("im in 3")
            const getHome = await home.find({
              $and: [
                { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea != "" && age != "" && floor == "") {
            console.log("im in 4")
            const getHome = await home.find({
              $and: [
                { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea != "" && age != "" && floor != "") {
            console.log("im in 5")
            const getHome = await home.find({
              $and: [
                { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea != "" && age != "" && floor != "") {
            console.log("im in 6")
            const getHome = await home.find({
              $and: [
                { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea == "" && age != "" && floor != "") {
            console.log("im in 7")
            const getHome = await home.find({
              $and: [
                { age: { $lt: age } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { age: { $lt: age } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea == "" && age == "" && floor != "") {
            console.log("im in 8")
            const getHome = await home.find({
              $and: [
                { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea != "" && age == "" && floor == "") {
            console.log("im in 9")
            const getHome = await home.find({
              $and: [
                { carpetArea: { $gt: carpetArea } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { carpetArea: { $gt: carpetArea } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea == "" && age != "" && floor != "") {
            console.log("im in 10")
            const getHome = await home.find({
              $and: [
                { ammount: { $lt: maxAmmount } }, { age: { $lt: age } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { ammount: { $lt: maxAmmount } }, { age: { $lt: age } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea == "" && age != "" && floor == "") {
            console.log("im in 11")
            const getHome = await home.find({
              $and: [
                { age: { $lt: age } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { age: { $lt: age } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea == "" && age != "" && floor == "") {
            console.log("im in 12")
            const getHome = await home.find({
              $and: [
                { ammount: { $lt: maxAmmount } }, { age: { $lt: age } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { ammount: { $lt: maxAmmount } }, { age: { $lt: age } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea != "" && age == "" && floor != "") {
            console.log("im in 13")
            const getHome = await home.find({
              $and: [
                { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { ammount: { $lt: maxAmmount } }, { carpetArea: { $gt: carpetArea } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea != "" && age == "" && floor != "") {
            console.log("im in 14")
            const getHome = await home.find({
              $and: [
                { carpetArea: { $gt: carpetArea } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { carpetArea: { $gt: carpetArea } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount != "" && carpetArea == "" && age == "" && floor != "") {
            console.log("im in 15")
            console.log(floor)
            const getHome = await home.find({
              $and: [
                { ammount: { $lt: maxAmmount } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { ammount: { $lt: maxAmmount } }, { floor: { $lt: floor } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }
          else if (maxAmmount == "" && carpetArea != "" && age != "" && floor == "") {
            console.log("im in 16")
            const getHome = await home.find({
              $and: [
                { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({
              $and: [
                { carpetArea: { $gt: carpetArea } }, { age: { $lt: age } }, { vegetarian: "yes" }
              ]
            }).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });

          }

          else {
            const getHome = await home.find({}).sort({ _id: -1 }).limit(10).skip(skip_value);

            const nextValue = await home.find({}).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
            if (nextValue != 11) {
              isNext = false;
            }
            if (typeof filter == "undefined") {
              filter = 0;
            }

            res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });
          }
        }
      }
      else {
        console.log("debugging")
        const getHome = await home.find({}).sort({ _id: -1 }).limit(10).skip(skip_value);

        const nextValue = await home.find({}).sort({ _id: -1 }).limit(11).skip(skip_value).countDocuments();
        if (nextValue != 11) {
          isNext = false;
        }
        if (typeof filter == "undefined") {
          filter = 0;
        }

        res.render("properties", { getHome, isNext, page, filter, user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, sellOrRent, homeType, maxAmmount, carpetArea, age, floor, isVeg });
      }

    }
    else {
      res.send("internal error")
    }
  }
  catch (e) {
    res.render("login", { err: "Please Login First!" });
  }
})

app.get("/signup", (req, res) => {
  res.render("signup");

});
app.post("/signup", async function (req, res) {
  var { fname, email, mnumb, pass, cpass } = req.body;
  var err;
  var phoneno = /^\d{10}$/;
  var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  var phoneLength = mnumb.length;
  if (!fname || !email || !mnumb || !pass || !cpass) {
    err = "Please fill full details";
    res.render("signup", { err: err });
  } else if (!email.match(mailformat)) {
    err = "Please enter Email Id properly";
    res.render("signup", {
      err: err,
      email: email,
      fname: fname,
      mnumb: mnumb,
    });
  } else if (!mnumb.match(phoneno) || phoneLength > 10 || phoneLength < 10) {
    err = "Please enter phone number properly";
    res.render("signup", {
      err: err,
      email: email,
      fname: fname,
      mnumb: mnumb,
    });
  } else if (pass != cpass) {
    err = "Password and Confirm Password not Matched. Please try again.";
    res.render("signup", {
      err: err,
      email: email,
      fname: fname,
      mnumb: mnumb,
    });
  } else {
    try {
      const addingUser = new user({
        name: req.body.fname,
        email: req.body.email,
        phone: req.body.mnumb,
        password: req.body.pass,
      });

      const token = await addingUser.generateAuthToken();

      const insertUser = await addingUser.save();
      // res.render("verifyOTP", { mobile_no: mnumb, verifyMsg: "Please Verify Mobile Number" });
      res.redirect(`/verifyOtp?mob_no=${mnumb}`);
    } catch (e) {
      if (e.code == 11000) {
        err = "This mobile number is already registered with another account";
        res.render("signup", {
          err: err,
          email: email,
          fname: fname,
          mnumb: mnumb,
        });
      } else {
        console.log(e);
        res.status(400).send(e);
      }
    }
  }
});
app.get("/login", (req, res) => {
    res.render("login");
  
});

app.post("/login", async (req, res) => {
  var err;
  var phoneno = /^\d{10}$/;
  var mob_no = req.body.username;
  var password = req.body.password;
  if (!mob_no || !password) {
    err = "Please enter mobile number and password";
    res.render("login", {
      err: err
    });
  }
  else if (!mob_no.match(phoneno)) {
    err = "Please enter mobile number properly";
    res.render("login", {
      err: err,
      username: mob_no,
    });
  } else {
    try {
      const foundUser = await user.findOne({ phone: mob_no });
      const passwordMatch = await bcrypt.compare(password, foundUser.password);
      if (passwordMatch) {
        if (foundUser.isVerified != true) {
          console.log("user not verified")
          // err = "Your account is not verified yet. Please contact support."
          // res.render("verifyOtp", { mobile_no: mob_no, verifyMsg: "Your Mobile number is not verified yet. Please Verify Mobile Number." });
          res.redirect(`/verifyOtp?mob_no=${mob_no}`);
        }
        else {
          const token = await foundUser.token;
          console.log(token);
          res.cookie("jwt", token, {
            expires: new Date(Date.now() + 31556952000),
            httpOnly: true
          })
          // err = "Logged in Successfully!";
          // res.render("login", { err: err });
          res.redirect("/");
        }
      } else {
        err = "Wrong Password! Please Try Again.";
        res.render("login", { err: err, username: mob_no });
      }
    } catch (e) {
      err = "Entered Mobile number is not registered. Please registered first!";
      res.render("login", { err: err });
      console.log(e)
    }
  }
});

app.get("/logout", async (req, res)=>{
  try{
    const userToken = req.cookies.jwt;
    const verifyUser = jwt.verify(userToken, process.env.TOKEN_KEY);
    console.log(verifyUser._id);
    const userDetails = await user.findOne({ _id: verifyUser._id })
    res.render("logout", { user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone });

  }
  catch(e){
    res.redirect("/login")
  }
})

app.post("/logout", (req, res)=>{
  try{
    res.clearCookie("jwt")
    res.redirect("/")
  }catch(e){
    res.status(500).send("error! cant logout")
  }

})

app.post("/verifyOtp", async (req, res) => {
  try {
    const updateUser = await user.updateOne({ phone: req.body.mobileNo }, { $set: { isVerified: true } })
    // err = "Phone Number verified successfully. Please login now.";
    // var errType = "";
    // var errHead = "";
    // res.render("login", { err: err, errType: "success", errHead: "Verified!" });
    res.redirect("/login")
  } catch (e) {
    console.log(e);
    res.send(e)
  }
})


app.get("/verifyOtp", async (req, res) => {
  try{
    console.log("im in verify otp")
    var phoneNo = req.query.mob_no;
    console.log(phoneNo)
      res.render("verifyOtp", {phoneNo})

    
  }catch(e){
    res.status(400).send("Got Error")
    console.log(e)
  }
})

app.post("/users", async (req, res) => {
  try {
    const addingUser = new user(req.body);
    console.log(req.body);
    const insertUser = await addingUser.save();
    res.send(insertUser);
  } catch (e) {
    if (e.code == 11000) {
      res.status(400).send("user already present");
      console.log("user already present");
    } else {
      console.log(e);
      res.status(400).send(e);
    }
  }
});

app.get("/users", async (req, res) => {
  try {
    const getUsers = await user.find({}).sort({ _id: -1 });
    res.status(201).send(getUsers);
  } catch (e) {
    res.send(e);
  }
});

app.get("/messages", async (req, res) => {
  try {
    const getMessage = await message.find({}).sort({ _id: -1 });
    res.status(201).send(getMessage);
  } catch (e) {
    res.send(e);
  }
});

app.get("/receivedHomeInterests", async (req, res) => {
  try {
    const getHomeInterest = await homeInterest.find({}).sort({ _id: -1 });
    res.status(201).send(getHomeInterest);
  } catch (e) {
    res.send(e);
  }
});

app.get("/PostProperty", async (req, res) => {
  try {
    const userToken = req.cookies.jwt;
    const verifyUser = jwt.verify(userToken, process.env.TOKEN_KEY);
    console.log(verifyUser._id);
    const userDetails = await user.findOne({ _id: verifyUser._id })
    res.render("PostProperty", { user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, userEmail: userDetails.email });

  } catch (e) {
    res.render("login", { err: "Please Login First!" });
  }
})

app.post("/PostProperty", upload.fields([{ name: "firstImage", maxCount: 1 }, { name: "secondImage", maxCount: 1 }, { name: "thirdImage", maxCount: 1 }, { name: "fourthImage", maxCount: 1 }]), async (req, res) => {



  var { uploaderName, uploaderEmail, uploaderPhone, sameAsAbove, ownerName, ownerEmail, ownerPhone, add_houseNumber, add_bldgAreaName, add_areaName, add_city, add_landmark, homeType, parking, floor, totalFloor, carpetArea, age, vegetarian, firstImage, secondImage, thirdImage, fourthImage, sellOrRent, ammount } = req.body;



  const userToken = req.cookies.jwt;
  const verifyUser = jwt.verify(userToken, process.env.TOKEN_KEY);
  console.log(verifyUser._id);
  const userDetails = await user.findOne({ _id: verifyUser._id })





  try {
    console.log(req.files.firstImage[0].filename);
    console.log(req.files.secondImage[0].filename);
    console.log(req.files.thirdImage[0].filename);
    console.log(req.files.fourthImage[0].filename);


    const uploadsFolder = path.join(__dirname, "../public/TempUploads/");
    var image1 = uploadsFolder + req.files.firstImage[0].filename;
    var image2 = uploadsFolder + req.files.secondImage[0].filename;
    var image3 = uploadsFolder + req.files.thirdImage[0].filename;
    var image4 = uploadsFolder + req.files.fourthImage[0].filename;

    var image1_name = req.files.firstImage[0].filename;
    var image2_name = req.files.secondImage[0].filename;
    var image3_name = req.files.thirdImage[0].filename;
    var image4_name = req.files.fourthImage[0].filename;

    sharp(image1)
      .resize({ width: 500 })
      .rotate()
      .toFile('public/uploads/' + req.files.firstImage[0].filename, (err, info) => {
        if (!err) {
          console.log(image1);
          fs.unlinkSync(image1);
        }
        else {
          console.log(err)
        }
      });
    sharp(image2)
      .resize({ width: 500 })
      .rotate()
      .toFile('public/uploads/' + req.files.secondImage[0].filename, (err, info) => {
        if (!err) {
          console.log(image2);
          fs.unlinkSync(image2);
        }
        else {
          console.log(err)
        }
      });
    sharp(image3)
      .resize({ width: 500 })
      .rotate()
      .toFile('public/uploads/' + req.files.thirdImage[0].filename, (err, info) => {
        if (!err) {
          console.log(image3);
          fs.unlinkSync(image3);
        }
        else {
          console.log(err)
        }
      });
    sharp(image4)
      .resize({ width: 500 })
      .rotate()
      .toFile('public/uploads/' + req.files.fourthImage[0].filename, (err, info) => {
        if (!err) {
          console.log(image4);
          fs.unlinkSync(image4);
        }
        else {
          console.log(err)
        }
      });

    const addingHome = new home({
      uploaderName,
      uploaderEmail,
      uploaderPhone,
      sameAsAbove,
      ownerName,
      ownerEmail,
      ownerPhone,
      add_houseNumber,
      add_bldgAreaName,
      add_areaName,
      add_city,
      add_landmark,
      homeType,
      parking,
      floor,
      totalFloor,
      carpetArea,
      age,
      vegetarian,
      firstImage: image1_name,
      secondImage: image2_name,
      thirdImage: image3_name,
      fourthImage: image4_name,
      sellOrRent,
      ammount
    });


    const insertHome = await addingHome.save();



    res.status(200).render("PostProperty", { userName: uploaderName, userPhone: uploaderPhone, userEmail: uploaderEmail, isDone: "done", head: "Home Registered!", message: "Your home registered successfully on our website. We will soon contact you. Thank You! ", type: "success" })
  }
  catch (e) {
    console.log(e)
    res.status(200).render("PostProperty", { userName: uploaderName, userPhone: uploaderPhone, userEmail: uploaderEmail, isDone: "done", head: "Cant Register Home!", message: "Due to some internel error we cant upload home details to server. Pleaase try again later. ", type: "error" })
  }

})


app.get("/homes", async (req, res) => {
  try {
    const countHome = await home.find({}).countDocuments({});
    const getHome = await home.find({}).sort({ _id: -1 });
    res.status(201).send(getHome);
    console.log(countHome)
  }
  catch (e) {
    res.status(400).send(e);
    console.log(e);
  }
})
app.get("/ContactUS", async (req, res) => {
  try {
    const userToken = req.cookies.jwt;
    const verifyUser = jwt.verify(userToken, process.env.TOKEN_KEY);
    console.log(verifyUser._id);
    const userDetails = await user.findOne({ _id: verifyUser._id })
    res.render("ContactUs", { user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone });

  }
  catch (e) {
    res.render("ContactUs")
  }
})

app.post("/ContactUs", async (req, res) => {
  try {
    var phone = req.body.phone;
    var phoneno = /^\d{10}$/;
    if (!phone.match(phoneno)) {
      const userToken = req.cookies.jwt;
      const verifyUser = jwt.verify(userToken, process.env.TOKEN_KEY);
      console.log(verifyUser._id);
      const userDetails = await user.findOne({ _id: verifyUser._id })
      res.render("ContactUs", { user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, success: "false" })

    }
    else {
      const userToken = req.cookies.jwt;
      const verifyUser = jwt.verify(userToken, process.env.TOKEN_KEY);
      console.log(verifyUser._id);
      const userDetails = await user.findOne({ _id: verifyUser._id })
      const addingMessage = new message({
        name: req.body.name,
        phone: req.body.phone,
        message: req.body.message
      });

      const insertMessage = await addingMessage.save();
      res.render("ContactUs", { user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, success: "true" })

    }

  }
  catch (e) {
    res.send(e);
    console.log(e)
  }
})
app.get("/home", async (req, res) =>{
  try{
    const userToken = req.cookies.jwt;
    const verifyUser = jwt.verify(userToken, process.env.TOKEN_KEY);
    console.log(verifyUser._id);
    const userDetails = await user.findOne({ _id: verifyUser._id })

    var id = req.query.h_id;
    const getHome = await home.find({_id : id}).limit(1);
    console.log(getHome.length)
    if( getHome.length == 1 ){
      res.render("home", { user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, userEmail: userDetails.email, foundHome:true, getHome });
    }else{
      res.render("home", { user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, userEmail: userDetails.email, foundHome:false });
    }

    

  }catch(e){
    res.render("login", {err:"Please Login First"})
  }
})



app.get("/homeInterest", async (req, res)=>{
  

  const home_id = req.query.home_id;
  const owner = req.query.owner;
  const sellOrRent = req.query.sellOrRent;
  const ammount = req.query.ammount;
  const firstImage = req.query.firstImage;
  const secondImage = req.query.secondImage;
  const thirdImage = req.query.thirdImage;
  const fourthImage = req.query.fourthImage;
  const homeType = req.query.homeType;
  const add_areaName = req.query.add_areaName;
  const add_city = req.query.add_city;
  const add_landmark = req.query.add_landmark;
  const carpetArea = req.query.carpetArea;
  const parking = req.query.parking;
  const floor = req.query.floor;
  const totalFloor = req.query.totalFloor;
  const age = req.query.age;
  const vegetarian = req.query.vegetarian;
  const user_id = req.query.user_id;
  const userName = req.query.userName;
  const userPhone = req.query.userPhone;

  try{
    const userToken = req.cookies.jwt;
    const verifyUser = jwt.verify(userToken, process.env.TOKEN_KEY);
    console.log(verifyUser._id);
    const userDetails = await user.findOne({ _id: verifyUser._id })
    // console.log(areaName);
    const addingHomeInterest = new homeInterest({
      home_id,
      owner,
      sellOrRent,
      ammount,
      firstImage,
      secondImage,
      thirdImage,
      fourthImage,
      homeType,
      add_areaName,
      add_city,
      add_landmark,
      carpetArea,
      parking,
      floor,
      totalFloor,
      age,
      vegetarian,
      user_id,
      userName,
      userPhone
    });

    const insertHomeInterest = await addingHomeInterest.save();
    res.render("home", { user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone, userEmail: userDetails.email, interestSubmitted:true });

  }catch(e){
    res.send("Internal Error")
    console.log(e)
  }
})

app.get("/pageNotFound", async (req, res)=>{
  try{
    const userToken = req.cookies.jwt;
    const verifyUser = jwt.verify(userToken, process.env.TOKEN_KEY);
    console.log(verifyUser._id);
    const userDetails = await user.findOne({ _id: verifyUser._id })
    res.render("404", { user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone });

  }
  catch(e){
    res.render("404")
  }

})

app.get("/aboutUs", async (req, res)=>{
  try{
    const userToken = req.cookies.jwt;
    const verifyUser = jwt.verify(userToken, process.env.TOKEN_KEY);
    console.log(verifyUser._id);
    const userDetails = await user.findOne({ _id: verifyUser._id })
    res.render("aboutUs", {user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone });


  }
  catch(e){
    res.render("aboutUs")
  }
})

app.get("*", async (req, res)=>{
  try{
    const userToken = req.cookies.jwt;
    const verifyUser = jwt.verify(userToken, process.env.TOKEN_KEY);
    console.log(verifyUser._id);
    const userDetails = await user.findOne({ _id: verifyUser._id })
    res.render("404", { user: userDetails._id, userName: userDetails.name, userPhone: userDetails.phone });

  }
  catch(e){
    res.render("404")
  }

})

app.listen(port, () => {
  console.log("server is running on " + port);
});
