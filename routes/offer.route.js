const router = require("express").Router();
const OfferController = require("../src/controllers/offer.controller");
const adminAuth = require("../src/middleware/admin.middleware");

// users routes
module.exports = router;

router.patch("/:offer_id", OfferController.update);
router.get("/phone/:phone_slug", OfferController.getPhoneOffers);
router.post("/add", adminAuth, OfferController.create);
router.post("/addBulk", adminAuth, OfferController.createBulk);
router.patch("/update/:id", adminAuth, OfferController.update);
router.get("/test", OfferController.test);
