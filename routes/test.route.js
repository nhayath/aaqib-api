const router = require("express").Router();
const TestController = require("../src/controllers/test.controller");
const adminAuth = require("../src/middleware/admin.middleware");

// users routes
module.exports = router;

// auth routes
router.get("/", TestController.test);
