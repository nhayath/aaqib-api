const { model } = require("mongoose");
const Offer = require("../models/offer.model");
const { json } = require("stream/consumers");

module.exports = {
    async test(req, res) {
        try {
            let result = await Offer.aggregate([
                {
                    $searchMeta: {
                        index: "offersIdx",
                        facet: {
                            operator: {
                                compound: {
                                    must: [
                                        {
                                            text: {
                                                query: ["contract"],
                                                path: "dealType",
                                            },
                                        },
                                    ],
                                },
                            },
                            facets: {
                                brandsFacet: {
                                    type: "string",
                                    path: "phone.brand",
                                },
                                networkFacet: {
                                    type: "string",
                                    path: "network",
                                },
                                contractLength: {
                                    type: "number",
                                    boundaries: [1, 12, 24, 36],
                                    path: "deal.contractLength",
                                    default: "Other",
                                },
                                costFacet: {
                                    type: "number",
                                    boundaries: [20, 30, 40, 50, 60, 70],
                                    path: "deal.cost",
                                    default: "Other",
                                },
                            },
                        },
                    },
                },
            ]);

            res.json({ result });
        } catch (error) {
            res.status(400).json({ messsage: error.message });
        }
    },
};
