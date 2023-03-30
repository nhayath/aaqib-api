const mongoose = require("mongoose");

// define schema

const optionSchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: "Name is required",
        },

        value: {
            type: mongoose.Schema.Types.Mixed,
            required: "value is required",
        },
    },
    {
        collection: "options",
    }
);

// indexes
optionSchema.index(
    { name: 1 },
    {
        name: "optionNameIdx",
        background: true,
        collation: { locale: "en", strength: 2 },
    }
);

module.exports = mongoose.model("Option", optionSchema);
