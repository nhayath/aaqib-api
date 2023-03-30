Our front-end is created using NextJs a popular ReactJs Javascript framework that enables Server Side Rendering. NextJs makes developing ReactJs web app much easier as it takes away all the complexisities of creating routing, rendering and data fetching and make them much simpler. To initiate a NextJs app we run the following command in terminal

```
$ mkdir app
$ cd app
$ npx create-next-app@latest
```

> to run the server in development mode

```
$ npm run dev
```

> for production we run

```
$ npm run build
$ npm start
```

> Layout
> Our layout file lays out the structrue of our website. It contains a typical header, content and body section.

```jsx
// /src/components/Layout
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </>
    );
}
```

### Homepage

Our homepage shows most popular contract phone deals that we have currently on our website. The script for homepage can be found in `src/pages/index.js` file. It contains the following code.

```jsx
// /src/pages/index.js
```

`getServerSideProps` function is invoked before anything to fetch required data from our API server. It runs on the server side before the page is rendered. Once the data is recieved it then passes the data to `Home` function so that the page can be rendered with the received data.

### Viewing list of phones

Visit the following url to view a list of phones that we have on our site. User can search for phones using keywords and filter results by selecting available options.

```
url: /phones
```

> arguments

```
q: search by keyword, eg: /phones?q=apple
fq: filter by options, eg: /phones?fq=brand:Apple
```

> code

```jsx
// src/pages/phones/index.jsx
```

### View offers for a phone

Displays phone details and all the deals we have for this phone. Users can view offers for both Simfree and Contract phones by selecting the desired deal type.

> url

```
/offers/:slug
```

> code

```jsx
// src/pages/offers/[slug].jsx
```

### Dashboard Page

This is where we perform administrative tasks as adding, deleting and updating phones and offers. Authentication is requiredthe before accesing dashboard. If a user is not logged in to the system he is redirected to the `/login` page to authenticate.

> url

```
/dashboard
```

> code

```javascript
// src/dashboard/index.jsx
```

### List phones

To view all phones visit the following url

```
/dashboard/phones
```

> code

```javascript
// src/dashboard/phones/index.jsx
```

### Add a new phone

To add a new phone visit

```
/dashboard/phones/add
```

> code

```javascript
// src/dashboard/phones/add.jsx
```

### Modify a phone details

To modify a phone visit

```
/dashboard/phones/edit/:id
```

> arguments

```
id: phone id that you wish to modify
```

> code

```javascript
// src/dashboard/phones/edit/[id].jsx
```

### view phone offers

To view all offers associated with a phone visit

```
/dashboard/phones/offers/:id
```

> arguments

```
id: phone id
```

> code

```javascript
// src/dashboard/phones/offers/[id].jsx
```

### Add a new offer

To add a new offer for a phone visit

```
/dashboard/phones/offers/add-new-offer?id=:phone_id
```

> args

```
id: phone id
```

> code

```javascript
// src/dashboard/phones/offers/add-new-offer.jsx
```

### Modify an offer

To modify an offer visit the following url.

```
/phones/offers/edit-offer?id=:offer_id
```

> arguments

```
id: offer id that you want to modify
```

> code

```javascript
// src/dashboard/phones/offers/edit-offer.jsx
```

### Featured deals

To view, add and edit featured deals that are shown on the homepage visit the following url of the dashboard

```
/dashboard/top-contracts
```

> code

```javascript
// src/dashboard/top-contracts/index.jsx
```

### Add a new featured deal

To add a new featured deal visit the following url and fill up the form with required information than hit submit.

> url

```
/dashboard/top-contracts/add-new
```

> code

```javascript
// src/dashboard/top-contracts/add-new.jsx
```

### Edit featured deal

To edit visit the following url

> url

```
/dashboard/top-contracts/edit?id=:option_id
```

> arguments

```
id: option id
```

> code

```javascript
// src/dashboard/top-contracts/edit.jsx
```

### Manage user

To view, add, edit and delete users visit the folling url

```
/dashboard/users
```

> code

```javascript
// src/dashboard/users/index.jsx
```

### Add a user

To add a new user visit the following url and fill up the form

```
/dashboard/users/add
```

> code

```javascript
// src/dashboard/users/add.jsx
```

### Add a user

To add a new user visit the following url and fill up the form

```
/dashboard/users/add
```
