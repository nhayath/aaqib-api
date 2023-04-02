const router = require("express").Router();
const PhoneController = require("../src/controllers/phone.controller");
const userAuth = require("../src/middleware/user.middleware");
const adminAuth = require("../src/middleware/admin.middleware");

// users routes
module.exports = router;

// get all phones
router.get("/", PhoneController.get);
router.get("/navSearch", PhoneController.navSearch);

// get a phone by id
router.get("/id/:id", adminAuth, PhoneController.getById);

// get all
router.get("/all", adminAuth, PhoneController.getAll);

// add a new phone
router.post("/", adminAuth, PhoneController.create);

// search
router.get("/search", PhoneController.search);

// update a phone
router.patch("/:id", adminAuth, PhoneController.update);

// delete a phone
router.delete("/delete/:id", adminAuth, PhoneController.deletePhone);
