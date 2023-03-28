const Phone = require("../models/phone.model");
const _ = require("../lib/helper");

module.exports = {
    async get(req, res) {
        try {
            let docs = await Phone.find().limit(5).exec();
            res.json({
                message: "OK",
                docs,
            });
        } catch (err) {
            res.status(400).json({ message: "error" });
        }
    },

    async search(req, res) {
        try {
            let limit = 6;
            req.query.limit = 6;
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
                docs,
                filters,
            });
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: "error" });
        }
    },

    async create(req, res) {
        try {
            // return res.json(req.body);
            // save doc
            let newPhone = new Phone(req.body);
            var doc = await newPhone.save();

            res.status(201).json({
                message: "created",
                doc,
            });
        } catch (error) {
            res.status(400).json({ message: "error" });
        }
    },

    async update(req, res) {
        try {
            const id = req.params.id || null;
            if (!id) throw "Invalid Id";

            let data = req.body;

            // update doc
            var doc = await Phone.findByIdAndUpdate(
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

    async getById(req, res) {
        try {
            const id = req.params.id || null;
            if (!id) throw "Invalid Id";

            res.json({ message: `id is${req.params.id}` });
        } catch (error) {}
    },
};

async function search(req) {
    try {
        let q = req.query.q || ["ios", "android"];
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
            name: 1,
            slug: 1,
            image: 1,
            brand: 1,
            features: 1,
        };

        let query = {
            text: {
                query: q,
                path: {
                    wildcard: "*",
                },
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
            brandsFacet: {
                type: "string",
                path: "brand",
            },
            osFacet: {
                type: "string",
                path: "os",
            },
            colorFacet: {
                type: "string",
                path: "features.color",
            },
        };

        let docs = await Phone.aggregate([
            {
                $search: {
                    index: "phoneIdx",
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

        if (["color", "memory", "storage"].includes(p[0])) {
            path = `features.${p[0]}`;
        } else {
            path = p[0];
        }

        let f = {
            text: {
                query: p[1].split(","),
                path: path,
            },
        };

        fl.push(f);
    }

    console.log(fl);

    return fl;
}
