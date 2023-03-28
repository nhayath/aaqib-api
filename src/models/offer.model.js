const { stringify } = require("querystring");

const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

// define phone collection schema
const offerSchema = Schema(
    {
        phone: {
            _id: Schema.Types.ObjectId,
            name: String,
            brand: String,
            os: String,
            slug: String,
            image: String,
        },

        description: {
            type: String,
            trim: true,
        },
        network: String,
        dealType: {
            type: String,
            enum: ["simfree", "contract"],
            default: "contract",
        },
        deal: {
            cost: Number,
            upfrontCost: Number,
            data: Number,
            minutes: Number,
            texts: Number,
            contractLength: Number,
        },
        store: String,
        url: String,
        createdAt: {
            type: Date,
            default: Date.now,
        },

        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { collection: "offers" }
);

// indexes
offerSchema.index(
    { "phone._id": 1, sku: 1 },
    { name: "phoneIdx", background: true }
);
offerSchema.index(
    { "phone.slug": 1, sku: 1 },
    { name: "phoneSlugIdx", background: true }
);

// export
module.exports = mongoose.model("Offer", offerSchema);
