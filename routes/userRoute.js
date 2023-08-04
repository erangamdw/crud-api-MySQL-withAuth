const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

// post (save) [body]
router.post("/register", userController.register); /*saveCustomer()*/
//get(fetch) [headers]
router.post("/login", userController.login);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);

module.exports = router;
