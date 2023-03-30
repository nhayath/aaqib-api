const router = require("express").Router();
const UserController = require("../src/controllers/user.controller");
const adminAuth = require("../src/middleware/admin.middleware");

// users routes
module.exports = router;

// auth routes
router.get("/", adminAuth, UserController.get);
router.get("/id/:id", adminAuth, UserController.findOne);
router.get("/email/:email", adminAuth, UserController.findOne);
router.post("/create", adminAuth, UserController.create);
router.post("/login", UserController.login);
