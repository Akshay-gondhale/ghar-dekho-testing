const express = require("express");
const { upload } = require("../utils/Multer");
const {
    register, 
    userExists,
    login,
    resetPassword,
    getUser,
    updateProfile
} = require("../controllers/UserController");
const router = express.Router();

// unprotected routes

router.get("/exists/:phone", userExists)
router.post("/register", register);
router.post("/login", login);
router.put("/resetPassword", resetPassword);

router.use(require("../middlewares/AuthUser"));

router.get("/", getUser);
router.put("/update", upload.fields([{ name: "profile", maxCount: 1 }]), updateProfile)

module.exports = router;