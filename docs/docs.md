[] Create a project

```
$ npm init -y
$ npm install express dotenv cors morgan mongoose
```

express: express framework
cors: control access
morgan: adds some logging capabilities
nodemon: automatically refreshes server when changes are made
mongoose: Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js

[] create file server.js

[] start server

```
# start dev server
$ nodemon server.js
# start production server
$ node server.js
```

[] Setup mongodb

-   install `mongoose`
-   go to mongodb atlas site and create an account
-   change server.js to make sure it connects to database first before starting the server

[] create route files

-   `routes/phones.route.js`
-   `routes/offers.route.js`
