const router = require("express").Router();
const PhoneController = require("../src/controllers/phone.controller");
const userAuth = require("../src/middleware/user.middleware");
const adminAuth = require("../src/middleware/admin.middleware");

// users routes
module.exports = router;

// get all phones
router.get("/", PhoneController.get);

// get a phone by id
router.get("/id/:id", PhoneController.getById);

// add a new phone
router.post("/", adminAuth, PhoneController.create);

// search
router.get("/search", PhoneController.search);

// update a phone
router.patch("/:id", adminAuth, PhoneController.update);
