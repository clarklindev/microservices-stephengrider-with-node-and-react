# Microservices

- [microservices-with-node-js-and-react](https://www.udemy.com/course/microservices-with-node-js-and-react/)

- given /exercise_files

## Table of contents

- [Section 01 - Fundamental Ideas Around Microservices (46min)](#section-01---fundamental-ideas-around-microservices-46min)
- [Section 02 - A Mini Microservices App (3hr35min)](#section-02---a-mini-microservices-app-3hr35min)
- [Section 03 - Running Services with Docker (30min)](#section-03---running-services-with-docker-30min)
- [Section 04 - Orchestrating Collections of Services with Kubernetes (3hr25min)](#section-04---orchestrating-collections-of-services-with-kubernetes-3hr25min)
- [Section 05 - Architecture of Multiservice Apps (1hr6min)](#section-05---architecture-of-multiservice-apps-1hr6min)
- [Section 06 - Leveraging a Cloud Environment for Development (47min)](#section-06---leveraging-a-cloud-environment-for-development-47min)
- [Section 07 - Response Normalisation Strategies (1hr58min)](#section-07---response-normalisation-strategies-1hr58min)
- [Section 08 - Database Management and Modeling (1hr27min)](#section-08---database-management-and-modeling-1hr27min)
- [Section 09 - Authentication Strategies and Options (2hr48min)](#section-09---authentication-strategies-and-options-2hr48min)
- [Section 10 - Testing Isolated Microservices (1hr22min)](#section-10---testing-isolated-microservices-1hr22min)
- [Section 11 - Integrating a Server Side Rendered React App (3hr01min)](#section-11---integrating-a-server-side-rendered-react-app-3hr01min)
- [Section 12 - Code Sharing and Re-use Between Services (52min)](#section-12---code-sharing-and-re-use-between-services-52min)
- [Section 13 - Create-Read-Update-Destroy Server Setup (2hr28min)](#section-13---create-read-update-destroy-server-setup-2hr28min)
- [Section 14 - NATS Streaming Server - An Event Bus Implementation (2hr57min)](#section-14---nats-streaming-server---an-event-bus-implementation-2hr57min)
- [Section 15 - Connecting to NATS in a Node.js World (1hr22min)](#section-15---connecting-to-nats-in-a-nodejs-world-1hr22min)
- [Section 16 - Managing a NATS Client (1hr37min)](#section-16---managing-a-nats-client-1hr37min)
- [Section 17 - Cross-Service Data Replication in Action (2hr44min)](#section-17---cross-service-data-replication-in-action-2hr44min)
- [Section 18 - Understanding Event Flow (30min)](#section-18---understanding-event-flow-30min)
- [Section 19 - Listening for Events and Handling Concurrency Issues (4hr13min)](#section-19---listening-for-events-and-handling-concurrency-issues-4hr13min)
- [Section 20 - Worker Services (1hr36min)](#section-20---worker-services-1hr36min)
- [Section 21 - Handling Payments (2hr40min)](#section-21---handling-payments-2hr40min)
- [Section 22 - Back to the Client (1hr43min)](#section-22---back-to-the-client-1hr43min)
- [Section 23 - CI/CD (2hr17min)](#section-23---cicd-2hr17min)
- [Section 24 - Basics of Docker (3hr3min)](#section-24---basics-of-docker-3hr3min)
- [Section 25 - Basics of TypeScript (5hr42min)](#section-25---basics-of-typescript-5hr42min)
- [Section 26 - Bonus (1min)](#section-26---bonus-1min)

---

## Section 01 - fundamental ideas around Microservices (46min)

- each feature gets its own `service` (database)

### Database-per-service

- services do NOT directly access other services database (database-per-service pattern)
  - services can run independently of other services (reliability (single point of failure): db failure -> all fail, and difficult to scale (seperate db so only scale what is needed))
  - database schema changes wont affect other services
  - some services run better on different type of db (eg mongo vs sql)

### communication strategies between services

- sync
- async

#### sync

- pros -> service D wont need a database
- cons -> dependency between services (only as fast as slowest service)
- cons -> failure causes overall failure

#### async

- async communication with events (event bus handles events)
  - method 1:
    - services connect to event bus (single point of failure) and create/receive events (event type + data) which pass-on to/from event bus
    - has the downsides of synchronous communication + additional problems
  - method 2 (the way we will use it):
    - services emit events when something happens (picked up by db of service)
    - simultaneously an event is emitted to event bus (broadcast to anyone listening for specific event) -> event picked up by service D's created database (which is combination of all required data required by service D)
    - pros - service D will have 0 dependencies on other services
    - pros - fast
    - cons - duplicate data

---

## Section 02 - a mini microservices app (3hr35min)

### 11. App overview

- App: Blog post (allow users to make posts (titles) and others can add comments)

- `src/blog-boilerplate` boiler plate code for Sections 2, 3, and 4
- download:

  - [Docker desktop](www.docker.com) - containerization software
  - [Skaffold](https://skaffold.dev/) - Skaffold handles the workflow for building, pushing and deploying your application
  - [Postman](https://www.postman.com/) - testing api

- NOTE: if \_lock files given, use that..to ensure same package versions -> ie. use whatever given project files use, eg. npm, yarn or pnpm
- NOTE: DO NOT USE THIS PROJECT AS A TEMPLATE FOR FUTURE MICROSERVICES -> WILL HAVE A BETTER TEMPLATE TO USE
- TODO: we are creating a site that allows creating posts (title) and allow comments on the post. there is comment counter

- resources that will need services
  - posts service
  - comments service (tied to a post)
- determine the responsibility of each service

### 12. project setup

- react app -> src/client
- posts -> src/posts
  - express
  - cors
  - axios
  - nodemon
- comments -> src/comments
  - express
  - cors
  - axios
  - nodemon

### 13. express-based project for `Posts` service

- create a post (/POST) POSTMAN -> body: {title:string}
- list all posts (/GET)
- the use of an object `posts` to store new posts
- when creating a new post generate a random id (randomBytes) and convert to hex `.toString('hex')`
- when user sends json data, `bodyParser` ensures data gets parsed as json

```js
//src/posts/index.js
import express from "express";
import bodyParser from "body-parser";
import { randomBytes } from "crypto";

const app = express();
app.use(bodyParser.json());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  res.status(201).send(posts[id]); //201 - resource created
});

app.listen(4000, () => {
  console.log("Listening on 4000");
});
```

### 14. testing post service

- using POSTMAN
- POST -> `http://localhost:4000/`
  -> body -> RAW -> JSON -> {"title":string}
  -> Headers -> Content-Type -> application/json

- GET -> `http://localhost:4000/`
  -> Headers -> Content-Type -> application/json

### 15. express-based project for `Comments` service

- create a comment (tied to a post)
- list all comments (comments related to a specific post)
- Use a different port to `posts`
- `:id/comments` -> comments of an id (array of objects)
- `req.params.id` access id param in url

```js
//src/comments/index.js
import express from "express";
import bodyParser from "body-parser";
import { randomBytes } from "crypto";

const app = express();
app.use(bodyParser.json());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content });

  commentsByPostId[req.params.id] = comments;

  res.status(201).send(comments);
});

app.listen(4001, () => {
  console.log("Listening on 4001");
});
```

### 16. testing comments

- POSTMAN
- POST -> `http://localhost:4001/123/comments`
  -> Headers -> Content-Type -> application/json
  -> body -> RAW -> JSON -> {"content":"I am a comment"}

- GET -> `http://localhost:4001/`
  -> Headers -> Content-Type -> application/json

### 17-25. react app

- react app to use the microservices
- App -> PostCreate
- App -> PostList
- App -> PostList -> CommentList
- App -> PostList -> CommentCreate

```js
//src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
```

- note: public/index.html
- add bootstrap cdn:

```html
<!-- ... -->

<link
  rel="stylesheet"
  href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
  integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
  crossorigin="anonymous"
/>

<!-- ... -->
```

- PostCreate -> has a form with `onSubmit` that posts to localhost:4000 (posts)
- form handler has `event.preventDefault();`

```js
await axios.post("http://localhost:4000/posts", {
  title,
});
```

### 21. CORS ERRORS

- cors requests errors -> anytime we try access a domain/port or subdomain that is different from the url we are trying to make request to.
- eg. localhost:3000 trying to access localhost:4000
- localhost:4000 has to configure the server to allow cors

```
npm i cors
```

```js
import cors from "cors";

//...
const app = express();
app.use(bodyParser.json());
app.use(cors());
```

### 22. fetching and rendering posts

- src/client/App.js

```js
//client/src/App.js

import React from "react";
import PostCreate from "./PostCreate";
import PostList from "./PostList";

const App = () => {
  return (
    <div className="container">
      <h1>Create Post</h1>
      <PostCreate />
      <hr />
      <h1>Posts</h1>
      <PostList />
    </div>
  );
};
export default App;
```

### 23. creating comments

- client/src/CommentCreate.js
- CommentCreate needs to know the id of the post

```js
const CommentCreate = ({ postId }) => {};
```

### 24. displaying comments

- client/src/CommentList.js

```js
//client/src/CommentList.js

import React, { useState, useEffect } from "react";
import axios from "axios";

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);

  const fetchData = async () => {
    const res = await axios.get(
      `http://localhost:4001/posts/${postId}/comments`
    );

    setComments(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderedComments = comments.map((comment) => {
    return <li key={comment.id}>{comment.content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
```

### 26. request minimization strategies

- PROBLEM -> we are making one request (for posts' comments) for every post we have fetched
- REQUIRED -> a single request for post AND also all associated comments

### 27. async solution

- post service (emits an event when a post is created) -> event broker (receives events sends them to interested parties)
- comments service (emits an event when a comment is created) -> event broker (receives events sends them to interested parties)
- NEW: queries service (listens for when post or comment is created - assembles all blogs and comments into efficient data structure)

### The Queries service

- the queries service listens for new post and comment events and takes information it needs
- CONS - is that there is data duplication
- PROS - faster / less dependencies

### 29. Event Bus overview

- there are different implementations of event bus: RabbitMQ, Kafka, NATS
- what they do? they receive events then publishes them to listeners
- these implementations have subtle differences that make async communication easier or harder
- TODO: express based event bus
  - Post service -> POST /events ( localhost:4000/events)
  - Comments service -> POST /events ( localhost:4001/events)
  - Query service -> POST/events ( localhost:4002/events)
- Event bus will receive events from `post` OR `comments` OR `query` and send the same event to the services (\*including the sender)

### 30. node and unhandled promise rejections
- NOTE: Unhandled Promise Rejections are now treated as errors instead of warnings and will cause the servers to crash.
- FIX: you'll need to add a catch block to every request of the event-bus/index.js

```js
axios.post("http://localhost:4000/events", event).catch((err) => {
  console.log(err.message);
});
axios.post("http://localhost:4001/events", event).catch((err) => {
  console.log(err.message);
});
axios.post("http://localhost:4002/events", event).catch((err) => {
  console.log(err.message);
});
res.send({ status: "OK" });
```

### 31. basic event bus implementation
- event-bus/
- as described, event bus has event handler for post /events, when it receives this (req.body), it will make calls to 
  - post /events, sending the event
  - comments /events, sending the event
  - query /events, sending the event

### 32. emmiting events (post service)
- event-bus/src/index.js is running..
- posts/src/index.js sends event

```js
//posts/src/index.js

//...

  await axios.post('http://localhost:4005/events', {
    type:'PostCreated',
    data:{
      id, title
    }
  });

//...
```

### 33. emiting events (comment event)
- comments/src/index.js

```js
  //...

  await axios.post('localhost:4005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: req.params.id
    }
  })
```

### 34. receiving events
- the services need to be able to receive events (listen for events from app)
- NOTE: if you test (client), all 4 services need to be running (comments, event-bus, posts, client)

```js
//posts/index.js
app.post('/events', (req, res)=>{
  console.log('received event: ', req.body.type);

  res.send({});
});

```

```js
//comments/index.js
app.post('/events', (req, res)=>{
  console.log('received event: ', req.body.type);

  res.send({});
});

```


## section 03 - running services with docker (30min)

## section 04 - orchestrating collections of services with kubernetes (3hr25min)

## section 05 - architecture of multiservice apps (1hr6min)

## section 06 - leveraging a cloud environment for development (47min)

## section 07 - response normalisation strategies (1hr58min)

## section 08 - database management and modeling (1hr27min)

## section 09 - authentication strategies and options (2hr48min)

## section 10 - testing isolated microservices (1hr22min)

## section 11 - integrating a server side rendered react app (3hr01min)

## section 12 - code sharing and re-use between services (52min)

## section 13 - create-read-update-destroy server setup (2hr28min)

## section 14 - NATS streaming server - an event bus implementation (2hr57min)

## section 15 - connecting to NATS in a nodejs world (1hr22min)

## section 16 - managing a NATS client (1hr37min)

## section 17 - cross-service data replication in action (2hr44min)

## section 18 - understanding event flow (30min)

## section 19 - listening for events and handling concurrency issues (4hr13min)

## section 20 - worker services (1hr36min)

## section 21 - handling payments (2hr40min)

## section 22 - back to the client (1hr43min)

## section 23 - CI/CD (2hr17min)

## section 24 - basics of Docker (3hr3min)

## section 25 - basics of typescript (5hr42min)

## section 26 - bonus (1min)
