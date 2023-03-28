// import modules
const User = require("../models/user.model"),
    _ = require("../lib/helper"),
    validator = require("validator"),
    jwt = require("jsonwebtoken");

const responseFields = ["_id", "name", "email", "role"];

const genToken = function (obj) {
    const payload = _.pick(obj, responseFields);

    return jwt.sign(payload, process.env.JWT_KEY);
};

module.exports = {
    get(req, res) {
        User.find({})
            .select("name email")
            .exec()
            .then((result) => {
                res.status(200).json({
                    users: result,
                });
            })
            .catch((error) => {
                //console.log(error);
                res.status(500).json({
                    message: "Query to Users DB failed",
                });
            });
    },

    create(req, res) {
        let data = {
            name: req.body.name || "",
            email: req.body.email || "",
            password: req.body.password || "",
            role: req.body.role || "user",
        };

        let newUser = new User(data);

        var self = this;

        newUser
            .save()
            .then((user) => {
                const token = genToken(user);
                res.status(200).json({
                    user: _.pick(user, responseFields),
                    token,
                });
            })
            .catch((errors) => {
                res.status(400).json({
                    errors,
                });
            });
    },

    async login(req, res) {
        try {
            const email = (req.body.email || "") + "";
            const password = (req.body.password || "") + "";

            // console.log(password)

            if (
                validator.isEmpty(email) ||
                !validator.isEmail(email) ||
                validator.isEmpty(password)
            ) {
                throw new Error("Invalid email or password");
            }
            const user = await User.findOne({ email: req.body.email });

            const isAuthenticated = await user.isCorrectPassword(password);

            // console.log(isAuthenticated)

            if (!isAuthenticated) {
                throw new Error("Authentication failed");
            }

            const token = genToken(user);

            res.status(200).json({
                status: "OK",
                token,
                user: _.pick(user, responseFields),
            });
        } catch (err) {
            // console.log(err)
            res.status(400).json({
                status: "FAIL",
            });
        }
    },
};
