const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan("combined"));

app.use(express.json());

// default route
app.get("/", (req, res) => {
    res.json({ message: "OK" });
});

//routes
// phones route
app.use("/phones", require("./routes/phone.route.js"));

// offers routes
app.use("/offers", require("./routes/offer.route.js"));

// users routes
app.use("/users", require("./routes/user.route.js"));

// options routes
app.use("/options", require("./routes/option.route.js"));

// options routes
app.use("/test", require("./routes/test.route.js"));

// if the route does not exist
app.use((req, res, next) => {
    const error = new Error("Page not found");
    error.status = 400;
    next(error);
});

// for any errors (including the one above and others) send this response

app.use((err, req, res, next) => {
    console.log(
        `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
            req.method
        } - ${req.ip}`
    );
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message,
        },
    });
});

// connect to database first and if all goes well then start the api server
const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        app.listen(port, () => console.log(`Server started on port ${port}`));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

start();
