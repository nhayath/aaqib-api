const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// define schema

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: "Name is required",
        },
        email: {
            trim: true,
            required: "Email is required",
            type: String,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please fill a valid email address",
            ],
        },
        role: {
            type: "String",
            enum: ["admin", "user"],
            default: "user",
        },
        password: {
            type: String,
            required: [true, "Invalid Password"],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        collection: "users",
    }
);

// indexes
userSchema.index(
    { name: 1 },
    {
        name: "userNameIdx",
        background: true,
        collation: { locale: "en", strength: 2 },
    }
);
userSchema.index(
    { email: 1 },
    {
        name: "userEmailIdx",
        background: true,
        unique: true,
        collation: { locale: "en", strength: 2 },
    }
);

// hash password before creating a new user
userSchema.pre("save", function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) return next();

    // check length
    if (user.password.length < 6) {
        return next({ message: "password must be 6 chars or more" });
    }

    // console.log('genHash')

    // generate a salt

    bcrypt
        .hash(user.password, 10)
        .then((hash) => {
            //console.log(hash)
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        })
        .catch((err) => next(err));
});

// match password
userSchema.methods.isCorrectPassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
