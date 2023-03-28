const router = require("express").Router();
const UserController = require("../src/controllers/user.controller");

// users routes
module.exports = router;

// auth routes
router.post("/create", UserController.create);
router.post("/login", UserController.login);
