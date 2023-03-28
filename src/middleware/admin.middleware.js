const jwt = require("jsonwebtoken");

module.exports = auth = (req, res, next) => {
    try {
        // get token from request
        const token = req.headers.authorization.split(" ")[1];
        if (!token) throw true;

        // decode token
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        console.log(decoded);
        if (decoded && decoded.role === "admin") {
            req.user = decoded;
            next();
        } else {
            throw true;
        }
    } catch (err) {
        // return an error
        //console.log(err)
        return res.status(403).send({
            success: false,
            message: "Authentication failed.",
        });
    }
};
