const express = require("express");
const { upload } = require("../utils/Multer");
const {
    register, 
    userExists,
    login,
    resetPassword,
    getUser,
    updateProfile,
    postProperty,
    getUserPropertiesByStatus,
    getNotifications,
    getHomeById,
    setHomeUnAvailable
} = require("../controllers/UserController");
const router = express.Router();

// unprotected routes

router.get("/exists/:phone", userExists)
router.post("/register", register);
router.post("/login", login);
router.put("/resetPassword", resetPassword);

router.use(require("../middlewares/AuthUser"));

router.get("/", getUser);
router.post("/postProperty",upload.fields([{ name: "images" , maxCount: 10}]), postProperty)
router.put("/update", upload.fields([{ name: "profile", maxCount: 1 }]), updateProfile)
router.get("/properties/:status", getUserPropertiesByStatus)
router.get("/notifications", getNotifications);
router.get("/home/:id", getHomeById)
router.put("/setHomeUnavailable/:id", setHomeUnAvailable);

module.exports = router;