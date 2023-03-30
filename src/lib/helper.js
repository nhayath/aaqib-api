// pick from object
const pick = (obj, keys = []) => {
    var newObject = {};
    keys.forEach(function (key) {
        if (obj[key] != null) newObject[key] = obj[key];
    });
    return newObject;
};

function pickExcept(obj, ignore) {
    var newObject = {};
    Object.keys(obj).forEach((key) => {
        if (!ignore.includes(key)) {
            newObject[key] = obj[key];
        }
    });

    return newObject;
}

function aPickExcept(items, ignore) {
    return items.map((item) => pickExcept(item, ignore));
}

// pick from array objects
const apick = (items, keys = []) => {
    return items.map((item) => pick(item, keys));
};

const slugify = (str) => {
    // slugify
    let slug = str
        .toString()
        .toLowerCase()
        .trim()
        .replace(/&/g, "-and-") // Replace & with 'and'
        .replace(/[^a-z0-9-\/]+/g, "-"); // Replace spaces, non-word characters and dashes with a single dash (-)

    return slug;
};

const dateToday = () => {
    return new Date()
        .toISOString()
        .split("T")[0]
        .split("-")
        .reverse()
        .join("-");
};

const searchString = (str) => {
    try {
        if (!str || str.length < 2) return null;

        let strArr = str.toLowerCase().split(" ");

        strArr = strArr.map((st) => {
            if (!st || st.length < 2) return false;
            return st.replace(/[^a-z0-9-]/g, "");
        });

        str = strArr.length === 0 ? strArr[0] : "+" + strArr.join(" +");

        if (!str || str.length < 2) return null;

        return str;
    } catch (e) {
        // statements
        // console.log(e.message);
        throw e;
    }
};

function sprintf(str, args) {
    if (arguments.length) {
        var t = typeof arguments[0];
        var key;

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
}

module.exports = {
    pick,
    apick,
    slugify,
    dateToday,
    searchString,
    sprintf,
    pickExcept,
    aPickExcept,
};
