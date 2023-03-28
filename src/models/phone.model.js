const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

// define phone collection schema
const phoneSchema = Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        slug: {
            type: String,
            trim: true,
            required: true,
        },
        brand: {
            type: String,
            trim: true,
            required: true,
        },
        image: String,
        os: {
            type: "String",
            enum: ["Android", "iOS"],
            default: "Android",
        },
        features: {
            color: String,
            screenSize: String,
            storage: String,
            memory: String,
            battery: String,
        },
        description: {
            type: String,
            trim: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },

        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { collection: "phones" }
);

phoneSchema.index(
    { slug: 1 },
    { name: "slugIdx", unique: true, background: true }
);

// export
module.exports = mongoose.model("Phone", phoneSchema);
