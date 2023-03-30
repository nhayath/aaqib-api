const Offer = require("../models/offer.model");
const Phone = require("../models/phone.model");
const _ = require("../lib/helper");

module.exports = {
    async getById(req, res) {
        try {
            const id = req.params.id || null;
            let doc = await Offer.findById(id).lean();
            if (!doc._id) throw "Invalid Id";
            let phone = doc.phone;

            doc = _.pickExcept(doc, ["phone", "createdAt", "updatedAt", "__v"]);

            res.json({ doc, phone });
        } catch (error) {
            res.json({ error: error.message });
        }
    },

    async getPhoneOffers(req, res) {
        try {
            let phone = await Phone.findOne({
                slug: req.params.phone_slug,
            });
            let offers = await Offer.find({
                "phone.slug": req.params.phone_slug,
            }).exec();
            return res.json({
                phone,
                offers,
            });
        } catch (err) {
            res.status(400).json({ message: "error" });
        }
    },

    async getOffersByPhoneId(req, res) {
        try {
            let phone = await Phone.findById(req.params.id).lean();

            let offers = await Offer.find({
                "phone._id": req.params.id,
            })
                .lean()
                .exec();
            return res.json({
                phone: _.pickExcept(phone, ["createdAt", "updatedAt", "__v"]),
                offers: _.aPickExcept(offers, [
                    "phone",
                    "createdAt",
                    "updatedAt",
                    "__v",
                ]),
            });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    async create(req, res) {
        try {
            let data = req.body;
            if (data.phone_id) {
                let pd = await Phone.findById(data.phone_id);
                if (!pd || !pd._id) throw "Phone not found";
                data.phone = {
                    _id: pd._id,
                    name: pd.name,
                    brand: pd.brand,
                    os: pd.os,
                    slug: pd.slug,
                    image: pd.image,
                };
            }
            let newOffer = new Offer(req.body);
            var doc = await newOffer.save();
            res.status(201).json({
                message: "Created",
                doc,
            });
        } catch (error) {
            // console.log(error);
            res.status(400).json({ message: error.message });
        }
    },

    async createBulk(req, res) {
        try {
            let data = req.body;
            let ops = [];
            for (let d of data) {
                let pd = await Phone.findById(d.phone_id);
                d.phone = {
                    _id: pd._id,
                    name: pd.name,
                    brand: pd.brand,
                    os: pd.os,
                    slug: pd.slug,
                    image: pd.image,
                };

                ops.push(d);
            }

            // let result = ops;

            let result = await Offer.insertMany(ops);

            res.json({ result });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async update(req, res) {
        try {
            const id = req.params.id || null;
            if (!id) throw "Invalid Id";

            let data = req.body;

            // update doc
            var doc = await Offer.findByIdAndUpdate(
                id,
                { $set: data },
                { new: true }
            );

            res.status(200).json({
                message: "OK",
                doc,
            });
        } catch (err) {
            console.log(err);
            res.status(400).json({
                message: "Update Failed",
            });
        }
    },
    async test(req, res) {
        try {
            let phones = await Phone.find({ dealType: "Contract" }).exec();
            for (let phone of phones) {
                let image = phone.image;
                let offers = await Offer.updateMany(
                    { "phone._id": phone._id },
                    { $set: { "phone.image": image } }
                );
            }

            res.json({ message: "OK" });
        } catch (error) {
            res.json({ error });
        }
    },
};
