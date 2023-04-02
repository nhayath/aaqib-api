const Offer = require("../models/offer.model");
const Phone = require("../models/phone.model");
const _ = require("../lib/helper");
const { parse } = require("path");

module.exports = {
    async getAll(req, res) {
        try {
            var limit = 100;
            let page = req.query.page ? parseInt(req.query.page) : 1;
            var cond = {};
            if (req.query.phone_id) {
                cond["phone._id"] = req.query.phone_id;
            }
            // console.log(req.body);
            if (req.query.dealType) {
                cond["dealType"] = req.query.dealType;
            }

            if (req.query.network) {
                cond["network"] = req.query.network;
            }
            if (req.query.brand) {
                cond["phone.brand"] = req.query.brand;
            }

            let aj = req.query.aj || false;

            var docs = await Offer.find(cond)
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip((page - 1) * limit)
                .exec();

            // total
            var total = await Offer.find(cond).count().exec();
            let totalPages = Math.ceil(total / limit);

            let filters = {};

            if (!aj) {
                // get phones
                if (req.query.dealType !== "simonly") {
                    let phones = await Phone.find({}, { name: 1 })
                        .sort({ name: 1 })
                        .exec();
                    filters.phones = phones;
                }

                // networks
                let networks = await getOptions("network");

                filters.networks = networks;
            }
            res.json({
                total: total,
                limit,
                totalPages,
                curPage: page,
                docs: docs,
                filters,
            });
        } catch (err) {
            // console.log(err);
            res.status(400).json({
                message: err.message,
            });
        }
    },

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
            if (!data.dealType !== "simonly" && data.phone_id) {
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

    async delete(req, res) {
        try {
            const id = req.params.id || null;
            if (!id) throw new Error("Invalid Id");

            let status = await Offer.deleteOne({ _id: id }).exec();

            res.status(200).json({
                message: "OK",
                status,
            });
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: 1, message: error.message });
        }
    },

    async findOffers(req, res) {
        try {
            let limit = 16;
            req.query.limit = 16;
            let result = await search(req);

            let docs = result.docs || [];
            let filters = {};
            let total = 0;
            let page = req.query.page || 1;

            if (result.meta && result.meta[0]) {
                let meta = result.meta[0];
                total = meta.count.lowerBound;
                if (meta.facet) {
                    filters = meta.facet;
                }
            }

            let totalPages = Math.ceil(total / limit);

            res.json({
                total,
                curPage: page,
                totalPages: totalPages,
                docs: docs,
                filters,
            });
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: "error" });
        }
    },
};

async function getOptions(field) {
    try {
        let docs = await Offer.aggregate([
            {
                $group: {
                    _id: `$${field}`,
                    total: { $sum: 1 },
                },
            },
        ]);

        return docs;
    } catch (error) {
        throw error;
    }
}

async function search(req) {
    try {
        let q = req.query.dealType || "contract";
        let fq = req.query.fq || null;
        let filters = null;
        let limit = req.query.limit || 6;
        let page = req.query.page || 1;
        let skip = (page - 1) * limit;

        if (fq) {
            filters = formatFilter(fq);
        }
        // console.log(query, filters);

        let project = {
            phone: 1,
            network: 1,
            deal: 1,
            dealType: 1,
            description: 1,
            store: 1,
            url: 1,
        };

        let query = {
            text: {
                query: q,
                path: "dealType",
            },
        };

        let operator = query;

        if (filters) {
            operator = {
                compound: {
                    must: [query],
                    filter: filters,
                },
            };
        }

        let facets = {
            costFacet: {
                type: "number",
                boundaries: [5, 10, 20, 40, 60, 100, 200, 400, 800, 1600],
                path: "deal.cost",
                default: "Other",
            },
        };

        if (q !== "simonly") {
            facets.brandsFacet = {
                type: "string",
                path: "phone.brand",
            };
        }

        if (q !== "simfree") {
            facets.contractLengthFacet = {
                type: "number",
                boundaries: [1, 12, 24, 36],
                path: "deal.contractLength",
                default: "Other",
            };

            facets.networkFacet = {
                type: "string",
                path: "network",
            };
        }

        let docs = await Offer.aggregate([
            {
                $search: {
                    index: "offersIdx",
                    facet: {
                        operator: operator,
                        facets: facets,
                    },
                },
            },
            {
                $facet: {
                    docs: [
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $project: project,
                        },
                    ],
                    meta: [{ $replaceWith: "$$SEARCH_META" }, { $limit: 1 }],
                },
            },
        ]);
        return docs[0];
    } catch (error) {
        throw error;
    }
}

function formatFilter(fq) {
    const fl = [];
    let parts = fq.split("|");
    // console.log("total parts: ", parts.length);
    for (let fp of parts) {
        // console.log(fp);
        let p = fp.split(":");

        let path = "";

        if (["cost", "contractLength"].includes(p[0])) {
            path = `deal.${p[0]}`;
        } else if (p[0] === "brand") {
            path = `phone.brand`;
        } else {
            path = p[0];
        }

        let f = "";
        if (path === "deal.cost" || path === "deal.contractLength") {
            f = {
                range: {
                    path: path,
                    gte: parseInt(p[1]),
                    lte: parseInt(p[1]) * 2,
                },
            };
        } else {
            f = {
                text: {
                    query: p[1].split(","),
                    path: path,
                },
            };
        }

        fl.push(f);
    }

    // console.log(fl);

    return fl;
}
