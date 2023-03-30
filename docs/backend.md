My backend is a Rest Api which is developed using NodeJs and it's popular ExpressJs framework. I have used MongoDB as my database server. Database is hosted on MongoDB atlas.

My Rest API has the following dependencies

ExpressJs: Handles routing, request and responses
Mongoose: MongoDB database ORM, manages database connection and performs CRUDs operations
morgan: logs requests and responses
nodemon: automatically refreshes server when changes are made, used only for development
bcrypt: for hashing password
jsonwebtoken: for token based authentication
dotenv: for reading environment variables

### Initiate a Node Project

First we create a project folder and run the following command to initiate the project

```
$ mkdir api
$ cd api
$ npm init -y
```

### Install Dependencies

To install all the dependencies we run the following command

```
$ npm i express mongoose morgan nodemon bcrypt jsonwebtoken
```

### Directory Structures

```
├── src
│   ├── controller
│   ├── lib
│   ├── middleware
│   ├── models
├── routes
├── server.js
├── node_modules
├── package.json
├── package-lock.json
└── .gitignore
```

### Database

We are using MongoDB to store our project data. It is being hosted on MongoDB Atlas a fully managed cloud platform for MongoDB. I am using their free tier to create a database on their cloud platform for free.

Our project has the following database collections

> Phones - for storing phone documents
> Offers - contains offers for phones
> Users - stores users both Admin and General
> Options - stores various site configuration data

### Creating Server

server.js file is the gateway to our API server. It contains necessary information for creating a Rest API server. It connects to database first and upon success it creates a server at port 3001 and listens for incoming requests and route them to their destinations before returing their responses. This is the base configuration of our server.js file.

```
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
app.use("/phones", require("./routes/phone.route.js"));

app.use("/offers", require("./routes/offer.route.js"));

app.use("/users", require("./routes/user.route.js"));

app.use("/options", require("./routes/option.route.js"));

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

```

now we can run our server by typing the following command at the terminal

```
# for development
$ nodemon server.js

# for production
$ node server.js
```

### Routing

Our routing files can be found in the routes folder of the root directory. After the server recieves a request it then passes it to a corresponding routing file which in turn send the request to the appropriate controller for processing. Our project has the following routing files

> phone.route.js - requests made to `/phones` path are handled by this route
> offer.route.js - requests made to `/offers` path are handled by this route
> user.route.js - requests made to `/users` path are handled by this route
> option.route.js - requests made to `/options` path are handled by this route

### Controllers

Controllers files recieve requests then process it before returing their responses. If required controllers connect to database to perform necessary CRUD operations. Our project has the follow controller files.

> phone.controller.js - handles actions for Phones Database Collection
> offer.controller.js - handles actions for Offers Database Collection
> user.controller.js - handles actions for Phone Database Collection
> option.controller.js - handles actions for Options Database Collection

### Models

Our project has four MongoDB database collections and their schema can be found in `src/models` folder. We have the following models

> phone.model.js - defines schema for `Phones` collection
> offer.model.js - defines schema for `Offers` collection
> user.model.js - defines schema for `Users` collection
> option.model.js - defines schema for `Option` collection

### Middleware

middlewares are called before a request is passed onto it's handler. They can be used to validate requests, authentication or login purposes. We use two authentication middlewares in our project to protect our private routes. If a request is made to access a protected route, it checks if it has proper authorization before accepting or denying the request. These files can be found in `/src/midddleware/`. Admin middleware protects routes that only an admin can access. User middleware manages routes that only accessible to normal authenticated site users.

```
/src/middleware/admin.middleware.js
/src/middleware/user.middleware.js
```

### API Reference

Our REST API uses JSON excluseively as the request and response format. The REST API provides both public and private data. Authentication is required before accessing private data.

This API reference provides information on the specific endpoints available through the API, their parameters, and their response data format.

### Endpoint

GET http://localhost:3001

### Retrieve a list of phones

API Endpoint

```
GET /phones
```

Arguments

```
page:
    - current page
    - type: number
    - default: 1
    - example: /phones?page=2
limit:
    - Maximum number of items to be returned in result set.
    - default: 10
    - example: /phones?limit=20
```

Route

```javascript
# /routes/phone.route.js
router.get("/", PhoneController.getAll);
```

```javascript
# src/controllers/phone.controller.js

async getAll(req, res) {
        try {
            var limit = 100;
            let page = req.query.page ? parseInt(req.query.page) : 1;
            var cond = {};
            // console.log(req.body);
            if (req.query.brand) {
                cond["brand"] = req.query.brand;
            }

            var docs = await Phone.find(cond)
                .limit(limit)
                .skip((page - 1) * limit)
                .exec();

            // total
            var total = await Phone.find(cond).count().exec();
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
    }

```

Response

```
{
    "message": "OK",
    "docs": [
        {
            "features": {
                "color": "Black",
                "screenSize": "5.4",
                "storage": "128GB",
                "memory": "4GB",
                "battery": "4000mah"
            },
            "_id": "6413194dba14f06674f22c1f",
            "name": "Apple iPhone 14 128GB",
            "slug": "apple-iphone-14-128gb",
            "brand": "Apple",
            "os": "iOS",
            "description": "The iPhone 14 is a very good phone for the money, offering improved cameras, a faster A15 Bionic chip and fun Action mode for video capture. But at this price, we’d like to see a telephoto zoom and 120Hz display. Some may want to get the iPhone 14 Plus instead for its larger screen and bigger battery.",
            "createdAt": "2023-03-16T13:27:41.693Z",
            "updatedAt": "2023-03-16T13:27:41.698Z",
            "__v": 0,
            "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14.jpg"
        },
        ...
    ]
}
```

# Add a new phone

Private route, requires authentication

```
POST /phones
Content-Type: application/json
Authorizaton: Bearer <AUTH_TOKEN>

{
    "name": "Apple iPhone 14 Pro 128GB",
    "slug": "apple-iphone-14-pro-128gb",
    "brand": "Apple",
    "os": "iOS",
    "features": {
        "color": "Midnight",
        "screenSize": "5.4",
        "storage": "128GB",
        "memory": "4GB",
        "battery": "4000mah"
    },
    "description": "...",
    "isActive": "y"
}
```

Routing for this request

```javascript
# /routes/phone.route.js
router.post("/", adminAuth, PhoneController.create);
```

Handler for this request

```javascript
# src/controllers/phone.controller.js
async create(req, res) {
    try {
        // return res.json(req.body);
        // save doc
        let newPhone = new Phone(req.body);
        var doc = await newPhone.save();

        res.status(201).json({
            message: "created",
            doc,
        });
    } catch (error) {
        res.status(400).json({ message: "error" });
    }
}

```

Response

```json
{
    "message": "created",
    "doc": {...}
}
```

### Modify a phone document

> Request

```rest
PATCH /phones/:id
Content-Type: application/json
Authorizaton: Bearer <AUTH_TOKEN>

{
    "name": "Apple iPhone 14 Pro 128GB",
    "slug": "apple-iphone-14-pro-128gb",
    "brand": "Apple",
    "os": "iOS",
    "features": {
        "color": "Midnight",
        "screenSize": "5.4",
        "storage": "128GB",
        "memory": "4GB",
        "battery": "4000mah"
    },
    "description": "...",
    "isActive": "y"
}
```

Arguments

```
id:
    - required
AUTH_TOKEN:
    - authentication token
    - required
```

> Routing

```javascript
# /routes/phone.route.js
router.patch("/:id", adminAuth, PhoneController.update);
```

> Handler for this request

```javascript
# src/controllers/phone.controller.js
async update(req, res) {
    try {
        const id = req.params.id || null;
        if (!id) throw "Invalid Id";

        let data = req.body;

        // update doc
        var doc = await Phone.findByIdAndUpdate(
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
            message: "Update Failed",
        });
    }
}

```

Response

```json
{
    "message": "OK",
    "doc": {...}
}
```

### Searching for phones with filtering

> requst

```rest
GET /phones/search?q=android
```

> Arguments

```
q:
    - query string
fq:
    - filter result
    - /phones/search?fq=brand:Apple
```

> Routing

```javascript
# /routes/phone.route.js
router.get("/search", PhoneController.search);
```

> Handler for this request

```javascript
# src/controllers/phone.controller.js
async function search(req) {
    try {
        let q = req.query.q || ["ios", "android"];
        let fq = req.query.fq || null;
        let filters = null;
        let limit = req.query.limit || 6;
        let page = req.query.page || 1;
        let skip = (page - 1) * limit;

        if (fq) {
            filters = formatFilter(fq);
        }
        // console.log(query, filters);

        let project = {
            name: 1,
            slug: 1,
            image: 1,
            brand: 1,
            features: 1,
        };

        let query = {
            text: {
                query: q,
                path: {
                    wildcard: "*",
                },
            },
        };

        let operator = query;

        if (filters) {
            operator = {
                compound: {
                    must: [query],
                    filter: filters,
                },
            };
        }

        let facets = {
            brandsFacet: {
                type: "string",
                path: "brand",
            },
            osFacet: {
                type: "string",
                path: "os",
            },
            colorFacet: {
                type: "string",
                path: "features.color",
            },
        };

        let docs = await Phone.aggregate([
            {
                $search: {
                    index: "phoneIdx",
                    facet: {
                        operator: operator,
                        facets: facets,
                    },
                },
            },
            {
                $facet: {
                    docs: [
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $project: project,
                        },
                    ],
                    meta: [{ $replaceWith: "$$SEARCH_META" }, { $limit: 1 }],
                },
            },
        ]);
        return docs[0];
    } catch (error) {
        throw error;
    }

```

Response

```json
{
    "total": 3,
    "curPage": 1,
    "totalPages": 1,
    "docs": [
        {
            "_id": "641ae8687e86c2e0e24542cd",
            "name": "Samsung Galaxy S23 128GB Green",
            "slug": "samsung-galaxy-s23-128gb-green",
            "brand": "Samsung",
            "features": {
                "color": "Green",
                "screenSize": "6.1",
                "storage": "128GB",
                "memory": "8GB",
                "battery": "3900mAh"
            },
            "image": "https://media.secure-mobiles.com/product-images/samsung-galaxy-s23-128gb-green.responsive-fx.webp",
            "deal": {
                "contract": {
                    "cost": 40,
                    "upfrontCost": 225,
                    "data": 250,
                    "minutes": -1,
                    "texts": -1,
                    "contractLength": 24
                }
            }
        },
        {
            "_id": "641ae8f9826d3922abd00041",
            "name": "Samsung Galaxy A54 128G",
            "slug": "samsung-galaxy-a54-128gb",
            "brand": "Samsung",
            "features": {
                "color": "Green",
                "screenSize": "6.4",
                "storage": "128GB",
                "memory": "6GB",
                "battery": "5000mAh"
            },
            "image": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a54.jpg",
            "deal": {
                "contract": {
                    "cost": 40,
                    "upfrontCost": 225,
                    "data": 250,
                    "minutes": -1,
                    "texts": -1,
                    "contractLength": 24
                }
            }
        },
        {
            "_id": "641aebe69b415770acf379fc",
            "name": "Google Pixel 7a",
            "slug": "google-pixel-7a",
            "brand": "Google",
            "features": {
                "color": "Green",
                "screenSize": "6.1",
                "storage": "128GB",
                "memory": "6GB",
                "battery": "4500mAh"
            },
            "image": "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-6a.jpg",
            "deal": {
                "contract": {
                    "cost": 40,
                    "upfrontCost": 225,
                    "data": 250,
                    "minutes": -1,
                    "texts": -1,
                    "contractLength": 24
                }
            }
        }
    ],
    "filters": {
        "colorFacet": {
            "buckets": [
                {
                    "_id": "Green",
                    "count": 3
                }
            ]
        },
        "osFacet": {
            "buckets": [
                {
                    "_id": "Android",
                    "count": 3
                }
            ]
        },
        "brandsFacet": {
            "buckets": [
                {
                    "_id": "Samsung",
                    "count": 2
                },
                {
                    "_id": "Google",
                    "count": 1
                }
            ]
        }
    }
}
```

### Offers Endpoint

```
/offers
```

### Get an offer by it's ID

```
/offers/id/:id
```

> arguments

```
id:
    - offer id
```

> routing

```javascript
# /routes/offer.route.js
router.get("/id/:id", OfferController.getById);
```

> Request handler

```javascript
# src/controllers/offer.controller.js
async getById(req, res) {
        try {
            const id = req.params.id || null;
            let doc = await Offer.findById(id).lean();
            if (!doc._id) throw "Invalid Id";
            let phone = doc.phone;

            doc = _.pickExcept(doc, ["phone", "createdAt", "updatedAt", "__v"]);

            res.json({ doc, phone });
        } catch (error) {
            res.json({ error: error.message });
        }
    }
```

> response

```json
{
    "doc": {
        "_id": "64135b4c9082ce5eacc0db45",
        "description": "Vodafone Offer for Apple iPhone 14",
        "network": "Vodafone",
        "deal": {
            "cost": 35.99,
            "upfrontCost": 129.99,
            "data": 128,
            "minutes": -1,
            "texts": -1,
            "contractLength": 24
        },
        "dealType": "contract",
        "store": "Fonehouse",
        "url": "https://www.fonehouse.co.uk/mobile-phone-deals/iphone-14-5g"
    },
    "phone": {
        "_id": "6413194dba14f06674f22c1f",
        "name": "Apple iPhone 14 128GB",
        "brand": "Apple",
        "os": "iOS",
        "slug": "apple-iphone-14-128gb",
        "image": "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/61cwywLZR-L._AC_UY327_FMwebp_QL65_.jpg"
    }
}
```

### Get all offers of a phone

> request

```
GET /offers/phone/:phone_slug
```

> arguments

```
phone_slug:
    - phone slug to retrieve offers for
```

> route

```javascript
router.get("/phone/:phone_slug", OfferController.getPhoneOffers);
```

> handler

```javascript
async getPhoneOffers(req, res) {
    try {
        let phone = await Phone.findOne({
            slug: req.params.phone_slug,
        });
        let offers = await Offer.find({
            "phone.slug": req.params.phone_slug,
        }).exec();
        return res.json({
            phone,
            offers,
        });
    } catch (err) {
        res.status(400).json({ message: "error" });
    }
}
```

> response

```json
{
    "phone": {
        "features": {
            "color": "Black",
            "screenSize": "5.4",
            "storage": "128GB",
            "memory": "4GB",
            "battery": "4000mah"
        },
        "_id": "6413194dba14f06674f22c1f",
        "name": "Apple iPhone 14 128GB",
        "slug": "apple-iphone-14-128gb",
        "brand": "Apple",
        "os": "iOS",
        "description": "The iPhone 14 is a very good phone for the money, offering improved cameras, a faster A15 Bionic chip and fun Action mode for video capture. But at this price, we’d like to see a telephoto zoom and 120Hz display. Some may want to get the iPhone 14 Plus instead for its larger screen and bigger battery.",
        "createdAt": "2023-03-16T13:27:41.693Z",
        "updatedAt": "2023-03-16T13:27:41.698Z",
        "__v": 0,
        "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14.jpg"
    },
    "offers": [
        {
            "phone": {
                "_id": "6413194dba14f06674f22c1f",
                "name": "Apple iPhone 14 128GB",
                "brand": "Apple",
                "os": "iOS",
                "slug": "apple-iphone-14-128gb",
                "image": "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/61cwywLZR-L._AC_UY327_FMwebp_QL65_.jpg"
            },
            "deal": {
                "cost": 35.99,
                "upfrontCost": 129.99,
                "data": 128,
                "minutes": -1,
                "texts": -1,
                "contractLength": 24
            },
            "_id": "64135b4c9082ce5eacc0db45",
            "description": "Vodafone Offer for Apple iPhone 14",
            "createdAt": "2023-03-16T18:09:16.446Z",
            "updatedAt": "2023-03-16T18:09:16.451Z",
            "__v": 0,
            "network": "Vodafone",
            "dealType": "contract",
            "store": "Fonehouse",
            "url": "https://www.fonehouse.co.uk/mobile-phone-deals/iphone-14-5g"
        },
        {
            "phone": {
                "_id": "6413194dba14f06674f22c1f",
                "name": "Apple iPhone 14 128GB",
                "brand": "Apple",
                "os": "iOS",
                "slug": "apple-iphone-14-128gb",
                "image": "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/61cwywLZR-L._AC_UY327_FMwebp_QL65_.jpg"
            },
            "deal": {
                "cost": 47,
                "upfrontCost": 39,
                "data": -1,
                "minutes": -1,
                "texts": -1,
                "contractLength": 24
            },
            "_id": "64136208943683c1d194d6e2",
            "description": "Three offer",
            "network": "Three",
            "createdAt": "2023-03-16T18:38:00.398Z",
            "updatedAt": "2023-03-16T18:38:00.398Z",
            "__v": 0,
            "dealType": "contract",
            "store": "Fonehouse",
            "url": "https://www.fonehouse.co.uk/mobile-phone-deals/iphone-14-5g"
        },
        {
            "phone": {
                "_id": "6413194dba14f06674f22c1f",
                "name": "Apple iPhone 14 128GB",
                "brand": "Apple",
                "os": "iOS",
                "slug": "apple-iphone-14-128gb",
                "image": "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/61cwywLZR-L._AC_UY327_FMwebp_QL65_.jpg"
            },
            "deal": {
                "cost": 36,
                "upfrontCost": 135,
                "data": -1,
                "minutes": -1,
                "texts": -1,
                "contractLength": 24
            },
            "_id": "64144a0984f80a418d2f68ac",
            "description": "Three offer",
            "network": "Three",
            "dealType": "contract",
            "store": "Fonehouse",
            "url": "https://www.fonehouse.co.uk/mobile-phone-deals/iphone-14-5g",
            "createdAt": "2023-03-17T11:07:53.829Z",
            "updatedAt": "2023-03-17T11:07:53.829Z",
            "__v": 0
        },
        {
            "phone": {
                "_id": "6413194dba14f06674f22c1f",
                "name": "Apple iPhone 14 128GB",
                "brand": "Apple",
                "os": "iOS",
                "slug": "apple-iphone-14-128gb",
                "image": "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14.jpg"
            },
            "deal": {
                "cost": 885.55,
                "upfrontCost": null,
                "data": null,
                "minutes": null,
                "texts": null,
                "contractLength": null
            },
            "_id": "64242eccc81adace6d563a7d",
            "description": "amazon simfree iphone 14 128gb",
            "network": "",
            "dealType": "simfree",
            "store": "Amazon",
            "url": "https://www.amazon.co.uk",
            "createdAt": "2023-03-29T12:27:56.500Z",
            "updatedAt": "2023-03-29T12:27:56.500Z",
            "__v": 0
        }
    ]
}
```

### Add a single offer

> Request

```rest
POST /offers/add/
Content-Type: application/json
Authorizaton: Bearer <AUTH_TOKEN>

{
    "phone_id": "64132a316300928903cda947",
    "description": "Three offer",
    "network": "Three",
    "dealType": "contract",
    "deal": {
        "cost": 36.00,
        "upfrontCost": 135.00,
        "data": -1,
        "minutes": -1,
        "texts": -1,
        "contractLength": 24
    },
    "store": "Fonehouse",
    "url": "https://www.store.co.uk/mobile-phone-deals/iphone-14-5g"
}

```

> route

````javascript
router.post("/add", adminAuth, OfferController.create);
`

> handler
```javascript
async create(req, res) {
    try {
        let data = req.body;
        if (data.phone_id) {
            let pd = await Phone.findById(data.phone_id);
            if (!pd || !pd._id) throw "Phone not found";
            data.phone = {
                _id: pd._id,
                name: pd.name,
                brand: pd.brand,
                os: pd.os,
                slug: pd.slug,
                image: pd.image,
            };
        }
        let newOffer = new Offer(req.body);
        var doc = await newOffer.save();
        res.status(201).json({
            message: "Created",
            doc,
        });
    } catch (error) {
        // console.log(error);
        res.status(400).json({ message: error.message });
    }
}
````

> response

```json
{
    "message": "created",
    "doc": {...}
}
```

### Add Bulk Offer

Make the following request to add more than one offers for a phone in one go

```json
POST /offers/addBulk
Content-Type: application/json
Authorizaton: Bearer <AUTH_TOKEN>

[
    {
        "phone_id": "641af6d22094bd288501a1d4",
        "description": "Vodafone offer",
        "network": "Vodafone",
        "dealType": "contract",
        "deal": {
            "cost": 55.00,
            "upfrontCost": 25.00,
            "data": 128,
            "minutes": -1,
            "texts": -1,
            "contractLength": 24
        },
        "store": "Vopdafone",
        "url": "https://www.fonehouse.co.uk/mobile-phone-deals/iphone-14-5g"
    },
    {
        "phone_id": "641af6d22094bd288501a1d4",
        "description": "Three offer",
        "network": "Three",
        "dealType": "contract",
        "deal": {
            "cost": 45.00,
            "upfrontCost": 95.00,
            "data": 128,
            "minutes": -1,
            "texts": -1,
            "contractLength": 24
        },
        "store": "Vopdafone",
        "url": "https://www.fonehouse.co.uk/mobile-phone-deals/iphone-14-5g"
    },
    {
        ...
    }
]
```

> route

````javascript
router.post("/addBulk", adminAuth, OfferController.createBulk);
`

> handler
```javascript
async createBulk(req, res) {
    try {
        let data = req.body;
        let ops = [];
        for (let d of data) {
            let pd = await Phone.findById(d.phone_id);
            d.phone = {
                _id: pd._id,
                name: pd.name,
                brand: pd.brand,
                os: pd.os,
                slug: pd.slug,
                image: pd.image,
            };

            ops.push(d);
        }

        // let result = ops;

        let result = await Offer.insertMany(ops);

        res.json({ result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
````

> response

```json
[

    {
        "_id": "64135b4c9082ce5eacc0db45",
        "description": "Vodafone Offer for Apple iPhone 14",
        "network": "Vodafone",
        "deal": {
            "cost": 35.99,
            "upfrontCost": 129.99,
            "data": 128,
            "minutes": -1,
            "texts": -1,
            "contractLength": 24
        },
        "dealType": "contract",
        "store": "Fonehouse",
        "url": "https://www.fonehouse.co.uk/mobile-phone-deals/iphone-14-5g"
    },
    {
        ...
    }

]
```

### Update an offer

> request

```json
PATCH /offers/update/:id
Content-Type: application/json
Authorizaton: Bearer <AUTH_TOKEN>
{
    "description": "New description"
}
```

> arguments

```
id: ID of the offer to be updated, required
AUTH_TOKEN: JWT authentication token, required
```

> routing

```javascript
router.patch("/update/:id", adminAuth, OfferController.update);
```

> handler

```javascript
async update(req, res) {
    try {
        const id = req.params.id || null;
        if (!id) throw "Invalid Id";

        let data = req.body;

        // update doc
        var doc = await Offer.findByIdAndUpdate(
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
            message: "Update Failed",
        });
    }
}
```

### Users Endpoint

handles user registration and authentications

```
/users
```

### Register a new user

> example request

```rest
POST http://localhost:3001/users/create
Content-Type: application/json

{
    "name": "John Doe",
    "email": "jdoe@email.com",
    "password": "secret",
    "role": "user"
}
```

> routing of the request

```javascript
router.post("/create", adminAuth, UserController.create);
```

> handler

```javascript
// /src/controllers/user.controller.js
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
}
```

> response

```json
{
    "user": {...},
    "token": "AUTH_TOKEN"
}
```

### Login

> request

```rest
POST /users/login
Content-Type: application/json

{
    "email": "user@gmail.com",
    "password": "password"
}
```

> arguments

```
email: email address, required
password: user password, required
```

> routing

```javascript
router.post("/login", UserController.login);
```

> handler

```javascript
// /src/controllers/user.controller.js
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
}
```

### Get a list of users

> request

```
GET /users
```

> routing

```javascript
// /routes/user.route.js
router.get("/", adminAuth, UserController.get);
```

> handler

```javascript
// /src/controllers/user.controller.js
get(req, res) {
    User.find({})
        .select("name email role")
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
}
```

> response

```json
{
    "users": [
        {
            "_id": "id",
            "name": "John Doe",
            "email": "jdoe@email.com",
            "role": "user"
        },
        {
            ...
        }
    ]
}
```

### Get a user by User ID

> request

```rest
GET /users/id/:id
Content-Type: application/json
Authorizaton: Bearer <AUTH_TOKEN>
```

> arguments

```
id: user id, required
AUTH_TOKEN: authentication token
```

> routing

```javascript
// /routes/user.route.js
router.get("/id/:id", adminAuth, UserController.findOne);
```

> handler

```javascript
// /src/controllers/user.controller.js
async findOne(req, res) {
    try {
        let id = req.params.id || null;
        let email = req.params.email || null;
        if(!id && !email) throw 'ID or email is required';
        let cond = {};
        if(id) {
            cond['_id'] = id;
        } else if(email) {
            cond['email'] = email;
        }

        let user = await User.findOne(cond).lean();
        res.json({user});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
```

> response

```json
{
    "_id": "id",
    "name": "John Doe",
    "email": "jdoe@email.com",
    "role": "user"
}
```

### Option Endpoint

store and retrieve various site configuration data

> base endpoing

```rest
/options
```

# Get option data by ID

> request

```rest
GET /options/id/:id
```

> args

```
id: option id, required
```

> handler

```javascript
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
}
```

> response

```json
{
    "_id": "ObjectId",
    "name": "menu",
    "value": ["home", "About Us"]
}
```

> Create new option data

```rest
POST /options/add
Content-Type: application/json
Authorization: Bearer AUTH_TOKEN

{
    "name": "menu",
    "value": [
        "home",
        "About Us"
    ]
}
```

> arguments

```
AUTH_TOKEN: authentication token
```

> routing

```javascript
// /routes/option.route.js
router.post("/add", adminAuth, OptionController.create);
```

> handler

```javascript
// /src/controllers/opton.controller.js
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
}
```

> response

```json
{
    "_id": "id",
    "name": "menu",
    "value": ["Home", "About Us"]
}
```
