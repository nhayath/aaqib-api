const router = require("express").Router();
const OfferController = require("../src/controllers/offer.controller");
const adminAuth = require("../src/middleware/admin.middleware");

// users routes
module.exports = router;

router.get("/all", adminAuth, OfferController.getAll);
router.get("/findOffers", OfferController.findOffers);
router.get("/id/:id", OfferController.getById);
// router.patch("/:id", OfferController.update);
router.get("/phone/id/:id", adminAuth, OfferController.getOffersByPhoneId);
router.get("/phone/:phone_slug", OfferController.getPhoneOffers);
router.post("/add", adminAuth, OfferController.create);
router.post("/addBulk", adminAuth, OfferController.createBulk);
router.patch("/update/:id", adminAuth, OfferController.update);
router.delete("/delete/:id", adminAuth, OfferController.delete);
