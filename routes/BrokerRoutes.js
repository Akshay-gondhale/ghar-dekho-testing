const express = require("express");
const { upload } = require("../utils/Multer");
const {
    brokerExists,
    register,
    login,
    resetPassword,
    getBroker,
    getPropertiesByStatus,
    getHomeById,
    setHomeInProgress,
    setHomeRejected,
    setHomeVerified
} = require("../controllers/BrokerController");
const router = express.Router();

// unprotected routes

router.get("/exists/:phone", brokerExists)
router.post("/register", register);
router.post("/login", login);
router.put("/resetPassword", resetPassword);


router.use(require("../middlewares/AuthBroker"));
//protected routes
router.get("/", getBroker);
router.get("/properties/:status", getPropertiesByStatus)
router.get("/home/:id", getHomeById)
router.put("/setHomeInProgress/:id", setHomeInProgress);
router.put("/setHomeVerified/:id", setHomeVerified);
router.put("/setHomeRejected/:id", setHomeRejected);

module.exports = router;