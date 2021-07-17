const multer = require("multer");
const path = require("path");
// init multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./LocalStorage");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "__" + Date.now() + path.extname(file.originalname)
        );
    },
});

var upload = multer({ storage: storage });

module.exports = { upload };