const express = require("express");


const {
    register, 
    userExists,
    login,
    resetPassword,
    getUser
} = require("../controllers/UserController");
const router = express.Router();


// unprotected routes

router.get("/exists/:phone", userExists)
router.post("/register", register);
router.post("/login", login);
router.put("/resetPassword", resetPassword);

router.use(require("../middlewares/AuthUser"));

router.get("/", getUser);

module.exports = router;