const router = require("express").Router();
const OptionController = require("../src/controllers/option.controller");
const adminAuth = require("../src/middleware/admin.middleware");

// users routes
module.exports = router;

// option routes
router.get("/id/:id", OptionController.getById);
router.get("/s/:name", OptionController.get);
router.get("/m/:name", OptionController.getAll);
router.post("/add", adminAuth, OptionController.create);
router.patch("/update/:id", adminAuth, OptionController.update);
router.delete("/delete/:id", adminAuth, OptionController.delete);
