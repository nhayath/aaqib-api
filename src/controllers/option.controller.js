const Option = require("../models/option.model");
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

    async getAll(req, res) {
        try {
            const name = req.params.name || null;
            if (!name) throw "Invalid Id";

            var limit = 12;
            let page = req.query.page ? parseInt(req.query.page) : 1;
            var cond = {};
            // console.log(req.body);
            if (name) {
                cond["name"] = name;
            }

            var docs = await Option.find(cond)
                .limit(limit)
                .skip((page - 1) * limit)
                .exec();

            // total
            var total = await Option.find(cond).count().exec();
            let totalPages = Math.ceil(total / limit);

            res.json({
                total: total,
                limit,
                totalPages,
                curPage: page,
                docs: docs,
            });
        } catch (err) {
            // console.log(err);
            res.status(400).json({
                message: "No matches found",
            });
        }
    },

    async create(req, res) {
        try {
            // return res.json(req.body);
            // save doc
            let newDoc = new Option(req.body);
            var doc = await newDoc.save();

            res.status(201).json({
                message: "created",
                doc,
            });
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
            var doc = await Option.findByIdAndUpdate(
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
                message: err.message,
            });
        }
    },

    async getById(req, res) {
        try {
            const id = req.params.id || null;
            let doc = await Option.findById(id).lean();
            if (!doc._id) throw "Invalid Id";

            doc = _.pickExcept(doc, ["createdAt", "updatedAt", "__v"]);

            res.json({ doc });
        } catch (error) {
            res.json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const id = req.params.id || null;
            if (!id) throw new Error("Invalid Id");

            let status = await Option.deleteOne({ _id: id }).exec();

            res.status(200).json({
                message: "OK",
                status,
            });
        } catch (error) {
            res.json({ error: error.message });
        }
    },
};
