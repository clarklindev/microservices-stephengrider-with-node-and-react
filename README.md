# Microservices

- Build, deploy, and scale an E-Commerce app using Microservices built with Node, React, Docker and Kubernetes

- [microservices-with-node-js-and-react](https://www.udemy.com/course/microservices-with-node-js-and-react/)

- given /exercise_files
- NOTE: `section01-04-blog` is for sections 1-4
- NOTE: `section05-ticketing` is for section05 and all sections that continue building on the project

## Table of contents

### Microservices and Docker/Kubernetes/Skaffold

- [Section 01 - Fundamental Ideas Around Microservices (46min)](#section-01---fundamental-ideas-around-microservices-46min)
- [Section 02 - A Mini Microservices App (3hr35min)](#section-02---a-mini-microservices-app-3hr35min)
- [Section 03 - Running Services with Docker (30min)](#section-03---running-services-with-docker-30min)
- [Section 04 - Orchestrating Collections of Services with Kubernetes (3hr25min)](#section-04---orchestrating-collections-of-services-with-kubernetes-3hr25min)

- [Section 05 - Architecture of Multiservice Apps (1hr6min)](#section-05---architecture-of-multiservice-apps-1hr6min)

### Skaffold with Google Cloud Kubernetes

- [Section 06 - Leveraging a Cloud Environment for Development (47min)](#section-06---leveraging-a-cloud-environment-for-development-47min)

### Working with data and error handling

- [Section 07 - Response Normalisation Strategies (1hr58min)](#section-07---response-normalisation-strategies-1hr58min)
- [Section 08 - Database Management and Modeling (1hr27min)](#section-08---database-management-and-modeling-1hr27min)

### Authentication

- [Section 09 - Authentication Strategies and Options (2hr48min)](#section-09---authentication-strategies-and-options-2hr48min)

### Testing Microservices

- [Section 10 - Testing Isolated Microservices (1hr22min)](#section-10---testing-isolated-microservices-1hr22min)

### Server-side Rendered (SSR) React app

- [Section 11 - Integrating a Server Side Rendered React App (3hr01min)](#section-11---integrating-a-server-side-rendered-react-app-3hr01min)

### Code-sharing and re-use

- [Section 12 - Code Sharing and Re-use Between Services (52min)](#section-12---code-sharing-and-re-use-between-services-52min)

### CRUD server / testing routes

- [Section 13 - Create-Read-Update-Destroy Server Setup (2hr28min)](#section-13---create-read-update-destroy-server-setup-2hr28min)

### NATS

- [Section 14 - NATS Streaming Server - An Event Bus Implementation (2hr57min)](#section-14---nats-streaming-server---an-event-bus-implementation-2hr57min)
- [Section 15 - Connecting to NATS in a Node.js World (1hr22min)](#section-15---connecting-to-nats-in-a-nodejs-world-1hr22min)
- [Section 16 - Managing a NATS Client (1hr37min)](#section-16---managing-a-nats-client-1hr37min)

### Data-replication across services

- [Section 17 - Cross-Service Data Replication in Action (2hr44min)](#section-17---cross-service-data-replication-in-action-2hr44min)

### Events

- [Section 18 - Understanding Event Flow (30min)](#section-18---understanding-event-flow-30min)
- [Section 19 - Listening for Events and Handling Concurrency Issues (4hr13min)](#section-19---listening-for-events-and-handling-concurrency-issues-4hr13min)

### Worker services

- [Section 20 - Worker Services (1hr36min)](#section-20---worker-services-1hr36min)

### Payments

- [Section 21 - Handling Payments (2hr40min)](#section-21---handling-payments-2hr40min)
- [Section 22 - Back to the Client (1hr43min)](#section-22---back-to-the-client-1hr43min)

### CI/CD

- [Section 23 - CI/CD (2hr17min)](#section-23---cicd-2hr17min)

### Docker

- [Section 24 - Basics of Docker (3hr3min)](#section-24---basics-of-docker-3hr3min)

### Typescript

- [Section 25 - Basics of TypeScript (5hr42min)](#section-25---basics-of-typescript-5hr42min)

---

#### Section 1-4 summary

- learnt about movement of data between services
- sync and async communication
- async deals with communicating changes using events sent to an event bus
- with async - each service is self sufficient (independent of other services)
- docker - package services
- kubernetes -> deploy + scale services

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
import express from 'express';
import bodyParser from 'body-parser';
import { randomBytes } from 'crypto';

const app = express();
app.use(bodyParser.json());

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/posts', (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  res.status(201).send(posts[id]); //201 - resource created
});

app.listen(4000, () => {
  console.log('Listening on 4000');
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
import express from 'express';
import bodyParser from 'body-parser';
import { randomBytes } from 'crypto';

const app = express();
app.use(bodyParser.json());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content });

  commentsByPostId[req.params.id] = comments;

  res.status(201).send(comments);
});

app.listen(4001, () => {
  console.log('Listening on 4001');
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
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
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
await axios.post('http://localhost:4000/posts', {
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
import cors from 'cors';

//...
const app = express();
app.use(bodyParser.json());
app.use(cors());
```

### 22. fetching and rendering posts

- src/client/App.js

```js
//client/src/App.js

import React from 'react';
import PostCreate from './PostCreate';
import PostList from './PostList';

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

import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
- Event bus (port :4005) receive events from `post` OR `comments` OR `query` and send the same event to the services (\*including the sender)

### 30. node and unhandled promise rejections

- NOTE: Unhandled Promise Rejections are now treated as errors instead of warnings and will cause the servers to crash.
- FIX: you'll need to add a catch block to every request of the event-bus/index.js

```js
//POSTS: 4000
axios.post('http://localhost:4000/events', event).catch((err) => {
  console.log(err.message);
});

//COMMENTS: 4001
axios.post('http://localhost:4001/events', event).catch((err) => {
  console.log(err.message);
});

//QUERY: 4002
axios.post('http://localhost:4002/events', event).catch((err) => {
  console.log(err.message);
});

res.send({ status: 'OK' });
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
  type: 'PostCreated',
  data: {
    id,
    title,
  },
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
    postId: req.params.id,
  },
});
```

### 34. receiving events

- the services need to be able to receive events (listen for events from app)
- NOTE: if you test (client), all 4 services need to be running (comments, event-bus, posts, client)

```js
//posts/index.js
app.post('/events', (req, res) => {
  console.log('received event: ', req.body.type);

  res.send({});
});
```

```js
//comments/index.js
app.post('/events', (req, res) => {
  console.log('received event: ', req.body.type);

  res.send({});
});
```

### 35. Data query service

- /query/index.js
- service which allows listing of post with its comments
- query service will not emit events (no need for axios)
- route handlers for query service:
  - GET /posts (posts + comments)
  - POST /events (receive events type "CommentCreated" and "PostCreated")

### 36. parsing incoming events

- query/index.js
- events of type `PostCreated` and events of type `CommentCreated`:

```js
if (type === 'PostCreated') {
  const { id, title } = data;
  posts[id] = { id, title, comments: [] };
}

if (type === 'CommentCreated') {
  const { id, content, postId } = data;
  const post = posts[postId];
  post.comments.push({ id, content });
}
```

- example of `posts` object

```js
posts ===
  {
    ghgu443: {
      id: 'ghgu443',
      title: 'post title',
      comments: [
        {
          id: 'klfjfs3',
          content: 'comment!',
        },
      ],
    },
    ghgsad12: {
      id: 'ghgu443',
      title: 'post title',
      comments: [
        {
          id: 'klfjfs3',
          content: 'comment!',
        },
      ],
    },
  };
```

```js
//query/index.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  if (type === 'PostCreated') {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId } = data;

    const post = posts[postId];
    post.comments.push({ id, content });
  }

  console.log(posts);

  res.send({});
});

app.listen(4002, () => {
  console.log('Listening on 4002');
});
```

### 37. using query service

- TODO: client (react app) for reading data -> swop out reaching to `Posts service` and `Comments service` and get data directly from `query service` :4002
- this means client/src/PostList.js will hit the query service at port 4002

```js
const fetchPosts = async () => {
  const res = await axios.get('http://localhost:4002/posts');

  setPosts(res.data);
};
```

- this means CommentList wont send another query (it was depending on postId to fetch all comments of a post)

```js
<CommentList comments={post.comments} />
```

### 38. simple feature

- adding a feature: idea of comment moderation (filtering comments eg. with "orange" word)
- comments get "status" property: `pending` (awaiting moderation), `approved`, `rejected`
- assuming moderation will take some time

### 39. issues with commenting filter

#### Option 1 - Moderation communicates event creation to query service (CURRENT DESIGN)

- user submits comment

1. comment service persists the data and submits `CommentCreated` event (to event bus)
2. event bus then sends event to all services (including moderation service)
3. moderation service has to complete before it returns a message ( type `CommentModerated` -> status (eg `approved`)) to event Bus
4. event bus then sends ( type `CommentModerated` -> status (eg `approved`)) event all services of app (including query service)

- PROBLEM: the problem is moderation is not instant and can take time (eg if human required to moderate), design like this everything stops until moderation step is complete

### 40. Option 2

#### Option 2 - Moderation updates status at both comments AND query services

1. comment service persists the data and submits `CommentCreated` event (to event bus)
2. event bus then sends event to all services (including moderation service)

- AND query service (where the event will be processed and persisted default status: `pending`) while it waits for moderation

3. moderation service has to complete before it returns a message ( type `CommentModerated` -> status (eg `approved`)) to event Bus
4. event bus then sends ( type `CommentModerated` -> status (eg `approved`)) event all services of app (including query service)
5. query service updates its status to "approved"

- PROBLEM: the query service itself shouldnt need to understand "HOW TO" update a service.
- PROBLEM: because as more and more resources are added, they might have to all update data, (eg. if these other services also have to handle `comments`, then they will all need to handle all the different scenarios in the service too)

### 41. Option 3 - query service only listens for update events (advised implementation method)

- so now the correct way is for the moderation to happen inside the `comments service` itself. it handles all logic around a comment (how to handle and update a comment)
- FIX: use a generic event (`CommentUpdated`) for all the various events being handled inside Comment service
- eg. emit same event type `CommentUpdated` for all event types: CommentModerated, CommentUpvoted, CommentDownvoted, CommentPromoted, CommentAnonymized, CommentSearchable, CommentAdvertised
- so the steps are the same as OPTION 2, BUT..
- step 4. the comment service handles and processes all comment related events.
- because comment service made an update to a comment a generic event `CommentUpdated` is emitted and sent to event Bus
- event bus sends event off to query service
- query updates itself with new prop values
- SOLUTION: in this solution, the query service only needs to know about `CommentUpdated` event.

### 42. moderation service

#### CREATE: moderation service

- the moderation service will watch for events
- RECEIVE from EventBus -> `CommentCreated` at `/events`
- ... then later Moderation service needs to SEND out `CommentModerated` event.

```js
//blog/moderation/index.js
import axios from 'axios';
import express from 'express';
import bodyParser from 'body-parser';
const app = express();
app.use(bodyParser.json());

app.post('/events', (req, res) => {});

app.listen(4003, () => {
  console.log('listening on 4003');
});
```

### 43. adding comment moderation

#### UPDATE: comment service, query service

- update Comment service so comments have 'status' property -> `comments.push({ id: commentId, content, status: 'pending' });`
- emit event -> `CommentCreated` event -> event bus

```js
//blog/comments/index.js
//comment sending to event bus (port: 4005)
//...

await axios.post('http://localhost:4005/events', {
  type: 'CommentCreated',
  data: {
    id: commentId,
    content,
    postId: req.params.id,
    status: 'pending',
  },
});
```

- event bus sends event to `moderation service` AND `query service`
- the query service immediately processes (stores) the comment

```js
//blog/query/index.js
//...
app.post('/events', (req, res) => {
  //...

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data; //includes 'status'
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }
});
```

### 45. Handling moderation

- after comment event is received by event bus, it should be sent to moderation service as well

```js
//blog/event-bus/index.js
//...

app.post('/events', (req, res) => {
  const event = req.body;

  //...

  //MODERATION :4003
  axios.post('http://localhost:4003/events', event).catch((err) => {
    console.log(err.message);
  });

  res.send({ status: 'OK' });
});

//...
```

- the moderation service should look at `CommentCreated` event's 'content' and check (filter)
- the moderation service should emit `CommentModerated` with status `approved` OR `rejected`
- the event will be on req.body: `const {type, data} = req.body`
- the moderation service will post an `CommentModerated` event to `event bus`.

```js
//blog/moderation/index.js
import axios from 'axios';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

app
  .post('/events', async (req, res) => {
    //req.body will contain event
    const { type, data } = req.body;

    if (type === 'CommentCreated') {
      const status = data.content.includes('orange') ? 'rejected' : 'approved';

      await axios.post('https://localhost:4005/events', {
        type: 'CommentModerated',
        data: {
          id: data.id,
          postId: data.postId,
          status,
          content: data.content,
        },
      });
    }
    res.send({});
  })
  .catch((err) => {
    console.log(err.message);
  });

app.listen(4003, () => {
  console.log('listening on 4003');
});
```

### 46. updating comment content

- in the comment service (after event bus sends `CommentModerated` event), comment service should update `status`
- after updating "status", tell other applications by emit `CommentUpdated` event (status should be `approved` or `rejected`)

```js
//blog/comments/index.js
const commentsByPostId = {};

app.post('/events', async (req, res) => {
  console.log('received event: ', req.body.type);

  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    const { postId, id, status, content } = data;

    //find the comments by postId
    const comments = commentsByPostId[postId];

    //find comment in comments
    const comment = comments.find((comment) => {
      return comment.id === id;
    });

    //update comment status
    comment.status = status;

    //send CommentUpdated event to event bus
    await axios.post(`http://localhost:4005`, {
      type: 'CommentUpdated',
      data: {
        id,
        status,
        postId,
        content,
      },
    });
  }

  res.send({});
});

//...
```

### 47. query service listens for CommentUpdated

```js
//blog/query/index.js
//...

if (type === 'CommentUpdated') {
  const { id, content, postId, status } = data;
  const post = posts[postId];

  const comment = post.comments.find((comment) => {
    return comment.id === id;
  });

  //update the actual content
  comment.status = status;
  comment.content = content;
}

//...
```

### 48. rendering comments by status

- we update CommentList so that it renders the comments differently depending on its status
- client/src/CommentList.js
- if its rejected or pending show something else (not the li element)
- NOTE: to test `pending` status, shutdown the `moderation/ service` (port:4003)
- NOTE: if the moderation service was down while the event bus attempted to send an event to it, the event would be lost
- FIX: deal with the missing events (see lesson 49.)

```js
import React from 'react';

const CommentList = ({ comments }) => {
  const renderedComments = comments.map((comment) => {
    let content;

    if (comment.status === 'approved') {
      content = comment.content;
    }

    if (comment.status === 'pending') {
      content = 'comment awaiting moderation';
    }

    if (comment.status === 'rejected') {
      content = 'this comment has been rejected';
    }

    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
```

### 49. missing events

- if the moderation service was down when event bus submitted the event to it
- what if the `query service` only created at a later stage? syncing?

#### option 1: sync requests

- syncing by requesting -> code to get all older posts AND comments
- CONS - syncronous requests...
- CONS - need code (endpoints) to get posts and comments

#### option 2: direct DB access

- direct db access (query service has direct access to posts and comments db)
- CONS - the logic to connect to db needs to be written

#### option 3 (preferred method): store events (Event bus data store)

- example: query service comes online later stage, it can work if it has access to past events..
- TODO: when ANY service emits event to event bus, the event is sent to all services BUT `event Store` also stores the event
- at a later stage, Query service can request past events from `Event bus data store` and check what the last successful event stored was and catchup missing events

### 51. implementing event sync

- TODO: implement option 3
  - ie. stop query service
  - create some posts + comments (query service sends event out -> event-bus should store the event)
  - create an end-point to retrieve all events that have occured (event data stoe)
  - then launch query service -> make sure it can get events from `event bus data store`
  - when query service starts listening on port 4002, it should get list of all events that have been emitted from event-bus

```js
//src/event-bus/index.js

const events = [];
app.post('/events', (req, res) => {
  const event = req.body;
  events.push(event);
  //...
});

app.get('/events', (req, res) => {
  res.send(events);
});
```

```js
//query/index
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};
/*:

//example of post 
post === {
  'ghgu443': {
    id: 'ghgu443',
    title : "post title",
    comments: [
      {
        id: 'klfjfs3',
        content: "comment!"
      }
    ]
  }
}
*/

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === 'CommentUpdated') {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => {
      return comment.id === id;
    });
    //update the actual content
    comment.status = status;
    comment.content = content;
  }
};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  res.send({});
});

app.listen(4002, async () => {
  console.log('Listening on 4002');

  const res = await axios.get('http://localhost:4005/events');
  for (let event of res.data) {
    console.log('processing event', event.type);
    handleEvent(event.type, event.data);
  }
});
```

### summary

- Microservices architecture involves breaking down an application into smaller, independent services that communicate over well-defined APIs.
- This approach enhances reliability, scalability, and maintainability by allowing teams to develop, deploy, and scale services independently.
- It also promotes data encapsulation and efficient event-driven communication, reducing the need for excessive server calls.

## Section 03 - running services with docker (30min)

### 53. deployment issues

- WE HAVE:
  - services (each its own app with port)
  - each service can access each others service via `event Bus`
  - how to deploy? rent a virtual machine (transfer apps to it)
    - with virtual machine you can spin up addtional services (eg. comment service 1,2,3) on `load balancer` on the virtual machine
      - CONS - new service requires additional ports which need to be added and assigned in `Event Bus`.
    - but you can also spread the service across additional virtual machine
      - CONS - if its on a different virtual machine, need to access its `IP address` instead of `localhost`
- FIX: we need to find a way to keep track of all services running in application

### 54. docker

- NOTE: [Section 24 - Basics of Docker (3hr3min)](#section-24---basics-of-docker-3hr3min)
- docker uses containers (isolated computing environment - contains everything required to run an app)
- each docker container runs a service
- additional copies of a service -> spins up additional docker container
- Docker solves the assumptions made about environment (eg. assumption npm is installed and node is installed)
- assumption user knows startup commands to run app

### 55. kubernetes

- kubernetes is used to run a bunch of containers together (via configuration files)

  #### cluster

  - kubernetes cluster is a set of virtual machines (with varying amounts of virtual machines) AKA nodes
  - the services in the nodes still communicate with the `Event bus`
  - requests are handled by a `common communcation chanel` in the cluster -> it figures out how and where to send events

  #### Master

  - a `master` - manages everything in the cluster (these virtual machines)

  #### Config

  - the configuration includes instructions on how to run the service -> which is passed to master

### 56. dont know docker?

- see [Section 24 - Basics of Docker (3hr3min)](#section-24---basics-of-docker-3hr3min)

### 57. notes about docker build output and buildkit

- TODO: building a Docker image of our Posts service
- the most recent versions of Docker will now have "Buildkit" enabled by default.
- buildkit docker build output:

```cmd
<!-- Now, with Buildkit, the final step would say: -->

 => => exporting layers
 => => writing image sha256:ee59c34ada9890ca09145cc88ccb25d32b677fc3b61e921  0.0s

```

#### Disabling Buildkit to match course

- Click the Docker Icon your systray
- Select "Preferences"
- Select "Docker Engine"

```
{
  "features": {
    "buildkit": false
  },
  "experimental": false
}
```

- Apply and Restart.

### 58. dockerizing the post service

- blog/posts/Dockerfile

#### Troubleshoot

note: it is `CMD ["npm", "start"]` NOT `CMD ["npm": "start"]`

```Dockerfile
# blog/posts/Dockerfile
FROM node:14-alphine

WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./ ./

CMD ["npm", "start"]

```

- .gitignore -> the files/folders to ignore when building an image
- run docker eg. id of created image is `cddd85607be243e2b0dd28007520b223dc69477c2423f37663dfe3a2580a78ae`

```cmd
docker run cddd85607be243e2b0dd28007520b223dc69477c2423f37663dfe3a2580a78ae
```

![dockerising post service](exercise_files/udemy-docker-section03-58-dockerising-post-service.png)

### 59. review some basic commands

![running services with docker](exercise_files/udemy-docker-section03-59-running-services-with-docker.png)

- docker build -t docker-id/name-of-project .
- docker run docker-id/name-of-project
- docker run -it docker-id/posts sh
- docker ps
- docker exec -it container-id sh
- docker logs

- is going to remove all docker images that you have on your PC
  `docker rmi $(docker images -a -q)`

- deletes deployment
  `kubectl delete deployment <deployment_name>`

- is going to create an image without any pre-cached stuff.
  `docker build --no-cache -t <your_tag>/posts .`

- pushes to docker image storage
  `docker push <your_tag>/posts`

- to recreate deployment. It is going to fetch new image from remote.
  `kubectl apply posts-depl.yaml`

### list all docker images

- list all docker images: `docker images -a`

### deleting image by id

- `docker rmi -f <image_id>`

#### delete all images with tags `<none>`

- docker image prune

-If you want to remove all images with `<none>` tags in one go:

- `docker rmi -f $(docker images -q -f "dangling=true")`

### 60. dockerizing the other services

- the other services in blog/ have the same node setup and command to start the service so you can copy+paste files from Post service:
  - .dockerignore (node_modules)
  - Dockerfile

#### test

```cmd
//event-bus/

docker build -t clarklindev/event-bus .
docker run clarklindev/event-bus
```

## Section 04 - orchestrating collections of services with kubernetes (3hr25min)

## 62. installing kubernetes

- Kubernetes -> tool for running a bunch of different containers
- give kubernetes configuration to instruct it how to run AND how to interact with each other

- Install option -> Docker for Windows / Mac /linux

  #### mac

  - RECOMMENDED -> macOS users should use Docker Desktops kubernetes instead of Minikube

  #### Linux

  - RECOMMENDED -> Minikube

  #### Windows -> enable kubernetes

  - RECOMMENDED -> Windows users should use -> Docker Desktop with WSL2
  - docker toolbox icon -> preferences -> kubernetes -> enable kubernetes -> restart

- NOTE: make sure Docker is running (NOT AS ADMINISTRATOR but normal user)
- NOTE: for me, windows 11 kubernetes option from docker-desktop took a while to startup

```
kubectl version
```

```cmd out
PS C:\Users\laptop> kubectl version
Client Version: v1.30.2
Kustomize Version: v5.0.4-0.20230601165947-6ce0bf390ce3
Server Version: v1.30.2
```

- Docker-desktop -> you should see 'kubernetes running' (status bar)

![docker-desktop kubernetes running status](exercise_files/udemy-docker-section04-64-a-kubernetes-tour.png)

### TROUBLESHOOT DOCKER KUBERNETES

```
PS C:\Windows\system32> kubectl version
Client Version: v1.30.2
Kustomize Version: v5.0.4-0.20230601165947-6ce0bf390ce3
Unable to connect to the server: dial tcp [::1]:8080: connectex: No connection could be made because the target machine actively refused it.
```

#### Windows

- `kubectl config get-contexts` -> `kubectl config use-context docker-desktop`
- on Windows 11 -> from Q&A -> The only thing that worked for me was while in Docker Desktop I clicked on the "Troubleshoot" bug icon at the top. Then clicked the "Clean / Purge data" button. In the pop-up I selected all three check boxes ("Hyper-V", "WSL 2", "Windows Containers") and clicked the "Delete" button. After it completed Docker and Kubes status both went green.
- deleted the .kube folder in my user directory
- Delete the folder (hidden folder) `C:\ProgramData\DockerDesktop\pki` OR `C:\Users\<user_name>\AppData\Local\Docker\pki`

### update .kube/config

- update kube config file `c:\Users\<user folder>\.kube\config` -> update clusters server -> `server: https://localhost:6443`
- why this works? -> When you use localhost in the server URL (e.g., server: https://localhost:6443), your system will attempt to resolve localhost using DNS resolution (starting with the local hosts file).

```c:\Users<user folder>.kube\config
    server: https://localhost:6443
```

### update system32/drivers/etc/host

- update c:/windows/system32/drivers/host
- `c:\Windows\System32\drivers\etc\hosts` (AS ADMINISTRATOR)

```hosts
127.0.0.1 kubernetes.docker.internal
localhost kubernetes.docker.internal
```

#### Docker desktop for mac

- [Q&A](https://www.udemy.com/course/microservices-with-node-js-and-react/learn/lecture/19099722#questions/10956202) - By default, the server address for the cluster in the kube config file is set to `https://kubernetes.docker.internal:<port number>`. For Docker Desktop for Mac version 2.3.0.3 and K8s version 1.16.5, this server address needs to be changed to `https://localhost:<port number>`, where the port number is usually something like 6443. Once I made this change to the server address, I was finally able to connect to the local kube server and use the kubectl command without any issues.
- kubernetes takes the docker image created and `deploys` and `manages` this instance of image (as a container) in the kubernetes cluster (node -> Virtual Machine)
- a config file for kubernetes -> tells it how to manage the image and host it as container in `kubernetes cluster of nodes`
- config also describes the access rights
- `kubectl` is tool used to interact with the kubernetes cluster
- kubernetes tries to find the image (described in config file) first from local computer
- if it cant find it, then it looks in docker-hub

## 63. NOTE on MiniKube

- Install option -> Install method with Docker-Toolbox (STATUS: unstable) or Linux (need to install [minikube](kubernetes.io/docs/tasks/tools/install-minikube))
  - Minikube is an alternative option to using Docker Desktop's built-in Kubernetes.

## 64. kubernetes tour

#### terminology

- NOTE: a `pod` OR `container` by definition is more or less the same thing.
  - pod -> wraps a container
  - pod -> can have multiple containers inside of it
- Deployment -> kubernetes creates a `deployment` to manage the containers (pods)
  - it takes in the config file
  - makes sure correct number of pods
  - and makes sure they are running
- Kubernetes service -> gives access to running pods/containers (via easy url) -> manages access of these pods (microservices) to other nodes in the kubernetes cluster
  - ie. other services in kubernetes cluster reach out to the service instead of directly accessing other pods

### 65. summary of kubernetes terminology

![udemy-docker-section04-65-kubernetes-terminology.png](exercise_files/udemy-docker-section04-65-kubernetes-terminology.png)

### 66. kubernetes config file

- the config file kubernetes uses to create (pods, services, deployments)
- (pods, services, deployments) are collectively known as `Objects`
- written in YAML
- always store these config with project source code (they are documentation)
- NOTE: you can create `objects` without config file - BUT DONT DO THIS..
  - unless its only for testing purposes

### 67. - creating a pod

- we use `apply` command to create container in kubernetes cluster
- NOTE: later we correct this and say `DEPLOYMENTS` manage pods in kubernetes cluster
- TODO: create a config file -> create a pod that runs a container from the `Posts service`
- NOTE: ensure Docker is running
- TODO: rebuild the docker image of posts (with version): `docker build -t clarklindev/posts:0.0.1 .`

```cmd out
 => => exporting layers 0.3s
 => => writing image sha256:1dbeadbb183283db3ceee72c451ea79f3e83d33ab384292d7b60c62e74c1b734 0.0s
 => => naming to docker.io/clarklindev/posts:0.0.1 0.0s
```

- TODO: create the directories in project folder: `infra/k8s` infrastructure
- NOTE: `k8s` short for kubernetes
- TODO: create a posts.yaml file (NOTE: indentation is important in YAML)

```yaml
# blog/infra/k8s/posts.yaml

apiVersion: v1
kind: Pod
metadata:
  name: posts
spec:
  containers:
    - name: posts
      image: clarklindev/posts:0.0.1
      resources:
        limits:
          memory: '128Mi'
          cpu: '500m'
```

- tell kubernetes to use this config file
- go to k8s folder -> tell kubernetes to use this config file:
- note: .yaml (call apply with file name and file extension)

```cmd
//blog/infra/k8s/
kubectl apply -f posts.yaml
```

- should get: `pod/posts created`.
- NOTE: later we use deployments (posts-depl.yaml)

### look at pods running inside cluster

```cmd
kubectl get pods
```

### 69. PODS - understanding pod specs

- note: the `-` dash under `containers` means its an array (so there could be more containers added)
- note: `name` can be anything you decide
- NOTE: spec -> `image` if you specify `:latest` or dont specify, it assumes to fetch from docker-hub, if you specify version, will first check local computer for the image.
  ![kubernetes pod spec](exercise_files/udemy-docker-section04-69-pod-spec.png)

### 70. common kubectl commands

- just as Docker has its own commands, Kubectl is commands for containers
  ![common Kubectl commands](exercise_files/udemy-docker-section04-70-common-kubectl-commands.png)
- `kubectl apply -f posts.yaml`
- `kubectl exec -it posts sh`
- `kubectl delete pod posts`
- `kubectl get pods`
- `kubectl describe pod [podname]` -> look at events inside pod

### 71. kubectl alias

#### Powershell

- to create an alias, open powershell -> `$PROFILE` -` C:\Users\<user>\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1`
- create profile if it doesnt exist: `New-Item -Path $PROFILE -ItemType File -Force` -> `C:\Users\<user>\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1`
- Open the Profile in a Text Editor: Use Notepad (or any text editor): `notepad $PROFILE`
- Add Your Aliases: In the opened profile file, add your Set-Alias commands. For example:

```
Set-Alias k Kubectl
```

- To apply the changes immediately without restarting PowerShell, run: `. $PROFILE`
- Verify Your Aliases -> `Get-Alias`

### 72. DEPLOYMENTS

- instead of creating pods directly in kubernetes cluster, we create a deployment
- deployment -> kubernetes object that manages a set of pods
- kubernetes Deployments job is:

  1. maintain the number of running pods specified
  2. deployment takes care of pod updates:

  #### update STEPS:

  1. create updated pods
  2. replace old pod instances with updated
  3. delete old pods

- you mainly use deployments by reading deployment logs

### 73. creating a deployment

- config file for deployment
- //blog/infra/k8s/posts-depl.yaml (note: `depl` stands for deployment)
- replicas -> number of pods to create running a particular image.
- NOTE: deployments have to figure out which pods it has to manage (`selector`, `metadata` help with this)
- selector -> look at all pods with label `x`
- template->metadata -> specify that pod will have label of `x`
- spec -> pod specs

```yaml
# blog/infra/k8s/posts-depl.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: posts-depl
spec:
  replicas: 1
  selector:
    matchLabels:
      app: posts
  template:
    metadata:
      labels:
        app: posts
    spec:
      containers:
        - name: posts
          image: clarklindev/posts:0.0.1

          resources:
            limits:
              memory: '128Mi'
              cpu: '500m'
```

- you can apply the posts-depl.yaml to the kubernetes cluster
- from blog/infra/k8s/ folder:
- create the pod...

```cmd
Kubectl apply -f posts-depl.yaml
```

- expect cmd status update `deployment.apps/posts-depl created`

### 74. common commands around deployments

- deployment commands  
  ![kubernetes deployment commands](exercise_files/udemy-docker-section04-74-deployment-commands.png)

- `kubectl get deployments`
- `kubectl get pods`
- `kubectl delete pod posts-depl-7f7567b88c-fmr2q`

  - if you delete a pod created by deployment, the deployment will re-create the pod
  - after pod deleted, if you run `kubectl get pods` again, you will see a new pod with different name eg. name `posts-depl-7f7567b88c-5nkbv`

  ```cmd out
  NAME                          READY   STATUS    RESTARTS       AGE
  posts                         1/1     Running   1 (3m3s ago)   4h18m
  posts-depl-7f7567b88c-5nkbv   1/1     Running   0              49s
  ```

- `kubectl describe deployment [depl name]` -> import part is `events`
- `kubectl apply -f [config file name]` -> deploy to kubernetes
- `kubectl delete deployment [depl name]` -> pods related to deployment are also deleted
- `kubectl delete pod posts` -> do not create pods manually/directly (if anything happens, you wont have way to start them back up)

### 75. updating deployments

#### METHOD 1 (PREFERED METHOD IS METHOD 2)

- NOTE: Method 2 is preffered because method 1 relies on updating the version number in config

#### STEPS

1. make changes to project code
2. rebuild image (tag NEW image version):

```cmd
//blog/posts/
docker build -t clarklindev/posts:0.0.5 .
```

3. in deployment config -> update version of the image

```yaml
<!-- blog/infra/k8s/posts-depl.yaml -->

<!-- ... -->

spec:
  containers:
    - name: posts
      image: clarklindev/posts:0.0.5
```

4. tell kubernetes to use this updated file:

- `kubectl apply -f [depl file name]`

  ```cmd
  //infra/k8s/
  kubectl apply -f posts-depl.yaml
  kubectl get deployments
  kubectl get pods
  kubectl logs posts-depl-7488f87775-vph87

  ```

### 76. preferred deployment method

#### METHOD 2

- tells kubernetes to automatically get the latest version

1. the deployment ALWAYS uses the `latest` tag in pod `spec` section (or image version should be omitted)

```yaml
//blog/infra/k8s
# ...

    spec:
      containers:
      - name: posts
        image: clarklindev/posts:latest

# ...
```

- need to apply it to kubernetes cluster to let it know to use latest image
- blog/infra/k8s -> `kubectl apply -f posts-depl.yaml`
- `kubectl get deployments`

2. make an update to your code

3. rebuild the image

```cmd
//blog/posts/
docker build -t clarklindev/posts .
```

4. push image to docker hub
   NOTE: you need to be logged-in on docker-desktop / docker-hub

```
//blog/posts/
docker push clarklindev/posts
```

```cmd
kubectl get deployments
```

```cmd out
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
posts-depl   1/1     1            1           9h
```

5. tell deployment to use this latest version

- run command: `kubectl rollout restart deployment [depl_name]`

```cmd
//posts/
kubectl rollout restart deployment posts-depl
kubectl get deployments
kubectl get pods

kubectl logs posts-depl-7b87fbf7f4-clzk7

```

### 77. networking with services

#### Access a pod with a running container through a service

- Services in kubernetes is an object which is configured via config file (just like pods and deployments)
- Services used to setup communication (event bus) between pods or communicate with a pod from outside the cluster

#### 4 types of services

![Kubernetes - types of services](exercise_files/udemy-docker-section04-77-types-of-services.png)

1. cluster IP -> (we use often) sets up an easy to remember url to access a pod (only exposes pods in the cluster)

- for communication between pods in a kubernetes cluster. eg. `infra/k8s/posts-depl.yaml`, `infra/k8s/event-bus-depl.yaml`

2. Node port -> makes pods accessible from outside the cluster. (usually for dev purpose only) - eg. `infra/k8s/posts-srv.yaml`
3. load balancer -> (we use often) make a pod accessible from outside the cluster. (correct way to expose pod to outside world)
4. external name -> redirects an in-cluster request to CNAME url ..

### 78. creating a NodePort service

- Node Port -> service for single pod setup
- create config file and apply to cluster
- label/selector of config file -> is similar to html/css selector
- nodeport service - it needs to know the apps to expose (`selector: app: posts`), and `posts-depl.yaml` has already defined this label of `posts`
- ports are all the ports to expose (its what the apps' server port is listening on)

```yaml
# infra/k8s/posts-srv.yaml
apiVersion: v1
kind: Service
metadata:
  name: posts-srv
spec:
  type: NodePort
  selector:
    app: posts
  ports:
    - name: posts
      protocol: TCP
      port: 4000
      targetPort: 4000
```

- targetPort vs Port:
- NOTE: the Port and TargetPort do not have to be the same.  
  ![udemy-docker-section04-78-nodeport-service.png](exercise_files/udemy-docker-section04-78-nodeport-service.png)

### 79. Accessing NodePort services

- DOCKER IS RUNNING
- infra/k8s/posts-srv.yaml -> can be applied to the kubernetes cluster
- from infra/k8s/ directory: `kubectl apply -f posts-srv.yaml` -> "[service created]"

- TODO: list all services -> `kubectl get services`
  results:
  `kubernetes` (default service)
  `posts-srv`
  ...
  - NOTE: `posts-srv` has type `NodePort`
  - NOTE: has port 4000:30345/TCP (the 3xxxx port is randomly assigned)
  - NodePort -> we use the 3xxxx port range to access the service from outside the cluster
    - REMINDER: this nodePort (3xxxx) is just for development purposes
- to see what is the node port, you can run describe command on posts-srv -> `kubectl describe service posts-srv`

#### access posts pod (from outside the cluster)

1. get the NodePort: `kubectl describe service posts-srv`

```cmd
Name:                     posts-srv
Namespace:                default
Labels:                   <none>
Annotations:              <none>
Selector:                 app=posts
Type:                     NodePort
IP Family Policy:         SingleStack
IP Families:              IPv4
IP:                       10.109.124.251
IPs:                      10.109.124.251
Port:                     posts  4000/TCP
TargetPort:               4000/TCP
NodePort:                 posts  30345/TCP
Endpoints:                10.1.0.71:4000
Session Affinity:         None
External Traffic Policy:  Cluster
Events:                   <none>
```

- NOTE: `NodePort:                 posts  30345/TCP`

2.  on MAC -> `Docker Toolbox with minikube` -> using minikube -> run `minikube ip` -> gives an ip -> to access service - eg. ip:[NodePort]/posts

OR

on WIN -> `Docker for windows` -> use http://localhost:[NodePort]/posts

- ie to access this posts pod (kubernetes cluster) via nodePort from the outside:
- browser -> `http://localhost:30345/posts`

### 80. setting up Cluster IP service

- GOAL of cluster IP service is to expose a pod to other pods in the kubernetes cluster
  - each pod has/is governed by a `cluster ip service`
- the app has `posts` which sends event to `event-bus` which then sends events to all other services
- TODO: setup service to allow `posts` and `event-bus` to communicate with each other
- pods in kubernetes cluster gets assigned ip address so we dont know ahead of time the ip.
- `Posts pod` sends request to `cluster ip service` which governs access to the `Event-bus` pod
- `Event-bus pod` sends request to `cluster ip service` which governs access to the `Posts` pod
- tool that automates the wiring up of `cluster ip service` to pod.

![posts + event-bus communication](exercise_files/udemy-docker-section04-80-posts+eventbus-communication.png)

1. build image for event-bus
2. push to docker-hub
3. create deployment for event-bus (auto creates pod)
4. create cluster ip service -> for event-bus AND for posts
5. wire it up

### 81. build a deployment for the event bus

1. build image for event-bus

- from blog/event-bus/ folder:

```
docker build -t clarklindev/event-bus .
```

2. push to docker-hub

```
docker push clarklindev/event-bus
```

3. create a deployment for event-bus

- infra/k8s/event-bus-depl.yaml
- the config is almost identical to posts-depl.yaml
- copy and paste posts-depl.yaml and then replace 'posts' with 'event-bus'

```yaml
# infra/k8s/event-bus-depl.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: event-bus-depl
spec:
  replicas: 1
  selector:
    matchLabels:
      app: event-bus
  template:
    metadata:
      labels:
        app: event-bus
    spec:
      containers:
        - name: event-bus
          image: clarklindev/event-bus:latest
          resources:
            limits:
              memory: '128Mi'
              cpu: '500m'
```

- deploy to kubernetes: goto infra/k8s/ folder -> `kubectl apply -f event-bus-depl.yaml`
- get all pods: `kubectl get pods`

```cmd
NAME                             READY   STATUS    RESTARTS       AGE
event-bus-depl-d8998657d-bg9tc   1/1     Running   0              27s
posts-depl-68fd57c6c4-hlmr9      1/1     Running   1 (102m ago)   15h
```

4. create cluster ip service -> for event-bus AND for posts

- the pods can technically communicate with each other BUT the ip address is variable so cant know this ahead-of-time...therefore we use a `cluster ip service` to give us url

### 82. Adding clusterIP services

- creating a cluster ip service for each pod/container (Posts and Event-bus)
- can create a deployment config for each service (1 config per service)
  OR
- PREFERRED -> combine into single config
  - put the `cluster ip service` config inside the `deployment` file its related to
  - separate with `---`

```yaml
# blog/infra/k8s/event-bus-depl.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: event-bus-depl
spec:
  replicas: 1
  selector:
    matchLabels:
      app: event-bus
  template:
    metadata:
      labels:
        app: event-bus
    spec:
      containers:
        - name: event-bus
          image: clarklindev/event-bus:latest
          resources:
            limits:
              memory: '128Mi'
              cpu: '500m'
---
apiVersion: v1
kind: Service
metadata:
  name: event-bus-srv
spec:
  selector:
    app: event-bus
  ports:
    - name: event-bus
      protocol: TCP
      port: 4005
      targetPort: 4005
```

- from infra/k8s/event-bus-depl.yaml -> `kubectl apply -f event-bus-depl.yaml`
- kubernetes picks up that ONLY event-bus-srv was added...

```cmd-output
deployment.apps/event-bus-depl unchanged
service/event-bus-srv created
```

```cmd
kubectl get services
```

- note `event-bus-srv` -> type is `ClusterIP`

```cmd-output
NAME            TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
event-bus-srv   ClusterIP   10.108.175.133   <none>        4005/TCP         2m10s
kubernetes      ClusterIP   10.96.0.1        <none>        443/TCP          29h
posts-srv       NodePort    10.109.124.251   <none>        4000:30345/TCP   4h24m
```

- NOTE: with the posts-depl.yaml -> `posts-srv` is already used for NodePort so we use `posts-cluster-ip-srv` for the `cluster ip service`

```yaml
# blog/infra/k8s/posts-depl.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: posts-depl
spec:
  replicas: 1
  selector:
    matchLabels:
      app: posts
  template:
    metadata:
      labels:
        app: posts
    spec:
      containers:
        - name: posts
          image: clarklindev/posts:latest
          resources:
            limits:
              memory: '128Mi'
              cpu: '500m'
---
apiVersion: v1
kind: Service
metadata:
  name: posts-cluster-ip-srv
spec:
  selector:
    app: posts
  ports:
    - name: posts
      protocol: TCP
      port: 4000
      targetPort: 4000
```

- from blog/infra/k8s -> `kubectl apply -f posts-depl.yaml`

```cmd-output
deployment.apps/posts-depl unchanged
service/posts-cluster-ip-srv created
```

### 83. how to communicate between services

- from blog/infra/k8s

```cmd
kubectl get services
```

```cmd-output
NAME                   TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
event-bus-srv          ClusterIP   10.108.175.133   <none>        4005/TCP         14m
kubernetes             ClusterIP   10.96.0.1        <none>        443/TCP          30h
posts-cluster-ip-srv   ClusterIP   10.107.163.55    <none>        4000/TCP         36s
posts-srv              NodePort    10.109.124.251   <none>        4000:30345/TCP   4h36m
```

#### communicate: posts TO event bus

- so in posts/ project index.js after sending data to /posts, a call is made to event-bus (:4005)

```js
// /posts/index.js
// await axios.post('http://localhost:4005/events', {
//   type:'PostCreated',
//   data:{
//     id, title
//   }
// });

// UPDATE TO
await axios.post('http://event-bus-srv:4005/events', {
  type: 'PostCreated',
  data: {
    id,
    title,
  },
});
```

- and localhost:4005 only worked when we loaded from local computer
- when using kubernetes, this wont work -> `posts/` needs to reach out and access `event-bus-srv` (cluster ip service) of `event-bus`:
- posts to event-bus' cluster ip service of name: `event-bus-srv`
- posts will request: `http://event-bus-srv:4005`

### communicate: event-bus TO posts

- event-bus to posts' cluster ip service of name: `posts-cluster-ip-srv`
- event-bus will request: `http://posts-cluster-ip-srv:4000`

### 84. updating service addresses

- from blog/infra/k8s/ -> `kubectl get services` to list services/ports
- so in the projects we can now change the url when pods/cluster reach out to other pods/cluster using the service name:
- eg. `posts` code TO `event bus` -> requests should use the service -> `http://event-bus-srv:4005`
- eg. `event-bus` code TO `posts` -> requests should use the service -> `http://posts-cluster-ip-srv:4000`

- after changes... from event-bus/ folder:

  - build: `docker build -t clarklindev/event-bus . `
  - push to docker-hub: `docker push clarklindev/event-bus`

- after changes... from posts/ folder:

  - build: `docker build -t clarklindev/posts .`
  - push to docker-hub: `docker push clarklindev/posts`

- `kubectl get deployments`

```
NAME             READY   UP-TO-DATE   AVAILABLE   AGE
event-bus-depl   1/1     1            1           4h38m
posts-depl       1/1     1            1           29h
```

#### rollout deployments to kubernetes

- tell kubernetes to redeploy
- Deployments:
- `kubectl rollout restart deployment event-bus-depl`
- `kubectl rollout restart deployment posts-depl`

### 85. verifying communication

- `kubectl get pods`

```
NAME                             READY   STATUS    RESTARTS   AGE
event-bus-depl-696fbdbb6-pjt7x   1/1     Running   0          41s
posts-depl-6cd968bbff-xvdq6      1/1     Running   0          30s
```

TODO: test with postman by making a request to `post` micro-service.  
TODO: check `event-bus-depl-696fbdbb6-pjt7x` and `posts-depl-6cd968bbff-xvdq6` are exchanging events by looking at logs

- when we do make a post, `post` should reach out to `event-bus-srv` (event-bus service) emit an event.
- then use `kubectl logs event-bus-depl-696fbdbb6-pjt7x`

- NOTE: we are trying to reach NodePort (posts-srv (for dev purpose))
  - to get the NodePort (3xxxx port number):
    `kubectl get services`

```
NAME                   TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
event-bus-srv          ClusterIP   10.108.175.133   <none>        4005/TCP         156m
kubernetes             ClusterIP   10.96.0.1        <none>        443/TCP          32h
posts-cluster-ip-srv   ClusterIP   10.107.163.55    <none>        4000/TCP         143m
posts-srv              NodePort    10.109.124.251   <none>        4000:30345/TCP   6h59m
```

- to reach `posts-srv` NodePort:

#### POSTMAN

in windows POSTMAN -> `http://localhost:30345/posts`

- headers -> Content-Type -> `application/json`
- body -> raw -> json -> `{ "title": "POST" }`

- EXPECTED SERVER RESPONSE:
- status -> 201 Created

```json
{
  "id": "bf1be6ef",
  "title": "POST"
}
```

- revision of docker commands:
  <!-- is going to remove all docker images that you have on your PC -->
  `docker rmi $(docker images -a -q)`

<!-- deletes deployment -->

`kubectl delete deployment <deployment_name>`

<!-- is going to create an image without any precached stuff. -->

`docker build --no-cache -t <your_tag>/posts .`

<!-- pushes to docker image storage -->

`docker push <your_tag>/posts`

<!-- to recreate deployment. It is going to fetch new image from remote. -->

`kubectl apply posts-depl.yaml`

- get pods `kubectl get pods`

```
NAME                              READY   STATUS    RESTARTS   AGE
event-bus-depl-785cf644c5-wjzz4   1/1     Running   0          9m51s
posts-depl-558dbf9486-qc9sw       1/1     Running   0          9m44s
```

- TODO: vieW logs
  - `kubectl logs posts-depl-558dbf9486-qc9sw`
- EXPECTED -> communication back from event-bus service via `posts-clusterip-srv` -> received event: PostCreated

```cmd
v55
Listening on 4000
received event:  PostCreated
```

### 86. adding Query, moderation, comments services

- TODO (For each service - in respective project folders...):

  1. - update their urls to reachout to `event-bus-srv` (infra/k8s/event-bus-depl.yaml) instead of event-bus at `localhost:4005/events`
  2. - build image

  - blog/comments/ -> `docker build -t clarklindev/comments .` -> `docker push clarklindev/comments`
  - blog/moderation/ -> `docker build -t clarklindev/moderation .` -> `docker push clarklindev/moderation`
  - blog/query/ -> `docker build -t clarklindev/query .` -> `docker push clarklindev/query`

  3. - push to Docker-hub
  4. - create a `deployment` and `cluster_ip service` for each:

  - create `infra/k8s/comments-depl.yaml` \*can copy from event-bus-depl.yaml (change reference to "event-bus" and update port `4001`)
  - create `infra/k8s/query-depl.yaml` \*can copy from event-bus-depl.yaml (change reference to "event-bus" and update port `4002`)
  - create `infra/k8s/moderation-depl.yaml` \*can copy from event-bus-depl.yaml (change reference to "event-bus" and update port `4003`)

  - apply to cluster

    - from 'infra/k8s/' folder...
    - to apply ALL config files at once: `kubectl apply -f .`

    ```cmd-out
    deployment.apps/comments-depl created
    service/comments-srv created
    deployment.apps/event-bus-depl unchanged
    service/event-bus-srv unchanged
    deployment.apps/moderation-depl created
    service/moderation-srv created
    deployment.apps/posts-depl unchanged
    service/posts-cluster-ip-srv unchanged
    service/posts-srv unchanged
    deployment.apps/query-depl created
    service/query-srv created
    ```

  - `kubectl get pods` (list running containers in kubernetes cluster) -> should have status of "Running"
    ```cmd-out
    NAME                               READY   STATUS    RESTARTS   AGE
    comments-depl-6d46896699-xgrjg     1/1     Running   0          88s
    event-bus-depl-785cf644c5-wjzz4    1/1     Running   0          80m
    moderation-depl-5847bbbd45-8jw75   1/1     Running   0          88s
    posts-depl-558dbf9486-qc9sw        1/1     Running   0          80m
    query-depl-5bf4fdd49f-45cbc        1/1     Running   0          88s
    ```
    - if a pod is not running `kubectl describe pod <podname>`

  5. - update eventbus to send event to:
       `http://localhost:4001/events` -> `comments`
       `http://localhost:4002/events` -> `query`,
       `http://localhost:4003/events` -> `moderation`,

  - build: `docker build -t clarklindev/event-bus .`
  - push to docker-hub: `docker push clarklindev/event-bus`
  - get deployments: `kubectl get deployments`

  ```cmd-out
  NAME              READY   UP-TO-DATE   AVAILABLE   AGE
  comments-depl     1/1     1            1           40m
  event-bus-depl    1/1     1            1           36h
  moderation-depl   1/1     1            1           40m
  posts-depl        1/1     1            1           36h
  query-depl        1/1     1            1           40m
  ```

  - deploy: `kubectl rollout restart deployment event-bus-depl`
  - check pods: `kubectl get pods`

### 87. testing communication

- `kubectl get services`

```
NAME                   TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
comments-srv           ClusterIP   10.101.55.88     <none>        4001/TCP         8m56s
event-bus-srv          ClusterIP   10.108.175.133   <none>        4005/TCP         43h
kubernetes             ClusterIP   10.96.0.1        <none>        443/TCP          3d1h
moderation-srv         ClusterIP   10.102.123.71    <none>        4003/TCP         8m56s
posts-cluster-ip-srv   ClusterIP   10.107.163.55    <none>        4000/TCP         43h
posts-srv              NodePort    10.109.124.251   <none>        4000:30345/TCP   47h
query-srv              ClusterIP   10.102.225.172   <none>        4002/TCP         8m56s
```

1. make changes to code: update the urls:

```js
//blog/event-bus/index.js

//...
//POSTS: 4000
axios.post('http://posts-cluster-ip-srv:4000/events', event).catch((err) => {
  console.log(err.message);
});

//COMMENTS: 4001
axios.post('http://comments-srv:4001/events', event).catch((err) => {
  console.log(err.message);
});

//QUERY: 4002
axios.post('http://query-srv:4002/events', event).catch((err) => {
  console.log(err.message);
});

//MODERATION :4003
axios.post('http://moderation-srv:4003/events', event).catch((err) => {
  console.log(err.message);
});

//...
```

2. from blog/event-bus/ -> `docker build -t clarklindev/event-bus .`
3. push to docker-hub: `docker push clarklindev/event-bus`
4. rollout deployment to kubernetes cluster

- get deployments: `kubectl get deployments`
- kubectl rollout restart deployment [depl_name]: `kubectl rollout restart deployment event-bus-depl`

```cmd-out
deployment.apps/event-bus-depl restarted
```

- confirm restart:

```
NAME                              READY   STATUS    RESTARTS   AGE
comments-depl-7f7cb8ff45-h82sx    1/1     Running   0          5m41s
event-bus-depl-6dfd488465-6sd94   1/1     Running   0          58s
moderation-depl-dc8b4f9b7-fkqn9   1/1     Running   0          5m41s
posts-depl-75bf6b79db-zvm98       1/1     Running   0          5m41s
query-depl-849cf684bf-pw8r8       1/1     Running   0          5m41s
```

- we test using POSTMAN:

  - testing that `comments`, `query` and `moderation` receive events from `event-bus`
  - test by re-making a post via NodePort to event-bus:

    - POST http://localhost:NodePort/posts -> headers -> Content-Type: `application/json`, body: RAW json: `{"title" : "POSTS"}`

    ```cmd-out
    NAME                              READY   STATUS    RESTARTS   AGE
    comments-depl-7f7cb8ff45-h82sx    1/1     Running   0          37m
    event-bus-depl-7cf5c8c5b8-z9zsc   1/1     Running   0          12m
    moderation-depl-dc8b4f9b7-fkqn9   1/1     Running   0          37m
    posts-depl-75bf6b79db-zvm98       1/1     Running   0          37m
    query-depl-849cf684bf-pw8r8       1/1     Running   0          37m
    ```

    - check logs (`kubectl get pods`) -> `kubectl logs [name of pod]`
      - `kubectl logs comments-depl-7f7cb8ff45-h82sx` -> Listening on 4001 received event: PostCreated
      - `kubectl logs moderation-depl-dc8b4f9b7-fkqn9` -> listening on 4003
      - `kubectl logs query-depl-849cf684bf-pw8r8` -> listening on 4002 processing event: PostCreated

- TROUBLESHOOT: if you are not receiving the desired output from logs,
  - FIX: [restart deployment](https://www.udemy.com/course/microservices-with-node-js-and-react/learn/lecture/19099844#questions/11700948)

```cmd
kubectl rollout restart deployment query-depl
```

### 88. load balancer services

- integrating the react application with kubernetes
  1. put in pod (Dockerfile)
  2. put in kubernetes cluster
  3. purpose of react app is to initially generate html/css/js
  - AFTER, the react-app is not relevant.. (ie. does not connect/communicate with other pods)
- 2 options for react app to communicate with kubernetes pods
  - OPTION 1 (DO NOT DO THIS):
    - create a `Node Port Service` for each pod (therefore exposing the pod to outside world)
    - WHY its bad: opening a port with each Node Port and then this needs to be updated in react
  - OPTION 2 (PREFERED METHOD):  
    ![option 2](exercise_files/udemy-docker-section04-88-load-balancer-services-option2.png)
    - create a `load balancer service` (single point of entry into kubernetes cluster)
    - the react app is going to make request to load balancer service
    - the load balancer routes requests to appropriate pod (each pod still has a (cluster ip service))

### 89. load balancer and ingress

- load balancer service  
  ![load balancer service](exercise_files/udemy-docker-section04-89-load-balancer.png)
  - tells kubernetes cluster to reachout to its cloud provider (aws/google cloud/azure ...) and provision a `load balancer`:
  - goal is to get traffic into single pod
  - create a config file for loader balancer service
  - add to cluster with `kubectl apply ...`
  - note: load balancer is outside the cluster
- ingress / ingress controller  
  ![ingress controller](exercise_files/udemy-docker-section04-89-ingress-controller.png)
  - ingress -> pod with set of routing rules to distribute traffic to other services -> pods

### 90. Ingress Nginx Installation Info

- NB: required mandatory command that needed to be run for all providers has been removed.
- the environment-specific commands (Docker Desktop, Minikube, etc) is all that is required.
- NOTE:
  - install -> `Ingress Nginx` / NOT `Nginx Ingress`

### deleting infra/k8s

- used to delete all Kubernetes resources defined in the files located in the infra/k8s/ directory.

```
kubectl delete -f infra/k8s/
```

### Docker desktop

- NOTE: DOCKER IS RUNNING...
- https://kubernetes.github.io/ingress-nginx/deploy/#quick-start
- Copy the command from the `If you don't have Helm or if you prefer a yaml manifest) section`
- check with `kubectl get all -n ingress-nginx` to get all in `ingress-nginx` namespace

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.0-beta.0/deploy/static/provider/cloud/deploy.yaml
kubectl get all -n ingress-nginx

```

#### troubleshoot

- NOTE: if you delete kubernetes resources in infra/k8s, this command needs to be called again...

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.0-beta.0/deploy/static/provider/cloud/deploy.yaml
```

- The YAML manifest in the command above was generated with helm template, so you will end up with almost the same resources as if you had used Helm to install the controller.
- looking at the yaml (sourcecode), notice: it is creating an load balancer (Kind: service)

```
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/component: controller
    app.kubernetes.io/instance: ingress-nginx
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/part-of: ingress-nginx
    app.kubernetes.io/version: 1.12.0-beta.0
  name: ingress-nginx-controller
  namespace: ingress-nginx
spec:
  externalTrafficPolicy: Local
  ipFamilies:
  - IPv4
  ipFamilyPolicy: SingleStack
  ports:
  - appProtocol: http
    name: http
    port: 80
    protocol: TCP
    targetPort: http
  - appProtocol: https
    name: https
    port: 443
    protocol: TCP
    targetPort: https
  selector:
    app.kubernetes.io/component: controller
    app.kubernetes.io/instance: ingress-nginx
    app.kubernetes.io/name: ingress-nginx
  type: LoadBalancer
```

### 91. ingress Nginx

- what it does? install `load balancer service` AND `ingress`
- Name: [ingress-nginx](https://kubernetes.github.io/ingress-nginx/) NOT `kubernetes-ingress`
- quickstart - https://kubernetes.github.io/ingress-nginx/deploy/#quick-start

### 92. Ingress v1 API Required Update + pathType Warning

- https://kubernetes.io/docs/concepts/services-networking/ingress/
- changes since beta:
  1. A pathType needs to be added
  2. How we specify the backend service name and port has changed
  3. The kubernetes.io/ingress.class annotation should be removed and replaced by the ingressClassName field under the spec:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-srv
spec:
  ingressClassName: nginx
  rules:
    - host: posts.com
      http:
        paths:
          - path: /posts
            pathType: Prefix
            backend:
              service:
                name: posts-cluster-ip-srv
                port:
                  number: 4000
```

### TROUBLESHOOT:

- WARNING: `Cannot be used with pathType Prefix Warning`
- if you see a warning in your terminal:

```
Warning: path /posts/?{.*}/comments cannot be used with pathType Prefix
Warning: path /?{.*} cannot be used with pathType Prefix
```

- This is not an error and only a warning and does not cause a failure of the project. If you wish to suppress the warning and follow the latest guidance, then, you can use the ImplementationSpecific pathType as explained in the updated docs:
- https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#strict-validate-path-type
- So, for any path that makes use of a regex, you would use `ImplementationSpecific` instead of `Prefix`.

eg:

```yaml
- path: /posts/?(.*)/comments
  pathType: ImplementationSpecific
```

### 93. writing ingress config files

- we created an `ingress controller` through `ingress-nginx` inside the kubernetes cluster
- TODO: teach the controller routing rules via config file with some rules.
- then we feed this config into the cluster which will then be discovered by `ingress controller`
- ingress controller updates its internal set of routing rules
- from infra/k8s/ folder:
- note: `host: posts.com` means any incoming from posts.com
- note: - from `path: /posts` we are sending to event to service `posts-cluster-ip-srv`
- TODO: apply infra/k8s/ingress-srv.yaml: `kubectl apply -f ingress-srv.yaml`:

```cmd-out
ingress.networking.k8s.io/ingress-srv created
```

```yaml
//infra/k8s/ingress-srv.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-srv
spec:
  ingressClassName: nginx
  rules:
    - host: posts.com
      http:
        paths:
          - path: /posts
            pathType: Prefix
            backend:
              service:
                name: posts-cluster-ip-srv
                port:
                  number: 4000

```

### 94. Important Note About Port 80

- we will be editing our hosts file so that we can access posts.com/posts in our browser
- TODO: ensure installed the ingress-nginx controller for your particular Kubernetes client.
- TODO: identify if something is running on port 80 and shut it down

#### TROUBLESHOOT - Windows

- Windows Pro users, both SQL Server Reporting Services (MSSQLSERVER) and the World Wide Web Publishing Service / IIS Server have been the most common services causing a conflict.

- Using Powershell with elevated permissions:

```cmd
netstat -anb

```

- Scroll to the top of the returned output and find the listing for port 80.
- If Docker is properly listening on port 80 you should see:

```
TCP   0.0.0.0:80   0.0.0.0:0   LISTENING
```

### 95. hosts file tweak

- ingress-srv.yaml config: `host -> posts.com` explained:
- you can host many different domains inside a single kubernetes cluster (infrastructure for different domains hosted at single kubernetes cluster)
- ingress-nginx assumes you can host multiple apps at different domains
  - `host: posts.com` -> is saying the config to follow... is tied to app hosted at `posts.com`

```yaml
- host: posts.com
  http:
    paths:
      - path: /posts
        pathType: Prefix
        backend:
          service:
            name: posts-cluster-ip-srv
            port:
              number: 4000
```

#### dev environment

- so in dev environment, we have to trick our app that when it tries to connect to posts.com, its actually connecting to localhost
- host file location:
  - win -> c:\windows\system32\drivers\etc\hosts
  - macOS/Linux -> /etc/hosts
- AS ADMIN: open hosts -> add `127.0.0.1 posts.com`
- meaning when we try connect to posts.com, it connects to 127.0.0.1 instead and apply the ingress-nginx routing to `posts-cluster-ip-srv`

```
# Copyright (c) 1993-2009 Microsoft Corp.
#
# This is a sample HOSTS file used by Microsoft TCP/IP for Windows.
#
# This file contains the mappings of IP addresses to host names. Each
# entry should be kept on an individual line. The IP address should
# be placed in the first column followed by the corresponding host name.
# The IP address and the host name should be separated by at least one
# space.
#
# Additionally, comments (such as these) may be inserted on individual
# lines or following the machine name denoted by a '#' symbol.
#
# For example:
#
#      102.54.94.97     rhino.acme.com          # source server
#       38.25.63.10     x.acme.com              # x client host

# localhost name resolution is handled within DNS itself.
#	127.0.0.1       localhost
#	::1             localhost
# Added by Docker Desktop
192.168.221.177 host.docker.internal
192.168.221.177 gateway.docker.internal
# To allow the same kube context to work on the host and the container:
127.0.0.1 kubernetes.docker.internal
127.0.0.1 docker-for-desktop
# End of section

127.0.0.1 posts.com
localhost posts.com
```

#### Troubleshoot

- Flush the DNS Cache (Optional):
- Open Command Prompt as Administrator (search for "cmd," right-click, and select "Run as administrator").

```cmd
ipconfig /flushdns
```

#### Troubleshoot

- [posts.com/posts](https://www.udemy.com/course/microservices-with-node-js-and-react/learn/lecture/26492690#questions/11251253)
- NOTE: The LoadBalancer service allows external access to the Ingress Controller, listening on ports 80 and 443 (https)
- add `127.0.0.1 posts.com` in hosts file
- fix:  ingress-srv.yaml -> reference to `posts-clusterip-srv` change to `posts-cluster-ip-srv`
- from infra/k8s/folder: `kubectl apply -f ingress-srv.yaml`
- or delete then apply: `kubectl delete -f infra/k8s/` then  `kubectl apply -f ingress-srv.yaml`
- if at anypoint you delete required Kubernetes resources defined in the files located in the infra/k8s/ directory, you need to recall step in lesson 90 about 'if you dont have Helm... or prefer YAML': check lesson: 90. Important - DO NOT SKIP - Ingress Nginx Installation Info
- Copy the command from the `If you don't have Helm or if you prefer a yaml manifest) section`

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.0-beta.0/deploy/static/provider/cloud/deploy.yaml
```

```cmd-out
namespace/ingress-nginx created
serviceaccount/ingress-nginx created
serviceaccount/ingress-nginx-admission created
role.rbac.authorization.k8s.io/ingress-nginx created
role.rbac.authorization.k8s.io/ingress-nginx-admission created
clusterrole.rbac.authorization.k8s.io/ingress-nginx created
clusterrole.rbac.authorization.k8s.io/ingress-nginx-admission created
rolebinding.rbac.authorization.k8s.io/ingress-nginx created
rolebinding.rbac.authorization.k8s.io/ingress-nginx-admission created
clusterrolebinding.rbac.authorization.k8s.io/ingress-nginx created
clusterrolebinding.rbac.authorization.k8s.io/ingress-nginx-admission created
configmap/ingress-nginx-controller created
service/ingress-nginx-controller created
service/ingress-nginx-controller-admission created
deployment.apps/ingress-nginx-controller created
job.batch/ingress-nginx-admission-create created
job.batch/ingress-nginx-admission-patch created
ingressclass.networking.k8s.io/nginx created
validatingwebhookconfiguration.admissionregistration.k8s.io/ingress-nginx-admission created
```

- check with kubectl get all -n ingress-nginx to get all in `ingress-nginx` namespace
  NOTE: something must show up when you call this...

specifically something about `ingress-nginx`

![kubectl get all -n ingress-nginx](exercise_files/udemy-docker-section04-95-ingress-nginx.png)

#### STEP 1:

- TODO: get the 3xxxx port number

```
kubectl get services
```

#### STEP 2:

- POSTMAN:
- TODO: create a post to http://localhost:<3x port>/posts
  - headers: Content-Type application/json
  - body: RAW json { "title": "POST" }

#### STEP 3:

- NOTE: there is not port specified in URL
- EXPECTED: http://posts.com/posts

```
{
  "c27a0eeb": {
    "id": "c27a0eeb",
    "title": "POST"
  },
  "03f69564": {
    "id": "03f69564",
    "title": "POST"
  }
}
```

### 96. Important Note to Add Environment Variable

- TODO: add react app to kubernetes cluster
- React app will be running in a Docker container.
- create-react-app currently has two bugs that prevent it from running correctly in a docker container:
  1. [React-Scripts] v3.4.1 fails to start in Docker
  2. websocket connection appears to be hardcoded to port 3000
- FIX: add two environment variables to the Dockerfile in the client folder
- add to blog/client/Dockerfile:

```yaml
# blog/client/Dockerfile
# Add the following lines
#...
ENV CI=true
ENV WDS_SOCKET_PORT=0
#...
```

### 97. deploying the react app

- NOTE: the updates to host file is only for development env, once deployed this is not necessary
- the reactapp should connect to `posts.com` instead of `localhost:<port>`
- NOTE: the port is also removed eg. `localhost:4000/posts` becomes `http://posts.com/posts`
- TODO:

1. create react app image

```cmd
//blog/client/
docker build -t clarklindev/client .
```

- push to dockerhub

```cmd
docker push clarklindev/client
```

2. create a config for deployment

- infra/k8s/client-depl.yaml
- note: update port (create-react-app is hosted on port 3000)

```yaml
# infra/k8s/client-depl.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: client-depl
spec:
  replicas: 1
  selector:
    matchLabels:
      app: client
  template:
    metadata:
      labels:
        app: client
    spec:
      containers:
        - name: client
          image: clarklindev/client:latest
          # resources:
          #   limits:
          #     memory: "128Mi"
          #     cpu: "500m"

---
apiVersion: v1
kind: Service
metadata:
  name: client-srv
spec:
  selector:
    app: client
  ports:
    - name: client
      protocol: TCP
      port: 3000
      targetPort: 3000
```

3. deploy to kubernetes cluster

- from infra/k8s/ folder: `kubectl apply -f client-depl.yaml`

```cmd-out
deployment.apps/client-depl created
service/client-srv created
```

4. make a `cluster ip service` so nginx can direct traffic to the pod (react app)

### 98. unique route paths

- setting up routing rules for all other microservices inside kubernetes cluster (infra/k8s/ingress-srv.yaml)
- currently it only caters for path: /posts  
  ![ingress controller routing](exercise_files/udemy-docker-section04-97-ingress-routing-unique-routing-paths.png)
- NOTE: ingress-nginx cannot do routing based on method of request (GET, POST, etc) only the path.. so there is not enough information to know which pod events should reach (post or query)

- FIX: update the path eg. /path/create is for POST posts in client/ and posts/
- 1. TODO: update `blog/client/src/PostCreate.js`

```js
//blog/client/src/PostCreate.js
await axios.post('http://posts.com/posts/create', { title });
```

- 2. TODO: update `blog/posts/index.js`
  - update to posts/create

```js
//blog/posts/index.js
app.post('/posts/create', async (req, res) => {});
```

### client/ updates

- TODO: from blog/client/ re-build image: `docker build -t clarklindev/client .`
- TODO: push to docker-hub: `docker push clarklindev/client`
- `kubectl rollout restart deployment <deployment-name>`
- deploy to kubernetes cluster: `kubectl rollout restart deployment client-depl`

### posts/ updates

- TODO: from blog/posts/ re-build image: `docker build -t clarklindev/posts .`
- TODO: push to docker-hub: `docker push clarklindev/posts`
- deploy to kubernetes cluster: `kubectl rollout restart deployment posts-depl`

### 99. final route config (ingress controller)

- blog/infra/ingress-srv.yaml
- TODO: update the routing paths
- NOTE: nginx does not support wildcard colon syntax `/posts/:id/comments` (you have to use regex)
  - FIX: wildcard fix -> `:id` becomes `?(.*)`
- NOTE: UPDATE TO YAML STRUCTURE -> `kubernetes.io/ingress.class` annotation should be removed and replaced by the ingressClassName field under the spec:
- NOTE: `path: /?(.*)` order in array -> has to be at the end (so it only tries to match paths after it has tried all other paths)

```yaml
# infra/k8s/ingress-srv.yaml

apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-srv
  annotations:
    # kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/use-regex: 'true'
spec:
  ingressClassName: nginx
  rules:
    - host: posts.com
      http:
        paths:
          - path: /posts/create
            pathType: Prefix
            backend:
              service:
                name: posts-cluster-ip-srv
                port:
                  number: 4000
          - path: /posts
            pathType: Prefix
            backend:
              service:
                name: query-srv
                port:
                  number: 4002
          - path: /posts/?(.*)/comments
            pathType: ImplementationSpecific
            backend:
              service:
                name: comments-srv
                port:
                  number: 4001
          - path: /?(.*)
            pathType: ImplementationSpecific
            backend:
              service:
                name: client-srv
                port:
                  number: 3000
```

- from infra/k8s/ folder re-apply the `ingress-srv.yaml`

```cmd
kubectl apply -f ingress-srv.yaml
```

```cmd-out
ingress.networking.k8s.io/ingress-srv configured
```

```cmd
kubectl get pods
```

```cmd-out
NAME                               READY   STATUS    RESTARTS   AGE
client-depl-8647d5b9d8-ddhdf       1/1     Running   0          20s
comments-depl-6d46896699-hz5x8     1/1     Running   0          3h55m
event-bus-depl-d8998657d-gnn4w     1/1     Running   0          3h55m
moderation-depl-5847bbbd45-q9np7   1/1     Running   0          3h55m
posts-depl-54b6b8cb6b-jx84w        1/1     Running   0          50m
query-depl-5bf4fdd49f-w2nsj        1/1     Running   0          3h55m
```

- visiting: posts.com  
  ![posts.com](exercise_files/udemy-docker-section04-99-posts.com.png)

### summary

- up to this point in codebase, if we want to make a change
- have to:

1. rebuild
2. deploy to docker-hub
3. redeploy to kubernetes

- there is better way to automate updates to code inside the kubernetes cluster called `Skaffold`

### 100. Skaffold introduction

- Skaffold automates a lot of tasks in a kubernetes `dev` environment
- makes it super easy to update code in a running pod
- makes it easy to create/delete objects tied to a project at once

#### install Skaffold AND add to path

- [skaffold.dev](http://skaffold.dev)
- download
- do SHA check `certutil -hashfile skaffold-windows-amd64.exe SHA256` against: `https://github.com/GoogleContainerTools/skaffold/releases` and download the .sha256
- rename to `skaffold.exe`
- copy to `c:\Program Files\skaffold\skaffold.exe`
- add to system environment variables path: `c:\Program Files\skaffold\`
- open powershell
- `skaffold` to test

### 101. Skaffold API version Update

- list API versions that are supported by the version of Skaffold you have installed

```
skaffold schema list
```

- upgrade skaffold config
- This will print an updated version of your Skaffold config to the terminal so that you can copy-paste or review and update as needed
- [skaffold fix](https://skaffold.dev/docs/references/cli/#skaffold-fix) -> Update "skaffold.yaml" in the current folder to the latest version

```
skaffold fix
```

- The main difference between the two APIs is that the `deploy` and `kubectl` fields no longer exist:

- this is the updated:

```yaml
//updated
apiVersion: skaffold/v4beta3
kind: Config
manifests:
  rawYaml:
    - ./infra/k8s/*
...
```

- this is the old way...

```yaml
//old method
apiVersion: skaffold/v2alpha3
kind: Config
deploy:
  kubectl:
    manifests:
      - ./infra/k8s/*
```

### 102. skaffold setup

- we setup up skaffold with a config file
- config tells skaffold how to manage all the projects inside cluster
- NOTE: skaffold runs outside kubernetes cluster

```
mainfests:
  - ./infra/k8s/*
```

- tells skaffold there is a collection of config files for kubernetes in `infra/k8s/` and it should watch the .yaml files
- changes to any of the yaml files will cause skaffold to automatically `apply` the config to the kubernetes cluster
  - ie. you wont have to call: `kubectl apply -f [config file.yaml]`
- this also ensures when skaffold starts up, the config files in the manifest setting will be applied
- ensure delete objects related to config files created by kubernetes cluster
- `build local push:false` (see skaffold.yaml) -> disable uploading to docker hub
- `artifacts:` - is an array (each entry) -> telling skaffold about project it needs to maintain
  - specifically (in code below...) it is saying there is a pod running out of client/ directory
  - when code changes `context: client` in client directory, skaffold will take those changes and update the pod
  - - 2 ways to update pod:
      1. `- src: "src/**/*.js"` if change in javascript file, skaffold will put it directly in the pod
      2. other updates in client/ that dont match `src:` -> scaffold will try re-build entire image eg. new package dependency added
- NOTE: REMINDER yaml indentation is important
- NOTE: only the react app has `src/` directory, everything else (comments, event-bus, moderation, posts, query) should match just `*.js`

```yaml
# /blog/skaffold.yaml
apiVersion: skaffold/v4beta3
kind: Config
manifests:
  rawYaml:
    - ./infra/k8s/*
build:
  local:
    push: false
  artifacts:
    - image: clarklindev/client
      context: client
      docker:
        dockerfile: Dockerfile
      sync:
        manual:
          - src: 'src/**/*.js'
            dest: .
    - image: clarklindev/comments
      context: comments
      docker:
        dockerfile: Dockerfile
      sync:
        manual:
          - src: '*.js'
            dest: .
    - image: clarklindev/event-bus
      context: event-bus
      docker:
        dockerfile: Dockerfile
      sync:
        manual:
          - src: '*.js'
            dest: .
    - image: clarklindev/moderation
      context: moderation
      docker:
        dockerfile: Dockerfile
      sync:
        manual:
          - src: '*.js'
            dest: .
    - image: clarklindev/posts
      context: posts
      docker:
        dockerfile: Dockerfile
      sync:
        manual:
          - src: '*.js'
            dest: .
    - image: clarklindev/query
      context: query
      docker:
        dockerfile: Dockerfile
      sync:
        manual:
          - src: '*.js'
            dest: .
```

### 103. skaffold startup

- NOTE: Docker is running

#### startup skaffold

- TODO: build docker images -> from the project folder: blog/ (where skaffold.yaml is located)

```cmd
skaffold dev
```

#### TROUBLESHOOT

- note: in the config, if you specify resources for the container... and you dont allocate enough, the build will timeout:

```cmd-out
[client] The build failed because the process exited too early. This probably means the system ran out of memory or someone called `kill -9` on the process.
```

- so either remove it or allocate more resources..

```yaml
resources:
  limits:
    memory: '128Mi'
    cpu: '500m'
```

### AFTER BUILD

- visit: `http://posts.com/`
- NOTE: Reminder Create React App -> picks up on changes to react project folder -> rebuild app -> refresh browser
- NOTE: here all other pod apps' containers (eg. comments) -> run with `nodemon ...` (which restarts project when changes occur)
- NOTE: skaffold also redeploys when it picks up on folder updates
- but if you dont use `nodemon` (and only use `node` to start project) and only have that skaffold re-deploys, this will not reflect changes

#### NOTE:

- If you're using Skaffold to manage your microservices and it detects changes in your code, it will attempt to rebuild and redeploy your application. However, if your pod doesn't use a file watcher like Nodemon (or a similar tool) to automatically restart the application when code changes occur, you won't see those changes reflected in your running pod.
- Skaffold: Skaffold watches for changes in your local files, builds the image, and deploys it to your Kubernetes cluster.
- Nodemon: Nodemon automatically restarts your Node.js application when it detects changes in the code.
- NOTE: there are times that changes arent detected in containers

### STOPPING SKAFFOLD

- CTRL+C -> stops skaffold -> cleanup deployment objects

### summary

- skaffold automates the process of kubernetes deployments and container management

---

---

## section 05 - architecture of multiservice apps (1hr6min)

- folder: `/ticketing`

### 105. big ticket items (CONS of section 1-4)

- duplicate code (express server setup)
  FIX -> build a central library (npm package for common code) to share code between projects

- hard to picture flow of events between services
  FIX -> define our events in shared library

- hard to remember what properties events should have
  FIX -> use Typescript

- hard to test event flows
  FIX -> write tests (automation)

- all of kubernetes was running on computer
  FIX -> running kubernetes cluster in cloud / Skaffold workflow

- event order execution
  FIX -> code for concurrency

### 106. App overview

- StubHub - users selling tickets to concerts/sport events to other users
- TODO: build a ticketing app (Stubhub clone)
  - list events
  - click on event
    - select date
      - ticket price -> checkout
  - concurrency - lock ticket during intention to purchase ticket

### APP FEATURES

- list a ticket for an event  
  ![list tickets](exercise_files/udemy-docker-section05-106-screen01-view-ticket-listings.png)

- sign up  
  ![sign up](exercise_files/udemy-docker-section05-106-screen02-sign-up.png)

- sign in  
  ![sign in](exercise_files/udemy-docker-section05-106-screen03-sign-in.png)

- logged-in  
  ![logged-in](exercise_files/udemy-docker-section05-106-screen04-logged-in-nav.png)

- ticket details  
  ![ticket details](exercise_files/udemy-docker-section05-106-screen06-ticket-detail.png)

- payment  
  ![payment](exercise_files/udemy-docker-section05-106-screen07-payment.png)
- card details for payment  
  ![card details for payment](exercise_files/udemy-docker-section05-106-screen08-card-details-for-payment.png)

- others can purchase this ticket
- anyone can list/buy tickets
- when buying a ticket (go to checkout BUT before payment)-> ticket is locked (for x time) while user attempts to pay (ticket wont be shown to others )
- failure to purchase within timeframe will unlock ticket
- ticket seller can update ticket prices if not locked

### 107. resource types

- App design
  1. User store (user , password)
  2. ticket (title, price, userId, orderId) NOTE: userId is seller; orderId is purchase queue
  3. Order(intent to purchase ticket) (userId is seller, status (created|cancelled|awaitingpayment|completed), ticketId, expiresAt)
  4. Charge (orderId, status(created|failed|completed), amount, stripeId, stripeRefundId)

### 108. service types

- Types of services in App
- auth (related to user authentication signup|signin|signout)
- tickets (ticket create|edit|whether ticket can be edited)
- orders (order creation|edit)
- expiration (watch for orders to be created, cancels after 15min)
- payments (handles credit card payments, cancels orders if payment fails, completes if payment succeeds - order/payment failed)

### 109. Events and architecture design

#### App Events

- UserCreated
- UserUpdated

- OrderCreated
- OrderCancelled
- OrderExpirred

- TicketCreated
- TicketUpdated

- ChargeCreated

![diagram of services](exercise_files/udemy-docker-section05-109-architecture-design.png)

- Note: the structure of this project

  - client (nextjs)
  - common
  - auth service (mongodb)
  - tickets service (mongodb)
  - orders service (mongodb)
  - payments service (mongodb)
  - expiration service (redis)
  - NATS Streaming sever

- client uses nextjs
- all services will use node and mongodb,
- `expiration service` will use Redis
- services make use of a "common library" npm module
- for event-bus: NATS Streaming server

### 110. notes on typescript

- see [Section 25 - Basics of Typescript (5hr42min)](#section-25---basics-of-typescript-5hr42min)

### 111. auth service setup

![udemy-docker-section05-111-auth-service.png](exercise_files/udemy-docker-section05-111-auth-service.png)

- authentication routes:

  - POST -> /api/users/signup
  - POST -> /api/users/signin
  - POST -> /api/users/signout
  - GET -> /api/users/currentuser

- folders:

  - ticketing
    - auth

- `pnpm i typescript express ts-node-dev @types/express`

#### ts-node-dev

- builds on top of ts-node and introduces features such as fast re-compilation (incremental compilation - meaning it only recompiles the files that have changed) and hot-reloading.
- using npx: `npx tsc --init` -> creates typescript config (without needing global typescript)
- NOTE: a global install of typescript is required to run tsc from the terminal -> `tsc --init` -> creates typescript config

#### running the app

- using exercise_files/ticketing/auth
- note: it is using npm (default package-lock.json). if you use pnpm, you need to convert the npm lock files so pnpm can install the correct package versions: `pnpm import`
- then you can delete package-lock.json
- if you run -> it will complain that there is no body-parser so install it (as well as @types/body-parser):
- `pnpm i body-parser @types/body-parser`
- `pnpm run start` -> console outputs `Listening on port 3000!`

### 112. auth k8s setup (auth kubernetes setup)

#### STEP 1 - build docker image

- TODO: create Dockerfile -> build docker image (adds to dockerhub)
- NOTE: DOCKER IS RUNNING / internet connected

##### pnpm docker command

- this sets up a workdirectory of `/app`,
- copies everything from current auth directory into that folder and adds start command
- `.dockerignore` - ignore folder: `node_modules`
- if you use pnpm, the Dockerfile is different to npm Dockerfile
- pnpm requires atleast `node:18-alpine`
- `docker build -t stephengrider/auth .` (use your own docker id)

```Dockerfile
# Use an official Node.js image
FROM node:18-alpine
# Install pnpm
RUN npm install -g pnpm
# Set working directory
WORKDIR /app
# Copy package.json and pnpm-lock.yaml (pnpm's lockfile)
COPY package.json pnpm-lock.yaml ./
# Install dependencies with pnpm
RUN pnpm install
# Copy the rest of the application code
COPY . .
# Expose the application port
EXPOSE 3000
# Run the app
CMD ["pnpm", "start"]
```

##### basic Dockerfile

```Dockerfile
FROM node:alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "start"]
```

#### STEP2: kubernetes deployment

- TODO: to allow running auth service in kubernetes
- `infra/k8s/auth-depl.yaml`
- also define the kubernetes service -> service gives access to a pod

##### kubernetes deployment -> step 1 of 2 - setup selector

- the purpose of this selector is to tell deployment how to find the pods it should create

```yaml
#...
selector:
  matchLabels:
    app: auth
#...
```

##### kubernetes deployment -> step 2 of 2 - setup template

- how to create each pod the template will create
- note the `template -> labels -> app` is matching up with `selector -> app`

```yaml
#...
template:
  metadata:
    labels:
      app: auth
  spec:
    containers:
      - name: auth
        image: clarklindev/auth:latest
```

##### add a kubernetes service for auth

- /infra/k8s/auth-depl.yaml
- the selector tells the service how to find the pods that its supposed to govern access to
- no type is set as 'cluster ip' is default and allows communication to the service from anything running in the cluster

```yaml
# /infra/k8s/auth-depl.yaml
#...
---
apiVersion: v1
kind: Service
metadata:
  name: auth-srv
spec:
  selector:
    app: auth
  ports:
    - name: auth
      protocol: TCP
      port: 3000
      targetPort: 3000
```

### 113. adding skaffold

#### STEP 3 - adding skaffold config

- function of skaffold:
  - watch infra/ anytime there is a change to config, it will apply to cluster
  - code updates in auth directory, will sync with the appropriate running container inside cluster
- note: this is the new skaffold v2+ syntax, it lists all the directories we want to sync

```yaml
manifests:
  rawYaml:
    - ./infra/k8s/*
```

- purpose of skaffold is to:

  1. find all the things to put in the cluster
  2. build
  3. put them in the kubernetes cluster
  4. handle live-code reload

- create ticketing/skaffold.yaml
- do not push to dockerhub (default)
- artifacts lists all images to put in cluster
  - context -> folder that contains all code for this image
- sync -> tells skaffold how to handle any file changes
  - src -> folder to watch
  - `dest: .` -> where to sync to - inside running container

```yaml
apiVersion: skaffold/v4beta3
kind: Config
manifests:
  rawYaml:
    - ./infra/k8s/*
build:
  local:
    push: false
  artifacts:
    - image: clarklindev/auth
      context: auth
      docker:
        dockerfile: Dockerfile
      sync:
        manual:
          - src: 'src/**/*.ts'
            dest: .
```

##### running skaffold

- from ticketing/ (where skaffold.yaml should be)
- NOTE: DOCKER IS RUNNING
- `skaffold dev`

### 114. NOTE: code reload

- update package script

```json
ts-node-dev --poll src/index.ts
```

### 115. ingress controller/routing

- to access anything inside cluster, can either
  1. setup a node port
  2. set up ingress controller for routing within the cluster
- add the route to index.ts
- NOTE: res.send -> http response
- NOTE: res.json -> sends json response

```ts
//src/index.ts

app.get('/api/users/currentuser', (req, res) => {
  res.send('hi there');
});
```

### 116. ingress-Nginx setup

- kubernetes.github.io/ingress-nginx (to setup ingress nginx)
- this sets up forwarding of requests /api/users to service
- `nginx.ingress.kubernetes.io/use-regex: 'true'` this says there will be regex in the paths of the file
- RECALL: rules -> host is a pretend domain from local machine `ticketing.dev`
- send incoming to `auth-srv` service on port `3000`

```yaml
# infra/k8s/ingress-srv.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-service
  annotations:
    nginx.ingress.kubernetes.io/use-regex: 'true'
spec:
  ingressClassName: nginx
  rules:
    - host: ticketing.dev
      http:
        paths:
          - path: /api/users/?(.*)
            pathType: ImplementationSpecific
            backend:
              service:
                name: auth-srv
                port:
                  number: 3000
```

### 117. host file and security

- you have to edit the host file (on local machine) for dev setup (route a path to localhost)
- `c:\windows\System32\Drivers\etc\hosts`
- set localhost to what was put in ingress -> rules -> host eg. ticketing.dev
- accessing ticketing.dev will route to localhost (127.0.0.1)

```hosts
127.0.0.1 ticketing.dev
```

- after setting this up should be able to visit: `ticketing.dev/api/users/currentuser`

#### security warning

![udemy-docker-section05-117-security-warning.png](exercise_files/udemy-docker-section05-117-security-warning.png)

- NB!
- WHY? nginx is a webserver that tries to use https connection
- by default it uses a self-signed certificate (chrome browser does not trust this)
- FIX: goto the window, click anywhere inside where the security warning is and type `thisisunsafe`
- exected output: `hi there` which is what was set in `auth/src/index.ts`:

```ts
//auth/src/index.ts
app.get('/api/users/currentuser', (req, res) => {
  res.send('hi there');
});
```

#### summary

- so at this point you have automated:
  - docker image build
  - containerization and upload to dockerhub
  - automated image fetching for kubernetes cluster
  - using skaffold to deploy everthing with single command `skaffold dev`
  - access your url (on local development) via host file and routing setup (ingres-nginx)

## section 06 - leveraging a cloud environment for development (47min)

- OPTIONAL SECTION BUT...

### 118. Note on remote development

- TODO: to learn about how to deploy to google cloud environment. sound exciting? then follow along
- REQUIRED -> google cloud requires credit card

### 119. remote dev with skaffold

- current architecture  
  ![udemy-docker-section06-119-remote-dev-with-skaffold-local.png](exercise_files/udemy-docker-section06-119-remote-dev-with-skaffold-local.png)

- cloud architecture  
  ![udemy-docker-section06-119-remote-dev-with-skaffold-cloud.png](exercise_files/udemy-docker-section06-119-remote-dev-with-skaffold-cloud.png)
- NOTE: skaffold was developed by teams at google (tight-integration with google cloud)
- there are 2 types of changes that skaffold handles

  #### 1. synced file changes

  - ( updates of .ts in working project folder mentioned in skaffold.yaml `sync` -> src: `src/**/*.ts`)

  ![udemy-docker-section06-119-remote-dev-with-skaffold-handled-updates-option1.png](exercise_files/udemy-docker-section06-119-remote-dev-with-skaffold-handled-updates-option1.png)

  - no rebuild of image (skaffold takes file and inserts it in the pod of kubernetes cluster)

  #### 2. un-synced file changes

  - (all other changes not mentioned in skaffold.yaml -> sync)

  - causes complete rebuild of image and re-deploy in cluster
  - skaffold detects changes that are not synced -> reaches out to service in google cloud (called `google cloud build`)
    - its purpose is to build docker images
    - skaffold takes files for project + Dockerfile -> uploads to google cloud build -> Docker builder builds images.
    - GOAL: decrease resources used on local computer
    - skaffold then reaches out to deployment to inform that new image is available and rebuild pods with latest image

  ![udemy-docker-section06-119-remote-dev-with-skaffold-handled-updates-option2.png](exercise_files/udemy-docker-section06-119-remote-dev-with-skaffold-handled-updates-option2.png)

- SETUP
  - TODO: google cloud account
  - TODO: set up kubernetes cluster on google cloud
  - configure google cloud build
  - configure skaffold to use google cloud build + remote cluster

### 120. free google cloud credits

- https://cloud.google.com/free
- signup for $300 free credits

### 121. initial google account setup

- create account
- create a new project

### 122. kubernetes cluster creation

- NOTE: THIS COSTS MONEY
  - https://cloud.google.com/free/docs/free-cloud-features#kubernetes-engine
- https://console.cloud.google.com
- create project
- create a kubernetes cluster OPTIONS: `switch to default cluster` (SELECT THIS) / `switch to autopilot cluster` (CHEAPER-google manages infrastructure)

  - `name`
  - `location type` -> zonal -> zone (select)
  - `master version` (kubernetes version) -> target: `regular (recommended)` / version: `default`
  - node pools -> default-pool
  - clusters -> default pool -> size -> number of `nodes -> 3`
    -NOTE: also try use `nodes -> 1` and `turn OFF auto-scaling`
    - nodes -> machine family: `(E2) (E2 is Low cost, day-to-day computing)` -> type: `shared core (e2-micro)` -> bootdisk size (83gb)
    - NOTE: for the course Stephen chooses -> N1 -> g1-small : `N1	Balanced price & performance	0.5 - 96	1.7 - 624 GB	Intel Skylake`
    - machine type -> `shared core (e2-micro)`
  - TODO: click `create`

- machine configuration  
  <img src="exercise_files/udemy-docker-section06-122-kubernetes-cluster-machine-configuration.png" width="800" alt="udemy-docker-section06-122-kubernetes-cluster-machine-configuration.png"/>

- machine type  
  <img src="exercise_files/udemy-docker-section06-122-kubernetes-cluster-machine-type.png" width="800" alt="udemy-docker-section06-122-kubernetes-cluster-machine-type.png"/>

### 123. Kubectl Contexts

- local pc -> `kubectl get pods`
- Todo: Connect to cluster in google cloud?
  - connect by changing config connection settings (Kubectl Contexts)
  - add new context via `google cloud dashboard` OR `google cloud sdk`

### install google cloud SDK

![udemy-docker-section06-123-kubectl-contexts.png](exercise_files/udemy-docker-section06-123-kubectl-contexts.png)

- `https://cloud.google.com/sdk/docs/install-sdk` -> download SDK -> google cloud cli:

### install

- download: `https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe`
- Optional: `https://cloud.google.com/apis/docs/cloud-client-libraries`

### 124. initializing GCloud Sdk

- GOOGLE CLOUD sdk - purpose is to teach Kubectl how to connect to clusters
- `cloud.google.com/sdk/docs/quickstarts`

### test gcloud is installed

- test sdk: `gcloud`

### login gcloud

```
gcloud auth login
```

- redirects you on browser to google login (same account as where we created gcloud project)
- if successful, result message: you are now logged in as [email address] your current project is `[none]` you can change this setting by running: `gcloud config set project PROJECT_ID`

### configure project

- `gcloud init`

```
Pick configuration to use:
 [1] Re-initialize this configuration [default] with new settings
 [2] Create a new configuration
```

- give name to configuration eg. `ticketing-dev`
- select google account
- ...gives list of all projects in account
- select `project ID` (see google cloud dashboard -> projects)
- select region -> YES
- select region set when creating cluster (if you dont remember check google dashboard -> kubernetes engine)
  - you can change region `gcloud config set compute/region NAME`
  - you can change zone `gcloud config set compute/zone NAME`

#### TROUBLESHOOT - creating cluster

- error: `Insufficient regional quota to satisfy request: resource "SSD_TOTAL_GB"`

- Fix OPTION 1 - change the ssd storage space required if running 3 nodes (free tier given 250gb -> 250/3 -> 83gb)

- Fix option 2: `https://console.cloud.google.com/iam-admin/quotas?usage=USED&project=xxx`
  - update to paid tier
  - adjust: filter 'ssd-total-storage' -> `REGION` -> xxx -> update storage gb

### 125. installing Gcloud context

![udemy-docker-section06-125-install-gcloud-context.png](exercise_files/udemy-docker-section06-125-install-gcloud-context.png)

- you can run `kubectl` locally or in cloud `gcloud components install kubectl`
- NOTE: DOCKER IS RUNNING
- then run `gcloud container clusters get-credentials <cluster name>`

- example:

```cmd
gcloud container clusters get-credentials ticketing-dev
```

- to see if context was created, right-click docker icon (taskbar) -> kubernetes-context -> [NEW ENTRY]
- NOTE: you can use this to switch kubernetes config context for `kubectl` commands

#### TROUBLESHOOT

- `CRITICAL: ACTION REQUIRED: gke-gcloud-auth-plugin, which is needed for continued use of kubectl, was not found or is not executable. Install gke-gcloud-auth-plugin for use with kubectl by following https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl#install_plugin`
- FIX: Install required plugins `gcloud components install gke-gcloud-auth-plugin`
- RETRY: `gcloud container clusters get-credentials ticketing-dev`
- EXPECTED:

```cmd-out
Fetching cluster endpoint and auth data.
kubeconfig entry generated for ticketing-dev.
```

### 126. updating the skaffold config

![udemy-docker-section06-126-updating-skaffold-config.png](exercise_files/udemy-docker-section06-126-updating-skaffold-config.png)

#### steps:

1. enable google cloud build (CI/CD)

![udemy-docker-section06-126-updating-skaffold-config-cloud-build.png](exercise_files/udemy-docker-section06-126-updating-skaffold-config-cloud-build.png)

- gcloud -> tools -> cloud build -> enable

2. update the skaffold.yaml file to use Google cloud build

![udemy-docker-section06-126-updating-skaffold-config-gloud-project-id.png](exercise_files/udemy-docker-section06-126-updating-skaffold-config-gloud-project-id.png)

- TODO - section05-ticketing/skaffold.yaml add `googleCloudBuild` -> project id
- TODO - update `artifacts: image` name -> this is generated by gcloud when it builds -> always starts with `us.gcr.io/[then project ID]/[name of project directory]`
- TODO - remove `local` (SEE TROUBLESHOOT.. cant have setting up for both local and cloud)

```yaml
# add this between `local` and `artifacts`
# local:
#   push: false
googleCloudBuild:
  projectId: [GET PROJECT ID FROM GCLOUD PROJECTS]
artifacts:
  - image: us.gcr.io/[project id]/[name of project directory]
```

#### TROUBLESHOOT

- `Error: Property googleCloudBuild is not allowed.`
- NOTE: Q&A FIX -> remove "local" section and it should work
- NOTE: Q&A FIX -> Chapter 129 handles this configuration error (local and gcloud containers can't be mixed)

- full yaml:

```yaml
apiVersion: skaffold/v4beta3
kind: Config
manifests:
  rawYaml:
    - ./infra/k8s/*
build:
  # local:
  #   push: false
  googleCloudBuild:
    projectId: [GET PROJECT ID FROM GCLOUD PROJECTS]
  artifacts:
    # - image: clarklindev/auth
    - image: us.gcr.io/[GET PROJECT ID FROM GCLOUD PROJECTS]/auth
    context: auth
      docker:
        dockerfile: Dockerfile
      sync:
        manual:
          - src: 'src/**/*.ts'
            dest: .
```

### 127. more scaffold updates

- TODO - `infra/k8s/auth-depl.yaml` image reference needs to be updated too -> (copy from skaffold.yaml) `image: us.gcr.io/[project id]`

3. setup ingress-nginx on our google cloud cluster

### 128. create a load balancer

- `kubernetes.github.io/ingress-nginx`
- TODO: copy mandatory command
- SOLUTION FIX: Q&A - Mandatory commands no longer exist, so, you just need to execute the commands provided in the GCP / GKE instructions here:
  - `https://kubernetes.github.io/ingress-nginx/deploy/#gce-gke`

#### install ingress controller/load balancer (ingress-nginx on google cloud cluster)

- Then, the ingress controller /load balancer can be installed like this:

```cmd
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.0-beta.0/deploy/static/provider/cloud/deploy.yaml

```

#### GCE-GKE

- your user needs to have cluster-admin permissions on the cluster. This can be done with the following command:
- note: the below command, in the ingress-nginx documentation, the separate it on multiple lines and it adds `\` which must be removed

```cmd
kubectl create clusterrolebinding cluster-admin-binding --clusterrole cluster-admin --user $(gcloud config get-value account)
```

4. update our hosts file again to point to the remote cluster

![udemy-docker-section06-128-creating-load-balancer.png](exercise_files/udemy-docker-section06-128-creating-load-balancer.png)

- update host file (on local machine - C:\Windows\System32\drivers\etc\hosts)
  - visiting ticketing.dev/ will point to the remote cluster (load balancer) instead of localhost
  - ie. we need to add the ip address of the load balancer (get from gcloud dashboard under networking)

![udemy-docker-section06-128-creating-a-load-balancer-getting-load-balancer-ip.png](exercise_files/udemy-docker-section06-128-creating-a-load-balancer-getting-load-balancer-ip.png)

- https://console.cloud.google.com/net-services/loadbalancing/

  - NOTE: make sure the correct account is loggedin

- random generated name -> clicking on this will show ip-address
  ![udemy-docker-section06-128-creating-a-load-balancer-generated-load-balancer.png](exercise_files/udemy-docker-section06-128-creating-a-load-balancer-generated-load-balancer.png)

- get the ip address of load-balancer created by nginx
  ![udemy-docker-section06-128-creating-a-load-balancer-ip.png](exercise_files/udemy-docker-section06-128-creating-a-load-balancer-ip.png)
- open host file and update the destination for ticketing.dev (after update -> will connect to ip of load balancer)
- eg.

```
<!-- c:\windows\system32\drivers\etc\hosts -->
34.55.555.140 ticketing.dev
```

5. restart skaffold

- will redeploy auth deployment (auth-depl.yaml) and routing rules (ingres-srv.yaml) to gcloud
- TODO: shutdown running skaffold
- ensure docker -> context -> points to gcloud (and not docker-desktop)
- ensure you are restarting from project folder where skaffold.yaml is located eg. section05-ticketing/

```cmd
skaffold dev
```

```output
[auth] Listening on port 3000!!!!!!
[auth] visit: https://ticketing.dev/api/users/currentuser
```

- NOTE: when visiting `https://ticketing.dev/api/users/currentuser`

![udemy-docker-section06-128-skaffold-invalid-certificate.png](exercise_files/udemy-docker-section06-128-skaffold-invalid-certificate.png)

- FIX: click on page and type: `thisisunsafe`

#### TROUBLESHOOT

- `gcloud auth configure-docker` - This will set up Docker to authenticate using your Google Cloud credentials.
- NOTE: ensure you are logged in: `gcloud auth application-default login`
- NOTE: the host matters `ticketing.dev` -> infra/k8s/ingress-srv.yaml -> `host: ticketing.dev`

- view progress of build: https://console.cloud.google.com/cloud-build/
  - select history
  - clicking on the build link

#### shutdown kubernetes on gcloud

- shut down the cluster on gcloud -> kubernetes engine -> clusters -> delete

## section 07 - response normalisation strategies (1hr58min)

- consistent error handling using express middleware

### 130. creating route handlers

- this lesson is about express routing -> creating files for each route

#### current routing

- folder: /auth/src/index.ts

```ts
import express from 'express';
import { json } from 'body-parser';

const app = express();
app.use(json());

app.get('/api/users/currentuser', (req, res) => {
  res.send('hi there');
});

app.listen(3000, () => {
  console.log('Listening on port 3000!!!!!!');
  console.log('visit: https://ticketing.dev/api/users/currentuser');
});
```

#### updated routing

- TODO: update route handlers -> each route gets its own file `/auth/src/routes/[x]`

- folder: /auth/src/routes/ and add a file for each route:
  - src/routes/current-user.ts
  - src/routes/signin.ts
  - src/routes/signout.ts
  - src/routes/signup.ts

```ts
//auth/src/routes/current-user.ts
import express from 'express';
const router = express.Router();
router.get('/api/users/currentuser', () => {});
export { router as currentUserRouter };
```

```ts
//auth/src/index.ts
import express from 'express';
import { json } from 'body-parser';
import { currentUserRouter } from './routes/current-user'; //import the route

const app = express();
app.use(json());

app.use(currentUserRouter); //use the route

app.listen(3000, () => {
  console.log('Listening on port 3000!!!!!!');
  console.log('visit: https://ticketing.dev/api/users/currentuser');
});
```

### 131. scaffolding routes

- we create the rest of the routes
  - src/routes/signin.ts
  - src/routes/signout.ts
  - src/routes/signup.ts

### 132. adding validation with express-validator

- TODO: no assumptions that form date contains correct required data
- signup -> request.body receives email and password
- this is manual validation (see code below)
- section05-ticketing/auth -> replace with npm package `express-validator` 3rd party validation package:
- express-validator can be used to check incoming request:
  - body
  - query-parameters eg. /:id
  - query-strings eg. ?q=book&category=fuction
- note: middleware is the 2nd paramteter listed as an array:

```ts
//auth/src/routes/signup.ts
router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('password must be between 4 and 20 characters'),
  ],
  (req, res) => {}
);
```

```
pnpm i express-validator
```

- NOTE: DOCKER is running
- NOTE: Skaffold is running (detects the package.json update -> causes a rebuild of `auth`)
- NOTE: Skaffold does not automatically create the necessary infrastructure for running your applications on Google Cloud (or any cloud provider). It focuses on simplifying the development workflow by automating tasks like building, pushing, and deploying your application. However, the infrastructure (such as Kubernetes clusters, nodes, etc.) needs to be created and managed separately, typically using other tools like gcloud, Terraform, or Cloud Console.
- NOTE: this deploys live to gcloud -> NEED TO DELETE KUBERNETES CLUSTER AFTER TESTING

- full example:

```ts
//auth/src/routes/signup.ts
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('password must be between 4 and 20 characters'),
  ],
  (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || typeof email !== 'string') {
      res.status(400).send('provide a valid email');
    }
  }
);

export { router as signupRouter };
```

### 133. handling validation errors

- TODO: handling the results of the validation
- `import {body, validationResult} from 'express-validaor';`
  - when validating (see lesson 132 if there are errors... it gets appended to the request)
- `validationResult()` is a function we will run on incoming request `req` to extract this data that was appended during validation `const errors = validationResult(req);`
- TODO: test route with postman -> POST `ticketing.dev/api/users/signup`

```ts
import express, { Request, Response } from 'express';

//...

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('password must be between 4 and 20 characters'),
  ],
  (req: Request, res: Response) => {
    //return the error to requestor
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).send(errors.array());
    }

    const { email, password } = req.body;
    console.log('creating a user');
    res.send({});
  }
);
```

- test: ERROR if there are errors, output:

```json
[
  {
    "type": "field",
    "msg": "Email must be valid",
    "path": "email",
    "location": "body"
  },
  {
    "type": "field",
    "value": "",
    "msg": "password must be between 4 and 20 characters",
    "path": "password",
    "location": "body"
  }
]
```

- NOTE: the purpose of going through this exercise, is to extract, rewrite so it is re-usable

### 134. Postman HTTP issues

##### TROUBLESHOOT

- when testing with POSTMAN -> if you get errors regarding ssl certificates when accessing via https://ticketing.dev/
- FIX: turn off ssl-certificate verification

### 135. suprising complexity around error

![udemy-docker-section07-135-error-flow.png](exercise_files/udemy-docker-section07-135-error-flow.png)

- the structured response we get for errors when calling an endpoint is the result of using `express-validator` package

![udemy-docker-section07-135-multiple-errors.png](exercise_files/udemy-docker-section07-135-multiple-errors.png)

- with microservices using multiple services, each service could be built using a different language/framework and have different api response structure
- TODO: standardize structure response from these services so we dont have to code for multiple languages to have a consistent error response
- FIX: by building the shared libarary to be used by the different services

### 136. other sources of errors

- examples
  - scenario 1 -> incoming request with incorrect email
  - scenario 2 -> incoming request with email, express-validator checks if email already in use
  - scenario 3 -> incoming request with email, express-validator checks if email already in use -> try create a new user

### 137. solution for error handling

- TODO - have consistent structured response
  - FIX: write an error handling middleware to process errors, give them consistent structure and send back to browser
- TODO - handle all other errors consistently (not just validation of inputs)
  - FIX: make sure we capture all possible errors using express's error handling mechanism (calling 'next')

#### Express error handling - Catching Error

- synchronous route handler's get handled by express middleware that we create

```ts
app.get('/', (req, res) => {
  throw new Error('BROKEN'); // Express will catch this on its own.
});
```

- asynchronous route handler's error handling need to be captured manually
  - as a argument to callback function, promise, async-await
  - or as a try/catch
- the error is then passed onto `next(err)`

```ts
app.get('/', (req, res, next) => {
  fs.readFile('/file-does-not-exist', (err, data) => {
    if (err) {
      next(err); // Pass errors to Express.
    } else {
      res.send(data);
    }
  });
});
```

#### Writing error handlers

- [DOCS](https://expressjs.com/en/guide/error-handling.html)
- error handling functions have 4 arguments (err, req, res, next) instead of 3.
- if the function has 4 arguments, express assumes it will handle errors

```ts
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

### 138. building an error handling middleware

- folder: section05-ticketing/auth/src/middlewares/error-handler.ts

```ts
//section05-ticketing/auth/src/middlewares/error-handler.ts
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('something went wrong', err);

  res.status(400).send({
    message: 'something went wrong',
  });
};
```

- to wire up the middleware...import it into index.ts
- `section05-ticketing/auth/src/index.ts`

```ts
//section05-ticketing/auth/src/index.ts
//...
import { errorHandler } from './middlewares/error-handler';
//...
app.use(errorHandler);

//...
```

- back in `signup.ts`, instead of handling the error, throw a new error to let express middleware (error-handler.ts) catch the thrown error
- folder: src/routes/signup.ts

```ts
//src/routes/signup.ts

//...
//NOTE THERE IS UPDATED CODE LATER...

if (!errors.isEmpty()) {
  //   return res.status(400).send(errors.array());
  throw new Error('invalid email or password');

  //let express middleware (error-handler.ts) handle any errors eg. connecting to database
  console.log('creating a user...');
  throw new Error('Error connecting to database');

  res.send({});
}
//...
```

### 139 - communicating more info to the error handler

- when you throw a Error('some message'), the error string is assigned to the `err.message` property in the middleware handler
- TODO: BUT.. instead of being limited to a simple string `new Error('error message')`, we would like to pass on the error object from express-validator

```ts
//section05-ticketing/auth/src/middlewares/error-handler.ts
//NOTE: UPDATED CODE LATER...

import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('something went wrong', err);

  res.status(400).send({
    message: err.message, //gets the message passed in
  });
};
```

### 140. encoding more information in an Error (typescript)

- the javascript way to attach additional properties to an error object would be to just attach it eg.

```js
const error = new Error('Invalid email or password');
error.reasons = errors.array();
throw error;
```

- the typescript way...
- we want something like an error BUT with some more custom properties (subclass Error)
- TODO:
  - create subclass RequestValidationError
  - create subclass DatabaseConnectionError

![udemy-docker-section07-140-encoding-more-info-errors.png](exercise_files/udemy-docker-section07-140-encoding-more-info-errors.png)

### 141. Subclassing for custom errors

#### RequestValidationError

- auth/src/errors/request-validation-error.ts

```ts
//request-validation-error.ts
import { ValidationError } from 'express-validator';

export class RequestValidationError extends Error {
  constructor(private errors: ValidationError[]) {
    super();

    //only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
}

//usage: throw new RequestValidationError(errors);
```

#### DatabaseConnectionError

- auth/src/errors/database-connection-error.ts

```ts
//database-connection-error.ts
import { ValidationError } from 'express-validator';

export class DatabaseConnectionError extends Error {
  reason = 'Error connecting to database';

  constructor() {
    super();

    //only because we are extending a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}

//usage: throw new DatabaseConnectionError(reason);
```

#### using the errors

- src/routes/signup.ts

```ts
import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('password must be between 4 and 20 characters'),
  ],

  //validation using express-validator
  (req: Request, res: Response) => {
    //return the error to requestor
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    throw new DatabaseConnectionError();

    res.send({});
  }
);

export { router as signupRouter };
```

### 142. determining error type

- then in middlewares/error-handler.ts check the incoming error to handle appropriately

```ts
//src/middlewares/error-handler.ts
import { Request, Response, NextFunction } from 'express';

import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof RequestValidationError) {
    console.log('handling this error as a request validation error');
  }
  if (err instanceof DatabaseConnectionError) {
    console.log('handling this error as a db connection error');
  }

  res.status(400).send({
    message: 'something went wrong',
  });
};
```

### 143. property 'param' does not exist on type 'AlternativeValidationError'

- express-validator library recently released a breaking v7 version where the ValidationError type is now a discriminated union
  - https://express-validator.github.io/docs/migration-v6-to-v7#telling-error-types-apart
- renaming `param` to `path`
  - https://express-validator.github.io/docs/migration-v6-to-v7#renamed-properties
  - TODO: FIX: update our conditional to add a check for an error of type field and use the new path property

```ts
if (err instanceof RequestValidationError) {
  const formattedErrors = err.errors.map((error) => {
    if (error.type === 'field') {
      return { message: error.msg, field: error.path };
    }
  });
  return res.status(400).send({ errors: formattedErrors });
}
```

### 144. converting errors to responses

![udemy-docker-section07-144-common-response-structure.png](exercise_files/udemy-docker-section07-144-common-response-structure.png)

- common response structure for errors

  - return an object with `errors` property, which will be an array of objects
    - each object will have a `message` describing error
    - and optional `field` which describes what area the message is tied to (eg. field:"email")

- generic error should also have same format

```js
//common response structure
{
  errors:{
    message: string, field?:string
  }[]
}
```

```ts
//src/middlewares/error-handler.ts
import { Request, Response, NextFunction } from 'express';

import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof RequestValidationError) {
    console.log('handling this error as a request validation error');
    const formattedErrors = err.errors.map((error) => {
      if (error.type === 'field') {
        return { message: error.msg, field: error.path };
      }
    });
    return res.status(400).send({ errors: formattedErrors });
  }

  if (err instanceof DatabaseConnectionError) {
    console.log('handling this error as a db connection error');
    return res.status(500).send({ errors: [{ message: err.reason }] });
  }

  //generic error should also have same format
  res.status(400).send({
    errors: [{ message: 'something went wrong' }],
  });
};
```

### 145. moving logic into Errors

- currently error-handler middleware is holding all the logic for different type of errors
- TODO:
  - move logic out to errors
    - create serializeErrors() function to create response object with common structure
      - RequestValidationError -> create serializeErrors() function
      - DatabaseConnectionError -> create serializeErrors() function
    - status code

```ts
//database-connection-error.ts
import { ValidationError } from 'express-validator';

export class DatabaseConnectionError extends Error {
  reason = 'Error connecting to database';
  statusCode = 500;

  constructor() {
    super();

    //only because we are extending a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
//usage: throw new DatabaseConnectionError(reason);
```

```ts
//request-validation-error.ts
import { ValidationError } from 'express-validator';

export class RequestValidationError extends Error {
  statusCode = 400;

  constructor(private errors: ValidationError[]) {
    super();

    //only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => {
      if (err.type === 'field') {
        return { message: err.msg, field: err.path };
      }
      return { message: err.msg };
    });
  }
}
//usage: throw new RequestValidationError(errors);
```

### 146. serializeErrors' not assignable to the same proeprty in the base type 'CustomError'

- When adding the `serializeErrors` function in the next lecture you will see the following error:

- [auth] src/errors/request-validation-error.ts(14,3): error TS2416: Property 'serializeErrors' in type 'RequestValidationError' is not assignable to the same property in base type 'CustomError'.
- This is caused by the modifications we previously made in regard to express-validator v7.

- FIX:

```ts
  serializeErrors() {
    return this.errors.map((err) => {
      if (err.type === 'field') {
        return { message: err.msg, field: err.path };
      }
      return { message: err.msg };
    });
  }
```

### 147. verifying our custom errors

- TODO: ensure that serialize errors always returns the common response structure
- ie. ensuring implementation is correct
- we will create AbstractClass (option 2)

![udemy-docker-section07-147-verifying-custom-errors.png](exercise_files/udemy-docker-section07-147-verifying-custom-errors.png)

```ts
{
  errors:{
    message: string, field?:string
  }[]
}
```

- OPTION 1: CustomError interface

```ts
interface CustomError {
  statusCode: number;
  serializeErrors(): {
    message: string;
    field?: string;
  }[];
}

export class RequestValidationError extends Error implements CustomError {}
```

- OPTION 2: CustomError Abstract Class
  - Abstract class -> cannot be instantiated
  - its used to set up requirements for subclasses
  - it DOES create a Class when translated to JS (so then can use it in 'instance of' checks)
  - RequestValidationError and DatabaseConnectionError will extend this CustomError abstract class

### 148. Final Error Related Code

- so Custom-error class is an abstract class that will define the required signatures
- auth/src/errors/custom-error.ts
- TODO: pass in message to constructor -> if we pass string message to super() it will still help show console errors eg. `throw new Error('fdfsdfsdfsd')`

```ts
//auth/src/errors/custom-error.ts

export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}

/*
//testing abstract class
class NotFoundError extends CustomError{
  statusCode = 404
}
*/
```

```ts
////request-validation-error.ts
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {}
```

```ts
//database-connection-error.ts
import { CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError {}
```

- so now Error-handler middleware can use the custom-error

```ts
//auth/src/errors/custom-error.ts
import { Request, Response, NextFunction } from 'express';

import { CustomError } from '../errors/custom-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    console.log('handling this error as a request validation error');
    return res
      .status(err.statusCode)
      .send({ errors: err.serializeErrors(), statusCode: err.statusCode });
  }

  res.status(400).send({
    message: 'something went wrong',
  });
};
```

![udemy-docker-section07-148-final-error-related-code.png](exercise_files/udemy-docker-section07-148-final-error-related-code.png)

### 149. how to define new custom errors

- TODO: write error handler for route that does not exist

```ts
import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super('route not found');

    //only because we are extending a built in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: 'not found' }];
  }
}
```

- TEST: throw new NotFoundError()

```ts
//...
import { NotFoundError } from './errors/not-found-error';

//testing not found error
app.all('*', () => {
  throw new NotFoundError();
});
```

### 150. uh oh async error handling

- `async` breaks it because instead of just returning a value, it returns a promise which will eventually resolve to some value in the future
- we have to rely on calling 'next' function for async passing in the error
- FIX: dont call next(), use a npm package
- TODO: installing a npm package - `express-async-errors`
- that will wait for the async (req, res)=>{} function to complete

```ts
import 'express-async-errors';

app.all('*', async (req, res, next) => {
  throw new NotFoundError();
});
```

## section 08 - database management and modeling (1hr27min)

- 16 lessons / 1hr 27min / lesson 151-166

### 151. creating databases in kubernetes

![udemy-docker-section08-151-auth-service-create-database.png](exercise_files/udemy-docker-section08-151-auth-service-create-database.png)

- each service will use mongoose to interface with its own mongodb instance (1 db per service)

#### auth/ install mongoose

- TODO: add mongoose to project
- folder: `section05-ticketing/auth/`

```
pnpm i mongoose
```

##### REFRESH MEMORY

![Kubernetes - types of services](exercise_files/udemy-docker-section04-77-types-of-services.png)

- cluster IP -> (we use often) sets up an easy to remember url to access a pod (only exposes pods in the cluster)
- for communication between pods in a kubernetes cluster. eg. `infra/k8s/posts-depl.yaml`, `infra/k8s/event-bus-depl.yaml`

#### mongodb depl

- TODO: install instance of mongodb in kubernetes cluster
- we will run mongodb inside a pod
- pods are created via deployments
- to communicate with pod -> create a `cluster ip service`
- create `section05-ticketing/infra/k8s/auth-mongo-depl.yaml`

##### install mongodb

- folder: `section05-ticketing/infra/k8s/auth-mongo-depl.yaml`
- NOTE: giving pod a label: `template:metadata:labels:app: auth-mongo`
- NOTE: selector is how deployment finds the pods it will create: `selector:matchLabels:app: auth-mongo`
- NOTE: `image: mongo` comes from docker-hub

#### cluster ip service

- TODO: also create cluster ip service so can connect to the pod
- NOTE: inside service -> `spec: selector: app: auth-mongo` -> this specifies which pods the service has access to
- NOTE: default mongodb port for listening to traffic -> `27017`

```yaml
# kubernetes deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-mongo-depl
spec:
  replicas: 1
  selector:
    matchLabels:
      app: auth-mongo
  template:
    metadata:
      labels:
        app: auth-mongo
    spec:
      containers:
        - name: auth-mongo
          image: mongo
---
# cluster ip service
apiVersion: v1
kind: Service
metadata:
  name: auth-mongo-srv
spec:
  selector:
    app: auth-mongo
  ports:
    - name: db
      protocol: TCP
      port: 27017
      targetPort: 27017
```

- NOTE: `ports: - name: db` -> name is just for console log
- to deploy with skaffold: `skaffold dev`
- OR to deploy with kubectl: `kubectl apply -f auth-depl.yaml`

#### ensure kubernetes deployment

- this just ensures we are running a copy of mongodb for our service

```cmd
kubectl get pods
```

```output
NAME                               READY   STATUS    RESTARTS   AGE
auth-depl-55cdb4bff9-d75ns         1/1     Running   0          52s
auth-mongo-depl-576b56cb89-w9hqq   1/1     Running   0          52s
```

#### testing deployment

- https://ticketing.dev/api/users/currentuser
- type in browser `thisisunsafe` if there is Error regarding SSL certificate

### 152. connecting to mongodb

- creating code so `auth` service can reach out to our deployed mongodb instance
- NOTE: currently the deployment creates a pod that will host the db
- NOTE: IF THE POD IS DELETED, THE DB IS DELETED -> this will later be hosted on persistent storage
- TODO: add mongoose in `auth/src/index.ts`
- NOTE: mongoose package is already installed
- mongodb instance is in a pod on the kubernete cluster
- you can reach the instance via `cluster ip service` ie. you put the name of the cluster ip service
- so `auth-mongo-srv` (see `infr/k8s/auth-mongo-depl.yaml`) i how we will connect to the service
- NB: dont forget the mongodb port (27017) you can get this from documentation
- NB: dont forget the name of the db (if you makeup a name, mongo will use that): we use `auth`
- NOTE: as of mongoose v6 there is no options object after mongoose connect string.

```ts
//auth/src/index.ts
import mongoose from 'mongoose';
//...

const start = async () => {
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth'); //connecting to mongodb on cluster ip service
    console.log('connected to mongodb');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!');
    console.log('visit: https://ticketing.dev/api/users/currentuser');
  });
};

start();
```

- expected out:

```console
[auth] connected to mongodb
[auth] Listening on port 3000!!!!!!
```

### 153. understanding signup flow

- auth/src/routes/signup.ts

![udemy-docker-section08-153-signup-flow.png](exercise_files/udemy-docker-section08-153-signup-flow.png)

#### Steps

1. react app makes request to Auth service (email + password)
2. check - does email already exist -> check in db
3. hash password
4. create new user and save to mongodb
5. user is now logged in -> respond with cookie/jwt/something

- requires mongoose User model
- mongoose doesnt work well with typescript

### 154. getting typescript and mongoose to cooperate

![udemy-docker-section08-154-model-vs-document.png](exercise_files/udemy-docker-section08-154-model-vs-document.png)

- `mongoose user model` -> represents entire collection of users
- `mongoose user document` -> represents one single user

#### issues with mongoose/typescript

1. - creating a new user document, typescript wants to make sure correct properties are provided
2. - properties passed to constructor dont match up with properties available on a user. BUT typescript wants to know this

### 155. creating the user model

- creating a mongoose `user` schema tells mongoose all the properties a user will have
- note: working with mongoose.Schema `type:String`, this is for mongoose.. not typescript (which would use `:string`), it is js type `String`
- we can feed this Schema into mongoose, and mongoose will create a new model from it
- this model is how we access a big set of data inside mongodb database
- auth/src/models/user.ts

```ts
//auth/src/models/user.ts

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

export { User };
```

### 156. type checking User properties

- if we try create an instance on User, typescript doesnt know what types are of the properties it can receive (only mongoose schema)

```ts
new User({
  email: 'test@test.com',
  password: 'blah',
});
```

- FIX: for Typescript, create interfaces and a `buildUser()` function instead of calling `new User({})` directly
- ie. we add a step to get typescript involved in creating instance of model

```ts
//src/models/user.ts

//an interface that describes the properties that are required to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

const buildUser = (attrs: UserAttrs) => {
  return new User(attrs);
};
```

- then calling `buildUser()` will have full Typescript support
- `buildUser` is the function we also export

```ts
//NOTE: MORE UPDATED CODE TO COME
import mongoose from 'mongoose';

//requirements for a USER -> an interface that describes the properties that are required to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

const buildUser = (attrs: UserAttrs) => {
  return new User(attrs);
};

export { User, buildUser };
```

### 157. Adding static properties to Model

- we want to make it easier

```ts
User.build({
  email: '',
  password: '',
});
```

- this will remove the need to export `buildUser`

#### adding static properties to the model

- typescript doesnt understand adding `statics.build` to `userSchema` object
- FIX: add an interface that tells typescript there is a build function available on the User model
- FIX: add this interface to tell typescript `const User = mongoose.model<any, UserModel>('User', userSchema);`

```ts
//section05-13-ticketing/src/models/user.ts

//...
//USER MODEL - methods associated with User model -> an interface that describes the properties that a User model has
interface UserModel extends mongoose.Model<any> {
  build(attrs: UserAttrs): any;
}

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// this is later updated...
const User = mongoose.model<any, UserModel>('User', userSchema);

export { User };
```

- usage and typescript now understand the properties build function should receive (no more vscode warnings)

```ts
User.build({
  email: 'test@test.com',
  password: 'password',
});
```

### 158. defining extra Document properties

- the properties that we pass to the User constructor don't necessarily match up with the properties available on a user
- TODO: add an interface that describes the properties that a User Document has (single user)
- NOTE: the return type is different to `UserAttrs` because `UserDoc` can contain additional properties added by eg. mongoose

```ts
//USER MODEL - methods associated with User model -> an interface that describes the properties that a User model has
interface UserModel extends mongoose.Model<any> {
  build(attrs: UserAttrs): any;
}

//USER DOCUMENT -> an interface that describes the properties that a User Document has (single user)
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  //additional properties mongoose adds
}

//...
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);
```

- usage -> hovering over user will tell us the return type is `UserDoc`

```ts
const user = User.build({
  email: 'test@test.com',
  password: 'password',
});
```

### 159. what's the angle branckets? (Generics)

![udemy-docker-section08-159-typescript-generics.png](exercise_files/udemy-docker-section08-159-typescript-generics.png)

- generics -> think of it as types provided to a function as arguments (order sensative)
- generics allows us to customize the types used inside a Class/function/interface

### 160. user creation

- auth/src/routes/signup.ts
- check if email already used
- otherwise, create user and save to mongodb
- NOTE: at this point, password is still NOT hashed
- TODO: test with POSTMAN

```ts
import { User } from '../models/user';

//...

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('password must be between 4 and 20 characters'),
  ],

  //validation using express-validator
  async (req: Request, res: Response) => {
    //return the error to requestor
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    //check if user exists
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('email in use');
      return res.send({});
    }

    //password hash

    //create user
    const user = User.build({ email, password });
    await user.save(); //save to db

    res.status(201).send(user);
  }
);

//...
```

- TODO:
  1. password should be hashed
  2. password should NOT be returned after user is created
  3. if email already used, do not just send back an empty object

### 161. proper error handling

- need to tell user why creating user failed.
- can create a custom Error handler `BadRequestError` that we will use anytime there is bad input from user.
- src/errors/bad-request-error.ts

```ts
//src/errors/bad-request-error.ts
import { CustomError } from './custom-error';

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype); //extending a class of javascript
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: this.message }];
  }
}
```

- update to throw `BadRequestError` and pass-in message

```ts
//src/routes/signup.ts
import { BadRequestError } from '../errors/bad-request-error';

if (existingUser) {
  // console.log('email in use');
  // return res.send({});
  throw new BadRequestError('Email in use');
}
```

### 162. note on password hashing

- use given code if you dont want to do this part

### 163. reminder on password hashing

- TODO: hashing user password

![udemy-docker-section08-163-password-hashing-bad-approach.png](exercise_files/udemy-docker-section08-163-password-hashing-bad-approach.png)

- basically we dont store passwords in db because of security concerns (eg. being hacked will expose the password / developers can access database data)

#### Signup flow

![sign-up flow](exercise_files/udemy-docker-section08-163-password-hashing-sign-up-flow.png)

- FIX -> hash the password -> gives unique characters -> we then store the hashed string in db.

#### sign-in flow

![sign-in flow](exercise_files/udemy-docker-section08-163-password-hashing-sign-in-flow.png)

- when user signs in, we also hash the entered password
- we find the user in the db (if it exists)
- and compare the hashed passwords

### 164. adding password hashing

- TODO: split up hashing logic functions into separate class (not in src/models/user.ts) that is responsible for taking a string and hashing it
- TODO: create a function to compare 2 hashed strings

- `scrypt` is hashing function (callback based)
- `promisify` takes callback and makes it a promise-based implementation
- salt is what we use to create a random seed
- when you use scrypt, you get back a buffer (array with raw-data inside) -> type cast `as Buffer`
- note: returning the hash concatenated with the salt

### 165. comparing hashed password

#### get the hashed password

- so the toHash function returns the password hash AND salt
- to get the individual parts: `const [hashedPassword, salt] = storedPassword.split('.');`

#### hash the supplied password

- hash suplied password and convert buffer to hex

```ts
//src/services/password.ts
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt); //going from callback implementation to async implementation

import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt); //going from callback implementation to async implementation

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');

    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buf.toString('hex') === hashedPassword;
  }
}
```

### 166. mongoose pre-save hooks

- TODO: import password class into `src/models/user.ts`
- when we try save user to database, the saving will be intercepted -> the password will be hashed and overwritten on the document
- NOTE:
- `userSchema.pre('save', async function (done) {}` is a middleware function for mongoose (anytime we save document, we will execute the function)
- need to call `done()` once we do what we need to
- NOTE: we need to use an `function` keyword to maintain `this` (Document) context and not an arrow function
- only hash password if password was updated
- TEST WITH POSTMAN: it should return hashed password

```ts
//src/models/user.ts
import { Password } from '../services/password';

userSchema.pre('save', async function (done) {
  //only hash password if password was updated
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});
```

TODO: response -> how to consider a user as logged-in (eg. jwt/cookie/session)

---

## section 09 - authentication strategies and options (2hr48min)

- lesson 167 -> 192 (26 lessons) / 2hr 48min

### 167. fundamental authentication strategies

- User auth with microservices is unsolved problem
- many ways to do it
- MAIN GOAL IS TO DECIDE 'IS A PERSON LOGGED IN?'

#### FUNDAMENTAL - OPTION 1

![udemy-docker-section09-167-fundamental-option-1.png](exercise_files/udemy-docker-section09-167-fundamental-option-1.png)

- HOW? let a centralized service decide if a user is logged in eg. ask an `Auth service`
- service communicates with another service (the auth service) -> will receive the JWT/Cookie and decide if user authenticated
- CONS -> if auth service goes down. nothing in app that requires authentication checks will work

##### FUNDAMENTAL - OPTION 1.1 (variation of option 1)

![udemy-docker-section09-167-fundamental-option-1.1.png](exercise_files/udemy-docker-section09-167-fundamental-option-1.1.png)

- any request from application will first go through a central gateway (that checks if user is authenticated)

##### FUNDAMENTAL - OPTION 2

![udemy-docker-section09-167-fundamental-option-2.png](exercise_files/udemy-docker-section09-167-fundamental-option-2.png)

- teach each service to decide if a user is authenticated ie. service looks at jwt/cookie to decide if user is authenticated
- no dependency to outside
- CONS -> auth logic will be duplicated in each service (BUT can be refactored to shared library)
- there are downsides for micro services communicating with each other

### 168. huge issues with authentication strategies

#### CONS of each service managing auth logic (OPTION 2)

- once authenticated with (sign-in service), they can use JWT/cookie to do anything
- PROBLEM is, any other service (eg. orders service) will ONLY look at the valid JWT token and NOT go back to authentication service to validate

##### explained...

- say an admin user needs to ban a user (UserABC) -> sends request to ban user to Auth service (handled by user management logic) -> DB updated to NOT have access
- eg. now Auth Service updates DB -> user `hasAccess` updated to false -> now AuthService has noted banned user
- PROBLEM -> follow up requests (to other services eg. Order Service) only looking at valid access token to determine if user is authenticated (it is decoupled -> doesnt communicate with Auth service)

![udemy-docker-section09-168-banned-user.png](exercise_files/udemy-docker-section09-168-banned-user.png)

### 169. so which solution?

![udemy-docker-section09-169-options-picking-options.png](exercise_files/udemy-docker-section09-169-options-picking-options.png)

- option 2 because of independent services

### 170. solving issues with option2 - tokens with expiration (OPTIONAL)

- TODO: figure out how to ban users with authentication state
- this lesson is optional because we wont be implementing what is discussed
- FIX: the solution here is the token/cookie has a time limit (eg. 15 min)

![udemy-docker-section09-170-expiring-tokens.png](exercise_files/udemy-docker-section09-170-expiring-tokens.png)

#### expired token?

- so UserABC at some point will have an expired token (eg. 30min old JWT token and tokens have been set to have time limit of 15min)
- so the Order Service logic will say token is expired:
  1. can get new refresh token from Auth Service (and send back to userABC as well)
  2. reject request letting user know they need to refresh token -> client needs to visit authentication service
- PROBLEM -> if token is still valid (15min till expire), they have until token expiration to access the site

#### immediate ban -> No access

- TODO: this implementation Authentication Service bans user AND this change should reflect immediately in other services
- FIX: how? also emit a 'user banned' event to EVENT BUS -> which sends this off to other services - which could store this event in short-lived cache
  - dont want to store this list of banned
  - the banned event time limit just needs to be the same time as lifecycle of a jwt token/cookie - afterwards, the service will know the jwt is expired

![udemy-docker-section09-170-banned-event.png](exercise_files/udemy-docker-section09-170-banned-event.png)

### 171. reminder on cookies vs JWT

- difference between JWT and cookies - NOT THE SAME THING

#### COOKIES

- when server sends a response back from server, it can optionally include a header with `Set-Cookie` and a value.
- this cookie is stored by the browser and - later when a request is made to server (same domain + port), the header of the request will included this cookie.

![udemy-docker-section09-171-cookies.png](exercise_files/udemy-docker-section09-171-cookies.png)

#### JWT

- JWT takes a payload (any information we want to have access to) -> put in JWT creation algorithm -> gives us a Jason web token (JWT) (3 parts)
- we can take the JWT and decode it to extract the information

![udemy-docker-section09-171-JWT.png](exercise_files/udemy-docker-section09-171-JWT.png)

- the token can be communicated between browser and server:
  1. JWT put inside request Authorization header
  2. JWT put in body of request
  3. JWT put inside request header cookie - here JWT stores auth information, cookie is the transport mechanism

![udemy-docker-section09-171-jwt-token-include-options.png](exercise_files/udemy-docker-section09-171-jwt-token-include-options.png)

### Cookies vs JWT

#### Cookies

- cookies are a transport mechanism
- moves any kind of data between browser and server
- automatically managed by browser

#### JWT

- authentication/authorization mechanism
- store any data we want
- have to manage it manually

![udemy-docker-section09-171-cookies-vs-jwt.png](exercise_files/udemy-docker-section09-171-cookies-vs-jwt.png)

### 172. microservices auth requirements

- cookies -> cookie based authentication -> is when we have a cookie that stores the encrypted token

![udemy-docker-section09-172-auth-requirements-jwt.png](exercise_files/udemy-docker-section09-172-auth-requirements-jwt.png)

#### Requirement 1 - needs to be able to store more info in auth mechanism

- fundamental option 2 -> the auth mechanism will also contain more details about the logged in user (more than just isAuthenticated, eg. id/email/has credit card linked)

![udemy-docker-section09-172-auth-requirements-store-additional-info.png](exercise_files/udemy-docker-section09-172-auth-requirements-store-additional-info.png)

#### Requirement 2 - has to include authorization info in auth mechanism

- if feature needs specific authorization before being called eg. coupon generation limited to admin user
  - check if logged-in
  - check if user is an admin -> authorized to issue coupons

![udemy-docker-section09-172-auth-requirements-authorization.png](exercise_files/udemy-docker-section09-172-auth-requirements-authorization.png)

#### Requirement 3 - built-in sercure way of expiring tokens

- tamper proof tokens that can expire / be invalidated
  - JWT will encode expiration time

#### Requirement 4 - auth mechanism compatible with multiple coding languages

- auth mechanism must be usable by multiple languages
  - cookies dont have same implementation accross different coding languages
- must be easily implementable
- shouldnt require backend db to store auth data
  - JWT doesnt require backend db store to authenticate user
  - cookies -> sometimes session id's are stored in cookies that refers to session on db

### 173. issues with JWT server side rendering

- TODO: decide how to move JWT token around

#### normal flow of react app

1. initial request for html (script tags)
2. request for js files -> response with js
3. react app then request for data -> response with data - but authentication info only required when user requests for data from backend

![udemy-docker-section09-173-normal-react-data-flow.png](exercise_files/udemy-docker-section09-173-normal-react-data-flow.png)

#### server side rendering

- with SSR, initial request returns the fully rendered html file with content
- so authentication data needs to be available from the initial request to ticketing.dev

![udemy-docker-section09-173-authentication-with-SSR.png](exercise_files/udemy-docker-section09-173-authentication-with-SSR.png)

- the problem is, with the initial load (html), script tag can have js code to load up some code but it cant be customized eg. to first execute some js
- PROBLEM - cant intercept the intial page load Request to put authorization code in request header, or put token in Request body (requires js)
- with a cookie the browser attaches it automatically to header
- so the only way to communicate data between browser and backend on initial load is by storing JWT in cookie

![udemy-docker-section09-173-SSR-headers.png](exercise_files/udemy-docker-section09-173-SSR-headers.png)

### 174. cookies and encryption

- JWT as authentication mechanism
- store and manage JWT in cookies
- use a library to read data out of cookie: `cookie-session`
- cookie-session -> you can store information in the cookie
  - must be easily understood between different languages
  - issues if `cookie-session` encrypts the data as encryption algorithm might not be supported across different languages.
  - FIX: do not encrypt cookie contents - as JWT itself is tamper resistent

![udemy-docker-section09-174-jwt-inside-cookie.png](exercise_files/udemy-docker-section09-174-jwt-inside-cookie.png)

### 175. adding session support

- auth/ folder

```cmd
pnpm i cookie-session @types/cookie-session
```

- TODO: import `cookie-session` and wireup to express app as middleware
- auth/src/index.ts
- NOTE: JWT is encrypted so we dont mind cookie is not `signed: false`
- cookies will only be used if user is visiting over secure https connection `secure: true`
- and add to express: `app.set('trust proxy', true);` -> traffic is being proxied through application through nginx, express will see stuff is being proxied and will raise that it doesnt trust the http connection -> so we add this so express is aware it is behind a proxy of nginx and trust traffic as secure.

```ts
// auth/src/index.ts
import cookieSession from 'cookie-session';

//...
app.set('trust proxy', true);

app.use(json());

app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);
```

### 176. generating JWT and storing it inside a cookie

- generating JWT and storing it inside a cookie

#### storing data in cookie

- storing data in cookie via `req.session.` -> any information we store on `session` object will be serialized by `cookie-session` and stored inside the cookie.

#### generating JWT

- package `jsonwebtoken`
- folder auth/

```cmd
pnpm i jsonwebtoken @types/jsonwebtoken
```

- import `import jwt from 'jsonwebtoken';`
- JWT has method `sign(payload, signing-key)` -> function receives a payload (information to store) and signing-key (secret)
- JWT has method `verify(token, secret)` -> verify incoming jwt
- after saving user to database, add JWT to `req.session`
- the payload for JWT should store information about the user
  - we have mongodb id
  - email
- NOTE: we need to add private key (signing-secret) - here we are hardcoding but it should be secure
- NOTE: if you add a callback function, it will be async, else it will be synchronous
- NOTE: setting jwt directly on req.session, typescript will complain, so instead, just assign a new object to req.session with jwt as prop
- auth/src/routes/signup.ts

```ts
//auth/src/routes/signup.ts

//...
import jwt from 'jsonwebtoken';

await user.save();
//generate JWT
const userJwt = jwt.sign(
  {
    id: user.id,
    email: user.email,
  },
  'asdf' //private key
);
//store on req.session object
req.session = {
  jwt: userJwt,
};

//...
```

- NOTE: you have run: `skaffold dev`
- when testing with POSTMAN -> our settings specify to only generate cookie if over https

  - POST
  - URL: https://ticketing.dev/api/users/signup
  - Content-Type: application/json
  - body: raw -> JSON ->

  ```json
  {
    "email": "test@test.com",
    "password": "blabla"
  }
  ```

![udemy-docker-section09-176-cookie-generated.png](exercise_files/udemy-docker-section09-176-cookie-generated.png)

- NOTE: email can only be used once, otherwise clear the mongodb deployment and try again (but NOTE that mongodb database is set up in kubernetes)

![udemy-docker-section09-177-kubernetes-delete-mongodb-deployment.png](exercise_files/udemy-docker-section09-177-kubernetes-delete-mongodb-deployment.png)

- delete and re-rerun `skaffold dev`

#### troubleshoot

- when testing with POSTMAN -> if you get errors regarding ssl certificates when accessing via https://ticketing.dev/
- FIX: turn off ssl-certificate verification

## ![udemy-docker-section09-176-ssl-off.png](exercise_files/udemy-docker-section09-176-ssl-off.png)

### 177. JWT signing keys

- the cookie session value contains the `{jwt:userJwt}` object that gets turned into json and gets base 64 encoded

#### base64decode.org

- to decode: [https://www.base64decode.org/](https://www.base64decode.org/)
- paste the cookie from POSTMAN to base64decode:

```
eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJalkzTXpnMk1tWmpZMlk0WWpBNVkyWTFZVFF6TVRJM1l5SXNJbVZ0WVdsc0lqb2lkR1Z6ZEVCMFpYTjBMbU52YlNJc0ltbGhkQ0k2TVRjek1UYzBPRFl3TkgwLlFIM19YNUktZHNFTzdIQXVlRWVaUGhaRzJGeE9Tb01tMnoyTGJ0WTRxcXMifQ%3D%3D
```

![udemy-docker-section09-177-base64-decode.png](exercise_files/udemy-docker-section09-177-base64-decode.png)

- the decoded json web token:

```cmd
{"jwt":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Mzg2MmZjY2Y4YjA5Y2Y1YTQzMTI3YyIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImlhdCI6MTczMTc0ODYwNH0.QH3_X5I-dsEO7HAueEeZPhZG2FxOSoMm2z2LbtY4qqs"}

```

#### jwt.io

- notice it has 3 parts separated by '.'
- to make sense of this: goto `jwt.io` and paste the decoded TOKEN...
- NOTE: just the value of jwt: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Mzg2MmZjY2Y4YjA5Y2Y1YTQzMTI3YyIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImlhdCI6MTczMTc0ODYwNH0.QH3_X5I-dsEO7HAueEeZPhZG2FxOSoMm2z2LbtY4qqs`

![udemy-docker-section09-177-jwt.io.png](exercise_files/udemy-docker-section09-177-jwt.io.png)

- note we enter our 256bit secret we encoded in `auth/routes/signup.ts`
- ALSO NOTE: this is not the correct way to do it...(DO NOT HARDCODE... we later update this code and put it in kubernetes)

![udemy-docker-section09-177-secret.png](exercise_files/udemy-docker-section09-177-secret.png)

- expected that WITH the secret entered, the token is still the same as what 64bitdecode gives: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Mzg2MmZjY2Y4YjA5Y2Y1YTQzMTI3YyIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImlhdCI6MTczMTc0ODYwNH0.QH3_X5I-dsEO7HAueEeZPhZG2FxOSoMm2z2LbtY4qqs`

- if the correct secret is entered, the JWT token value will match 64bitdecode token value

![correct](exercise_files/udemy-docker-section09-177-secret-correct.png)

- an incorrect secret -> yield incorrect JWT token (compared to 64bitdecode)

![incorrect](exercise_files/udemy-docker-section09-177-secret-incorrect.png)

### regarding the signing key...

![udemy-docker-section09-177-jwt-equals-payload+signing-key.png](exercise_files/udemy-docker-section09-177-jwt-equals-payload+signing-key.png)

- when another service receives the jwt token and it needs to decide if the token is valid, it needs this signing key
- the signing key needs to be shared with the other services but nobody else should be able to get hold of this signing key
- writing the signing key in the code `auth/routes/signup.ts` IS WRONG (for Production)
- the signing key should be stored securely in our application, easily shared across services

![udemy-docker-section09-177-shared-signing-key-across-services.png](exercise_files/udemy-docker-section09-177-shared-signing-key-across-services.png)

### 178. securely storing secrets with kubernetes

- this signing key should be securely stored and we can do this with kubernetes by using secrets
- NOTE: the Pod contains the container (eg. Auth, Orders, Payments) and the container has environment variables
- using secrets, we can get the signing secret to all services that need it

![udemy-docker-section09-178-kubernetes-secrets.png](exercise_files/udemy-docker-section09-178-kubernetes-secrets.png)

### 179. creating and accessing secrets

#### creating a kubernetes secret - imperative approach

- eg. create a secret named `jwt-secret` with key:`JWT_KEY` value `asdf`
- you can assign many key/value pairs to a secret
- this is an imperative command -> ie. directly create a kubernetes object
- the reason this is done imperatively is because we do NOT want our secret stored in the config file

![udemy-docker-section09-179-imperatively-creating-secret.png](exercise_files/udemy-docker-section09-179-imperatively-creating-secret.png)

- from section05-ticketing/

```cmd
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
```

```cmd-out
secret/jwt-secret created
```

- NOTE: this command should be stored somewhere (not viewable in repository and referenced everytime you start a new cluster)
- testing/development environment
- downside of imperative approach, you have to remember the secrets

#### creating a kubernetes secret - declarative approach

- whereas with config files it is more declarative approach where the config file gets applied
- technially we can store this in an environment variable locally on machine and refer to from config file...
- production env

##### Create Kubernetes secret from an .env file

- From [Q&A](https://www.udemy.com/course/microservices-with-node-js-and-react/learn/lecture/19119820#questions/20826228)

- Kubernetes can consume key-value pairs from any plain text format file such as .txt or .env.
- To do so, created a `.kubectl.env` file with a key-value pair in it:

```env
<!-- .kubectl.env -->
JWT_KEY=secret_key
```

- `kubectl delete secret jwt-secret` - Before you can consume it you need to remove the key created from a string
- `kubectl create secret generic jwt-secret --from-env-file=.kubectl.env` - create a secret again from the file
- `kubectl get secrets` - To list all the created secrets issue a Kubectl command
- `kubectl describe secret jwt-secret` - to get data on the jwt-secret:

### TODO: get the secret into the pods

- the secret should be set as environment variables for the pods
- this is set in the deployment config files -> tells kubernetes (when creating pod) to find secret -> get key/value -> assign as environment variables in container
- infra/k8s/auth-depl.yaml

```yaml
# infra/k8s/auth-depl.yaml
#...
spec:
  containers:
    - name: auth
      # image: clarklindev/auth:latest/auth
      image: asia.gcr.io/golden-index-441407-u9/auth
      env:
        - name: JWT_KEY
          valueFrom:
            secretKeyRef:
              name: jwt-secret
              key: JWT_KEY
#...
```

- after this change skaffold should pick-up a change was made

![udemy-docker-section09-179-accessing-secret.png](exercise_files/udemy-docker-section09-179-accessing-secret.png)

- NOTE: if you try load a secret (that does not exist) in a pod -> kubernetes wont start up that pod.

### 180. accessing the env variable in a pod

- NOTE: at this point the secret has been created, the container has a reference to the secret
- TODO: reference from pod (auth/src/routes/signup.ts) the env variable `JWT_KEY`:

  - src/routes/signup.ts

- typescript complains about the environment variable possible not existing...

```ts
//src/routes/signup.ts
const userJwt = jwt.sign(
  {
    id: user.id, //id from mongodb
    email: user.email,
  },
  // 'asdf' //signing key NOTE: for production this should go in kubernetes
  process.env.JWT_KEY!
);
```

- FIX: build check in index.ts of project:

```ts
//auth/src/index.ts
//...
if (!process.env.JWT_KEY) {
  throw new Error('JWT_KEY must be defined');
}
//...
```

![udemy-docker-section09-180-env-variable-check-on-start.png](exercise_files/udemy-docker-section09-180-env-variable-check-on-start.png)

- if we add the check to index.ts and typscript still complains in src/routes/signup.ts, we can tell typescript to ignore this check by appending '!'
  - eg: `process.env.JWT_KEY!`

### 181. common response properties

- note how `signup.ts` successful signup of user calls `res.status(201).send(user);` which returns the whole user object

![udemy-docker-section09-181-signup-returns-full-user-data.png](exercise_files/udemy-docker-section09-181-signup-returns-full-user-data.png)

- we want to remove `password`, and `__v` from response
- not all databases have the same consistent response...
  - eg. mongodb returns `_id`

![udemy-docker-section09-181-inconsistent-db-response.png](exercise_files/udemy-docker-section09-181-inconsistent-db-response.png)

- TODO: we need to ensure that when fetching data (from db) there is consistent response from the different services (accross different language/db's) as well.
  - remove \_\_v
  - remove password
  - change \_id to id

### 182. Formatting JSON properties

#### JSON.stringify -> converts JS object to JSON

- a lesson on JS and JSON
- in browser console...

```js
const person = { name: 'alex' };
JSON.stringify(person);
```

```out
"{"name": "alex"}"
```

#### JSON lesson - override how js changes a object to json

- if you add `toJSON()`
- when you stringify personTwo, js will call this `toJSON()` method

```js
const personTwo = {
  name: 'alex',
  toJSON() {
    return 1;
  },
};
JSON.stringify(personTwo);
```

```out
"1"
```

![udemy-docker-section09-182-JSON-lesson.png](exercise_files/udemy-docker-section09-182-JSON-lesson.png)

#### toJSON() but for mongoose schema

- src/models/user.ts schema's 2nd property is `toJSON:{}` but implemented as an object
- we will use `transform(doc, ret)`
  - `doc` -> mongoose document which is being converted
  - `ret` -> plain object representation which has been converted
- we will modify `ret` object directly in place
- in javascript we use `delete` to remove a property off an object
- instead of deleting version key `__v`, you can call `versionKey: false`
- for id, first assign then delete \_id: `ret.id = ret._id; delete ret._id;`

```ts
//src/models/user.ts
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
      // versionKey: false,
    },
  }
);
```

- NOTE: this is atypical for model definition file -> transform is a view responsibility (in mvc) so it shouldnt really be part of model. return data transformation should be handled by view not the model.

### 183. Sign-in flow

- the signin flow:
  - with signin, continues if user exists in db
  - compares hashed stored password with entered password (hashed)
  - if the same -> user is considered logged in

![udemy-docker-section09-183-signin-flow.png](exercise_files/udemy-docker-section09-183-signin-flow.png)

- TODO: validation on incoming request (email / password)
- test with POSTMAN -> POST: `https://ticketing.dev/api/users/signin` header:Content-Type application/json body: {email, password}

```ts
//src/routes/signin.ts
import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('email invalid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('you must supply a password'),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
  }
);

export { router as signinRouter };
```

### 184. common request validation middleware

- extracting error checking (common error handling) code into middleware
- error handling with middleware using the reusable `validateRequest`

- NOTE:
  - normal middleware has 3 params (req, res, next)
  - error handling middleware has 4 params (first is err)
- `src/middleware/validate-request.ts`

```ts
//src/middleware/validate-request.ts
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  next();
};
```

- using the iddleware in: `src/routes/signup.ts`
- note: middleware order matters (they run sequentially in-order)
- so first do validation, then error-handling `validateRequest`

```ts
// src/routes/signup.ts
import {
  body,
  // validationResult //- moved to middleware
} from 'express-validator';
// import { RequestValidationError } from '../errors/request-validation-error'; - moved to middleware
import { validateRequest } from '../middlewares/validate-request';

//...
router.post(
  '/api/users/signup',
  //MIDDLEWARE
  //validation
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('password must be between 4 and 20 characters'),
  ],

  //error handling
  validateRequest,

  async (req: Request, res: Result) => {}
);

//...
```

### 185. sign in logic

- TODO: running a query on collection of users
  - when working with Mongodb need to import the model (User model): `import { User } from '../models/user'`
- for sign-in we use a generic error because its safer
- NOTE: throwing errors gets "picked up" by `middlewares/error-handler.ts`
  - need to import `BadRequestError`
- use the `Password` service methods to compare passwords
- once we confirmed passwords:

  1. generate token (`import jwt from 'jsonwebtoken'`)
  2. store in req.session object

  - store the found db user (`existingUser`)

  3. send response back

  - 201 (created something)
  - 200 (success)

- NOTE: docker / kubernetes is running
- NOTE: skaffold is running

```ts
//src/routes/signin.ts

import express, { Request, Response } from 'express';
import {
  body,
  // validationResult //- moved to middleware
} from 'express-validator';
// import { RequestValidationError } from '../errors/request-validation-error'; - moved to middleware
import jwt from 'jsonwebtoken';
import { validateRequest } from '../middlewares/validate-request';

import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('email invalid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('you must supply a password'),
  ],

  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch = await Password.compare();
  }
);

export { router as signinRouter };
```

### 187. Current-user handler

- this route `/api/users/currentuser` will figure out if user is signed in the app

![udemy-docker-section09-187-current-user.png](exercise_files/udemy-docker-section09-187-current-user.png)

- routes/current-user.ts
- when the react app wants to figure out if user is signed in
  - the react app cannot inspect the cookie to decide if there is a valid JWT
  - NOTE: cookies cannot be accessed from javascript running in the browser
  - if the user is logged-in, it will include a cookie (`req.session.jwt`), if not logged-in, there wont be a JWT
    - early return if not set: `{currentUser: null}`
    - early return if invalid: `{currentUser: null}`
  - if it is valid - send back the info stored in the JWT (payload): `{currentUser: {id:'', email:''}}`

### 188. returning the current user

- this must first be called

```ts
//src/index.ts
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);
```

![udemy-docker-section09-188-CookieSessionObjectType.png](exercise_files/udemy-docker-section09-188-CookieSessionObjectType.png)

- note: req.session will only be `null` or `undefined` if this if statement is called before index initializes the cookieSession.
- if cookieSession() is called first, then below code wont be null so check if req.session exists too
- otherwise send back a payload.
- `verify()` uses the `JWT_KEY` to decode the token
- we already did the check in start() of index.ts for JWT_KEY so we use !
- if the jwt token has been messed around with in anyway, then verify() will throw an error
- wrap in try/catch as it throws an error if the token has been tampered with

```ts
//src/routes/current-user.ts
import jwt from 'jsonwebtoken';

//...
router.get('/api/users/currentuser', (req: Request, res: Response) => {
  if (!req.session?.jwt) {
    return res.send({ currentUser: null });
  }
  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
    res.send({ currentUser: payload });
  } catch (err) {
    res.send({ currentUser: null });
  }
});

//...
```

- TODO: update code above into a middleware to automatically figure out if user is logged in

#### TEST with cookie

- POSTMAN:
  - NOTE: sign in first as this creates the jwt token on req.session.jwt by passing {email, password}
  - test GET: `/api/users/currentuser`
  - NOTE: inside postman, if the cookie has been set, POSTMAN sends the cookie with any follow up requests (see cookies tab inside POSTMAN) to the same domain
  - NOTE: iat (issued at time)
- EXPECT RESULTS:

```
{
  currentUser:{
    "id": "4fgfdgsdfsfEdfdsf",
    "email": 'test@test.com',
    "iat": 145345345345
  }
}
```

#### TEST without cookie

- EXPECT RESULTS:

```
{
  "currentUser": null
}
```

### 189. sign out

- signing out user route: `/api/users/signout`
- you can use npm package `cookie-session` to handle cookie related..like destroying a session

```
req.session = null
```

```ts
// src/routes/signout.ts
import express, { Request, Response } from 'express';
const router = express.Router();

router.post('/api/users/signout', (req: Request, res: Response) => {
  req.session = null;
  res.send({});
});

export { router as signoutRouter };
```

- Test with POSTMAN:
  - `https://ticketing.dev/api/users/signout`
  - in header: Content-Type `application/json`

### 190. creating a current user middleware

- TODO: create a middleware to check if user is logged in
- this code should be extacted because we always have to repeat this code in every route that requires auth checking
- middleware is automatic code execution "automatic check" so makes sense to refactor code.

![udemy-docker-section09-190-extracting-code-as-middleware.png](exercise_files/udemy-docker-section09-190-extracting-code-as-middleware.png)

- NOTE: with the middleware, we always call `next()` because we want to continue on to the next middleware
- NOTE: typescript complains that you cant just add new property `req.currentUser` on existing types eg.`:Request`

### 191. augmenting type definitions

![udemy-docker-section09-190-creating-current-user-middleware-typescript-adding-onto-req.png](exercise_files/udemy-docker-section09-190-creating-current-user-middleware-typescript-adding-onto-req.png)

- the type definition file for express is specific for the properties of type Request, type Response.
- TODO: specify the return type of payload from the call to `jwt.verify()`
- HOW? - create an interface that describes the payload

```ts
interface UserPayload {
  id: string;
  email: string;
}

//...
const payload = jwt.verify(
  req.session.jwt,
  process.env.JWT_KEY!
) as UserPayload;
req.currentUser = payload;
```

- then we augment the definition of what a request object is
- we reach into an existing type definition and make a modification by adding an additional property (without 'extend')
- NOTE: currentUser? property added as optional

```ts
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}
```

- after fix:

![udemy-docker-section09-190-creating-current-user-middleware-typescript-adding-onto-req-after-fix.png](exercise_files/udemy-docker-section09-190-creating-current-user-middleware-typescript-adding-onto-req-after-fix.png)

- so after middlewares/current-user.ts we can import the middleware in routes/current-user.ts

```ts
//middlewares/current-user.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { CustomError } from '../errors/custom-error';

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (err) {}
  next();
};
```

### use the middleware

- just import the middleware: `import {currentUser} from '../middlewares/current-user';`
- add to route function: `router.get('/api/users/currentuser', currentUser, (req:Request, res:Response) => {}`
- routes/current-user.ts
- NOTE: this extracted middleware is inside Auth service, but we could extract it into a common library

```ts
//routes/current-user.ts
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { currentUser } from '../middlewares/current-user';

const router = express.Router();

router.get(
  '/api/users/currentuser',
  currentUser,
  (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
```

### 192. Requiring Auth for Route Access

<image src="exercise_files/udemy-docker-section09-190-extracting-code-as-middleware.png" width="800px"/>

- TODO: make middleware to reject request if user not logged in ie. respond with an error

#### Middleware throwing NotAuthorizedError

- middlewares/require-auth.ts
- import { NotAuthorizedError } from '../errors/not-authorized-error';

```ts
//middlewares/require-auth.ts
import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }

  next();
};
```

#### NotAuthorizedError

- TODO: make a new custom error to handle when user tries to access a resource they are not authorized to access.
- `src/middlewares/require-auth.ts`

```ts
import { CustomError } from './custom-error';

export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super('Not authorized');
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: 'Not authorized' }];
  }
}
```

### Testing require-auth.ts

- NOTE: we temporarily add the middleware to current-user.ts because currently it doesnt have auth checking yet...
- `requireAuth` middleware should come after `currentUser` middleware
- middlewares/current-user.ts

```ts
//middlewares/current-user.ts
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { currentUser } from '../middlewares/current-user';
import { requireAuth } from '../middlewares/require-auth';

const router = express.Router();

router.get(
  '/api/users/currentuser',
  currentUser,
  requireAuth,
  (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
```

---

## section 10 - testing isolated microservices (1hr22min)

### 193. scope of tests

#### some type of tests

<image src="exercise_files/udemy-docker-section10-193-testing-type-of-tests.png" width="800px"/>

- testing services working together is really difficult
- the tests we will do is tests in isolation (unit tests)

##### unit tests

<image src="exercise_files/udemy-docker-section10-193-testing-unit-test.png" width="800px"/>

##### pieces of code working together

<image src="exercise_files/udemy-docker-section10-193-testing-pieces-of-code-working-together.png" width="800px"/>

##### components working together

<image src="exercise_files/udemy-docker-section10-193-testing-components-working-together.png" width="800px"/>

##### services working together

- this is challenging
- wont focus on this

<image src="exercise_files/udemy-docker-section10-193-testing-services-working-together.png" width="800px"/>

##### current app architecture:

<image src="exercise_files/udemy-docker-section10-193-testing-app-architecture.png" width="800px"/>

### 194. testing goals

#### test1 - basic request handling

- test eg. if a request is sent to sign up with auth service - it should respond with a cookie with jwt inside
- assert writing data into mongodb

<image src="exercise_files/udemy-docker-section10-194-test1-basic-request-handling.png" width="800px"/>

#### test2 - unit test around data models

- looking at a model and do some tests around it

<image src="exercise_files/udemy-docker-section10-194-test2-unit-test-style.png" width="800px"/>

#### test3 - event emitting + receiving

- this "simulates" different services working together, as whats implied from emitting/receiving events will be similar to testing services working together
- these tests handle the receiving and emitting of events from our auth service
- test receive incoming events
- test issuing events

<image src="exercise_files/udemy-docker-section10-194-test3-emitting-and-receiving.png" width="800px"/>

#### running tests

- run in terminal
- locally

### 195. testing architecture

<image src="exercise_files/udemy-docker-section10-195-1-using-jest-for-testing.png" width="800px"/>

- we will be doing test1 - basic request handling
- testing with Jest
  - start in-memory copy of MongoDB
  - start express app
  - use [`supertest`](https://www.npmjs.com/package/supertest) library to make fake request to our express app.
  - run assertions to make sure the request did the right thing

#### supatest

- to summarise -> testing requires the express instance so extract this from index.ts

<image src='exercise_files/udemy-docker-section10-195-2-testing-with-supertest.png' width="800px" />

- REQUIRED: express instance
- supatest provides a request() function that you pass the express object
- ideal architecture: refactoring express to its own app.js so that it can also be used for testing

<image src='exercise_files/udemy-docker-section10-195-3-current-setup-express-listens-on-port-3000.png' width="800px" />

- note: express runs on default port 3000,
- multiple services all listing on same port 3000 will cause errors
- wont be able to run test running on same machine at same time because they both listening on same port.
- with supertest -> if the server is not already listening for connections, then it will listen on an ephemeral port (random port)
- TODO: the code in index.ts cant automatically listen on fixed port eg. 3000 -> extract the express logic from index.ts so it can also be used in tests.

<image src='exercise_files/udemy-docker-section10-195-4-ideal-setup.png' width="800px" />

### 196. index to app refactor

- app now only has the configuration for the server then exports it

- create auth/src/app.ts

```ts
import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.set('trust proxy', true);
app.use(json());

app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

//testing not found error
// app.all('*', async (req, res, next) => {
//   throw new NotFoundError();
// });

app.use(errorHandler);

export { app };
```

- update index.ts

```ts
import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth'); //connecting to mongodb on cluster ip service
    console.log('connected to mongodb');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!');
    console.log('visit: https://ticketing.dev/api/users/currentuser');
  });
};

start();
```

### 197. --omit=dev Install Flag

- UPDATE: `--omit=dev` replaces `--only=prod` flag

```Dockerfile
FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install --omit=dev
COPY . .

CMD ["npm", "start"]
```

### 198. more dependencies

- NOTE: tests are not going to be run inside the docker containers (WILL ONLY RUN LOCALLY SO EXCLUDED FROM IMAGE BUILD)
- installing `mongodb-memory-server` -> mongodb in memory so we can test multiple databases at the same time
  - ie. running tests for different services concurrently on the same machine -> so shouldnt connect to the same mongodb instance
  - each service we are testing will get its own mongodb instance in memory

```cmd
npm install --save-dev @types/jest @types/supertest jest ts-jest supertest mongodb-memory-server
```

- NOTE: the app will be running inside the docker container
  - installing these dependencies as `--save-dev`
  - because we dont need these dependencies for the docker image (only for tests and it will be running locally)
- the dockerfile should be updated so it will NOT install these testing dependencies everytime the docker image is built (see above lesson 197)
  - `npm install --omit=dev`

### 199. requiring MongoMemoryServer updates (prep for lesson 200.)

- TODO: setting up our test environment with MongoMemoryServer
- If you are using the latest versions of this library, a change:
- updates for [REFERENCE](https://nodkz.github.io/mongodb-memory-server/docs/guides/migration/migrate7/https://nodkz.github.io/mongodb-memory-server/docs/guides/migration/migrate7/)

### update 1

```ts
//auth/src/test/setup.ts
mongo = new MongoMemoryServer();

// update this
// const mongoUri = await mongo.getUri();

// to this:
mongo = await MongoMemoryServer.create();
const mongoUri = mongo.getUri();
```

### update 2

- Remove the `useNewUrlParser` and `useUnifiedTopology` parameters from the connect method. Change this:

```ts
// update this
// await mongoose.connect(mongoUri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

//to this...
await mongoose.connect(mongoUri, {});
```

### update 3

- find the afterAll hook and add a conditional check:

```ts
afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});
```

### update 4

- find the beforeEach hook and add a conditional check

```ts
beforeEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});
```

### 200. testing environment setup

- `ts-jest` : so jest understands typescript
- NOTE: the convention is to create a `__test__` folder in the same folder as the file you want to test.

<img src="exercise_files/udemy-docker-section10-200-test-environment-setup.png" width="800"/>

```json
//package.json
//...
  "jest":{
    "preset": "ts-jest",
    "testEnvironment": "node",
    "setupFilesAfterEnv": [
      "./src/test/setup.ts"
    ]
  },
//...
```

- TODO: setup src/test/setup.ts startup mongodb memory server, get mongoose to connect to it.

```ts
//src/test/setup.ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'adsopsdfisd';

  //OLD WAY
  // const mongo = new MongoMemoryServer();
  // const mongoUri = await mongo.getUri();
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  //OLD WAY
  // await mongoose.connect(mongoUri, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // });
  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db?.collections();

  if (collections) {
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});
```

### 201. Our First test

- TODO: create the test: `routes/__test__/signup.test.ts`
- `routes/__test__/signup.test.ts`
- ensure that you can send in a request with email and password as req.body and ge a response with status of 201.
- NOTE: the environment variable needs to be set in test/setup.ts `process.env.JWT_KEY = 'adsopsdfisd';` (see code above).
  - it is currently only part of deployment `infra/k8s/auth-depl.yaml`
- NOTE: assertion `.expect();`

```ts
//routest/__test__/signup.test.ts
import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
});
```

### 202. note

- if you make changes to test and tests still failing, restart.
  - this is because ts-jest sometimes doesnt work

### 203. testing invalid input

- TODO: if you send incorrect email or password, ensure status code 400
- NOTE: to do 2 requests in one handler, use async/await syntax
- NOTE: if you dont return, the test will auto `return`, so either a 'await' or 'return' is required

```ts
it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test23@test.com',
      password: 'password',
    })
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'p',
    })
    .expect(400);
});

it('returns a 400 with missing email AND password', async () => {
  //valid email missing password
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
    })
    .expect(400);

  //valid password missing email
  await request(app)
    .post('/api/users/signup')
    .send({
      password: 'password',
    })
    .expect(400);
});
```

### 204. requiring unique emails

- TODO: test and ensure that user cannot signup with same email twice
- `src/routes/__test__/signup.test.ts`
- NOTE: because we use async express handler you can import in app.ts: `import "express-async-errors";`

```ts
//dissallow signing up with same email
it('dissallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});
```

### 205. changing node env during tests

- when the JWT is stored on the session object (signup.ts)
- the session object will be turned into a string by cookie session
- cookie session middleware will send response with a header name `Set-Cookie`
- TODO: use `response.get()` to lookup headers set in response
- NOTE: test fails because when we set `cookieSession({secure:true})` it only sets a cookie if connection is secure and supatest is making plain http requests.
- FIX: when running tests, use `process.env.NODE_ENV !== 'test'`

```ts
//signup.test.ts
it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
```

- update app.ts

```ts
//app.ts

//...

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

//...
```

- tests are passing  
  <img src="exercise_files/udemy-docker-section10-205-testing-signup-changing-node-env-during-tests.png" width="800"/>

### 206. testing around sign in functionality

- `routes/__test__/signin.test.ts`

```ts
import request from 'supertest';
import { app } from '../../app';

//- TODO: test when signin with account not in db or never signed up before, then should get -> 400 error
it('fails when an email that does not exist is supplied', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});

//- TODO: test incorrect password -> 400 error
it('fails when an incorrect password is supplied', async () => {
  //sign up
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  //sign in
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'asdasddfdgfgdgd',
    })
    .expect(400);
});

//- TODO: test cookie should be in header if correct credentials used to sign in
it('fails when an email that does not exist is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  //sign in
  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
```

### 207. cookie request is possibly undefined error

- TODO: signout test (lesson 208)
- TODO: UPDATE Supertest type declarations
- OLD -> get request for a cookie would return only a string[]
- UDPATE -> get request for a cookie returns `string[]` or `undefined`.
- `auth/src/routes/__test__ /signout.test.ts`

<img src="exercise_files/udemy-docker-section10-208-sign-out.png" width="800"/>

#### OLD

```ts
expect(response.get('Set-Cookie')[0]).toEqual(
  'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
);
```

#### update

```ts
const cookie = response.get('Set-Cookie');
if (!cookie) {
  throw new Error('Expected cookie but got undefined.');
}

expect(cookie[0]).toEqual(
  'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
);
```

### 208. testing signout

```ts
import request from 'supertest';
import { app } from '../../app';

it('clears the cookie after signing out', async () => {
  //signup
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  //signout
  const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);

  const cookie = response.get('Set-Cookie');
  if (!cookie) {
    throw new Error('Expected cookie but got undefined.');
  }

  //check that there is no cookie
  expect(cookie[0]).toEqual(
    'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  );
});
```

### 209. issues with cookies during testing

- TODO: test `/api/users/currentuser`
- NOTE: supatest does not automatically manage cookies (unlike the browser which does) so the cookie does not get added to the follow up request

```ts
//src/routes/__test__
import request from 'supertest';
import { app } from '../../app';

it('responds with details about the current user', async () => {
  //signup so we have a user
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

  console.log(response.body);
});
```

### 210. no overload matches this call error with cookie

- preparation for lesson 211. updating our current-user test
- NOTE: IMPORTANT - most of this code will eventually be removed by the end of the Auth Helper Function lecture.
- `auth/src/routes/__test__/current-user.test.ts` add a conditional check above the response here:

```ts
//auth/src/routes/__test__/current-user.test.ts
if (!cookie) {
  throw new Error('Cookie not set after signup');
}

const response = await request(app)
  .get('/api/users/currentuser')
  .set('Cookie', cookie)
  .send()
  .expect(200);

expect(response.body.currentUser.email).toEqual('test@test.com');
```

### 211. easy auth solution

- NOTE: the problem is we want to have authentication(cookies) - for all tests
- to get there in the tests, we have to:
  1. first sign up
  2. then get cookie
  3. set cookie in header and get currentuser

<img src='exercise_files/udemy-docker-section10-211-sign-in-response-cookie.png' width="800"/>

```ts
//auth/src/routes/__test__/current-user.test.ts

import request from 'supertest';
import { app } from '../../app';

it('responds with details about the current user', async () => {
  //signup so we have a user
  const authResponse = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  //get cookie from response
  const cookie = authResponse.get('Set-Cookie');

  if (!cookie) {
    throw new Error('Cookie not set after signup');
  }

  //make a request
  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});
```

- TODO: move this authentication part of tests into helper function

### 212. globalThis has no index signature TS Error

- for 213. you may get an error like:

### FIX 1

`Element implicitly has an 'any' type because type 'typeof globalThis' has no index signature.ts(7017)`

- FIX: `src/test/setup.ts`

```ts
//src/test/setup.ts

//OLD
// declare global {
//   namespace NodeJS {
//     export interface Global {
//       signin(): Promise<string[]>;
//     }
//   }
// }

//UPDATED
declare global {
  var signin: () => Promise<string[]>;
}
```

### fix2

- add another conditional to check for the cookie

```ts
//OLD
// const cookie = response.get('Set-Cookie');
// return cookie;

//NEW
const cookie = response.get('Set-Cookie');
if (!cookie) {
  throw new Error('Failed to get cookie from response');
}
return cookie;
```

### 213. Auth Helper function

- TODO: extracting auth helper functions
- src/test/setup.ts
- NOTE: it is a global function for ease of use. `const cookie = await global.signin();`
- NOTE: you can extract function to its own file and use es/module import too

```ts
//src/test/setup.ts
import request from 'supertest';

declare global {
  var signin: () => Promise<string[]>;
}

//...

global.signin = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201);
};
```

#### usage

- using the helper function in `src/routes/__test__/current-user.test.ts`
- NOTE: calling global function

```ts
//src/routes/__test__/current-user.test.ts

it('responds with details about the current user', async () => {
  //OLD
  //signup so we have a user
  // const authResponse = await request(app)
  //   .post('/api/users/signup')
  //   .send({
  //     email:'test@test.com',
  //     password: 'password'
  //   })
  //   .expect(201);

  // //get cookie from response
  // const cookie = authResponse.get('Set-Cookie');
  // if (!cookie) {
  //   throw new Error("Cookie not set after signup");
  // }

  //UPDATE
  const cookie = await global.signin();

  const response = //...
  //...
});
```

### 214. testing non-authed requests

- `src/routes/__test__/current-user.ts`

```ts
//src/routes/__test__/current-user.ts

it('responds with null if not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
```

---

## section 11 - integrating a server side rendered react app (3hr01min)

- 3hr 1min / 40 lessons
- TODO: Auth part of react app (YOU CAN SKIP TO END IF YOU DONT WANT TO FOLLOW ALONG BUILDING THE REACT PAGES)

### 215. starting the react app

<img src="exercise_files/udemy-microservices-section11-215-landing-signup.png" width="800"/>
<img src="exercise_files/udemy-microservices-section11-215-signin-landing-loggedin.png" width="800"/>

### 216. reminder on server side rendering

#### Normal react flow (atleast 2-3 requests)

<img src="exercise_files/udemy-microservices-section11-216-normal-react-flow.png" width="800"/>

#### server side rendering (nextjs)

<img src="exercise_files/udemy-microservices-section11-216-serverside.png" width="800">

- nextjs server will make requests to services
- the point is to setup server side rendering in the context of microservices

### 217. Suggestion Regarding a Default Export Warning

- ERROR -> `Anonymous arrow functions cause Fast Refresh to not preserve local component state.`
- FIX -> use named function: dont use default export

```ts
//named
const Landing = () => <div />;
//...

export default Landing;
```

### 218. basics of nextjs

- folder: section05-ticketing/client
- npm init -y
- pnpm i react react-dom next
- pages/ folder (react-router)
  - note: REMINDER the pages folder's files map up to pages
- pages/index is the default

### 219. building a next image

- using js, if you use typscript you will have to type a lot of nextjs related stuff
- TODO: be able to run nextjs inside Kubernetes cluster

```Dockerfile
# Use an official Node.js image
FROM node:18-alpine
# Install pnpm
RUN npm install -g pnpm
# Set working directory
WORKDIR /app
# Copy package.json and pnpm-lock.yaml (pnpm's lockfile)
COPY package.json pnpm-lock.yaml ./
# Install dependencies with pnpm (OMIT DEV)
RUN pnpm install --prod
# Copy the rest of the application code
COPY . .

# Run the app
CMD ["pnpm", "run", "dev"]
```

- NOTE: docker desktop is running, kubernetes is running
- NOTE: skaffold is running
- build on local machine (from client/ folder): `docker build -t clarklindev/client .`

### 220. Running Client (Nextjs) in kubernetes

- So either use google cloud kubernetes...or docker-desktop and get images from dockerhub (you will know from yaml files by the url of the containers image)
- NOTE: if running gcloud kubernetes, you dont have to upload to dockerhub
- NOTE: if using docker-desktop push to docker hub -> `docker push clarklindev/client`
- TODO: get client/ running in kubernetes cluster on gcloud

#### 1. creating the pod

- create folder: infra/k8s/client-depl.yaml (similar to auth-depl.yaml)
- NOTE: `port: 3000` because nextjs by default listens to port 3000

```yaml
#infra/k8s/client-depl.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: client-depl
spec:
  replicas: 1
  selector:
    matchLabels:
      app: client
  template:
    metadata:
      labels:
        app: client
    spec:
      containers:
        - name: client
          image: clarklindev/client #asia.gcr.io/golden-index-441407-u9/client:latest
---
apiVersion: v1
kind: Service
metadata:
  name: client-srv
spec:
  selector:
    app: client
  ports:
    - name: client
      protocol: TCP
      port: 3000
      targetPort: 3000 # nextjs by default listens to port 3000
```

#### 2. UPDATE filesync with skaffold

- tracks changes to ts files
- add entry to skaffold.yaml (under `artifacts`)

```yaml
# section05-ticketing/skaffold.yaml
#...
- image: asia.gcr.io/golden-index-441407-u9/client
  context: client
  docker:
    dockerfile: Dockerfile
  sync:
    manual:
      - src: '**/*.js'
        dest: .
```

#### 3. UPDATE ingress-srv.yaml

- TODO: ingress-srv.yaml is for routing within cluster
- ie. add path (catch all ) that routes to client service -> add at end
- NOTE: order of the path matching matters (the paths array) -> specific to general pathing route rules

```yaml
#...
- path: /?(.*)
  pathType: ImplementationSpecific
  backend:
    service:
      name: client-srv
      port:
        number: 3000
#...
```

##### TROUBLESHOOT

- NOTE: Starting with Kubernetes 1.18, the pathType field became mandatory to specify how the path matching should behave.
- ERROR: `The Ingress "ingress-service" is invalid: spec.rules[0].http.paths[1].pathType: Required value: pathType must be specified`

### 221. Small Update for Custom Webpack Config

- NOTE: in lesson 222 -> next.config.js file and adding some configuration to it
- The latest versions of Next.js use a newer version of Webpack which moves watchOptions out from webpackDevMiddleware

```js
//next.config.js
//OLD:
// module.exports = {
//   webpackDevMiddleware: config => {
//     config.watchOptions.poll = 300;
//     return config;
//   }
// }

//UPDATE:
module.exports = {
  webpack: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};
```

### 222. note on file change detection

- FIX: list pods, delete the pod, pod will be recreated with updates
- nextjs might not show updates for file change detection running inside docker container
- SEE update (lesson 221)
- TODO: next.config.js needs to show inside running pod (restart pod)
- TROUBLESHOOT -> updates note reflecting? restart skaffold

  - TODO: manually kill the client pod -> deployment will create a new pod
  - `kubectl get pods`

  #### delete pod

  - `kubectl delete pod [podname]`

### 223. adding global css

- lesson deals with how to work with bootstrap css and nextjs
- NOTE: Bootstrap css is a global css file
- any global css can be ONLY be imported into \_app.js

#### \_app.js page handler

- `client/pages/_app.js`-> we are defining our own custom \_app component
- when you navigate to a page with nextjs, nextjs will import your component from within the page files by wrapping it up inside a component (app)
- we are overriding the handling of this component by defining our own custom app component -> pages will pass through `_app.js`

```js
import 'bootstrap/dist/css/bootstrap.css';

export default ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};
```

#### install bootstrap

- `section05-ticketing/client/` folder
- `npm install bootstrap`
- adding boostrap to package.json, skaffold will detect a change and rebuild the client image

- NOTE: the styling should reflect bootstrap successfully installed

<img src="exercise_files/udemy-microservices-section11-223-bootstrapcss.png" width="800"/>

### 224. adding a sign up form

- `ticketing.dev`

<img src="exercise_files/udemy-microservices-section11-215-landing-signup.png" width="800"/>

- TODO: create folder: `pages/auth/signup.js` -> this creates the route

<img src="exercise_files/udemy-microservices-section11-224-adding-a-sign-up-form-signup-boostrapped.png" width="800"/>

#### TROUBLESHOOT

- NOTE: docker desktop is running (updates to codebase gets pushed to docker hub)
- NOTE: dockerfile command should be:

```
CMD ["pnpm", "run", "start"]`
```

- and NOT:

```
CMD ["pnpm", "start"]
```

### 225. handling email and password inputs

- adding submit handler for the form which then makes request to auth service
- add hooks to keep track of state

```js
import { useState } from 'react';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (event) => {
    event.preventDefault();
    console.log(email, password);
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit}>
        <h1>Sign up</h1>
        <div className="form-group">
          <label>Email address</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="form-control"
          />
        </div>
        <br />
        <button className="btn btn-primary">Sign up</button>
      </form>
    </div>
  );
};

export default Signup;
```

##### expected result

<image src="exercise_files/udemy-microservices-section11-225-handling-email-and-password-inputs.png" width="800"/>

### 226. successful account signup

<img src="exercise_files/udemy-microservices-section11-226-success-signup-sends-data-to-auth-service.png" width="800"/>

- auth service has api route: /api/users/signup
- client -> nginx (routing: cluster ip service) -> auth container
- TODO: use axios: client/ folder : `pnpm i axios`
- NOTE: skaffold needs to rebuild

```js
//client/pages/auth/signup.js
//...

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const onSubmit = async (event) => {
  event.preventDefault();
  const response = await axios.post('/api/users/signup', {
    email,
    password,
  });

  console.log(response.data);
};
```

- successful signup response is a cookie with the response header
  <img src="exercise_files/udemy-microservices-section11-226-signup-response-headers.png" alt="udemy-microservices-section11-226-signup-response-headers.png" width="800"/>

### 227. Handling validation errors

- submitting signup form with invalid email / passord
  <img src="exercise_files/udemy-microservices-section11-227-handling-validation-errors.png" alt="udemy-microservices-section11-227-handling-validation-errors.png" width="800"/>

- validation error response should also be handled by showing updates to html
  <img src="exercise_files/udemy-microservices-section11-227-handling-validation-errors-error-response.png" alt="udemy-microservices-section11-227-handling-validation-errors-error-response.png" width="800"/>

- NOTE: we access the response errors via `err.response.data.` and we are returning `errors` which is an array of error objects: `err.response.data.errors`
- NOTE: request-validation-errors.ts -> errors return an array of errors objects `{ message: err.msg, field: err.path }`
- showing validation errors

<img src="exercise_files/udemy-microservices-section11-227-showing-validation-errors.png" width="800" alt="udemy-microservices-section11-227-showing-validation-errors.png"/>

- map through the errors from onSubmit set via `setErrors`
- the field property can also be used to show errors directly under each input

- client/pages/auth/signup.js

```ts
//client/pages/auth/signup.js
import { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/users/signup', {
        email,
        password,
      });

      console.log(response.data);
    } catch (err) {
      console.log(err.response.data);
      setErrors(err.response.data.errors);
    }
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit}>
        <h1>Sign up</h1>
        <div className="form-group">
          <label>Email address</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="form-control"
          />
        </div>
        <br />
        {errors.length > 0 && (
          <div className="alert alert-danger">
            <h4>oops..</h4>
            <ul className="my-0">
              {errors.map((err, index) => {
                return <li key={index}>err.message</li>;
              })}
            </ul>
          </div>
        )}
        <button className="btn btn-primary">Sign up</button>
      </form>
    </div>
  );
};

export default Signup;
```

#### TODO:

- NOTE: validation/error displaying logic will be repeated for many parts of the site
- NOTE: request logic (to api) will be repeated for many parts of the site
- other forms (sign-in, creating order, creating ticket, editing ticket etc) could use this logic, which can be extracted to a helper funciton

### 228. The useRequest Hook

- moving logic to re-usable hook:
- TODO: make a useRequest hook

<img src="exercise_files/udemy-microservices-section11-228-useRequest-hook.png" width="800" alt="udemy-microservices-section11-228-useRequest-hook.png">

- hook takes:

  1. request (url)
  2. method ('PUT', 'PATCH', 'POST', 'GET', 'DELETE')
  3. (optional) body: these (PUT, PATCH, POST) http methods have a body

- hook outputs:
  1. function to execute request
  2. errors
- section05-ticketing/client/hooks/use-request.js
- error will be null by default.
- NOTE: axios call... we dont know ahead of time what the method is, so we use `axios[method]` by do a lookup `method` to the axios call
- NOTE: method must be equal to 'get' || 'put' || 'patch' || 'post' || 'delete'

### 229. using useRequest hook

- folder: `section-05-ticketing/client/hooks/use-request.js`
- note: useRequest hook receives an object {url, method, body}
- testing: `https://ticketing.dev/auth/signup`

#### Troubleshoot

FIX: the browser page fails to load -> turn browser shield down

- NOTE: this is the problem with self issued SSL certificates picked up as unsafe (metioned earlier too)

<img src="exercise_files/udemy-microservices-section11-229-browser-fix-turn-shield-down.png" alt="udemy-microservices-section11-229-browser-fix-turn-shield-down.png" width="400">

#### TROUBLESHOOT

- FIX: if the browser is not loading after `skaffold dev` close the window and open again

#### the use-request hook

```js
//client/hooks/use-request.js

import axios from 'axios';
import { useState } from 'react';

//url, method (GET, PUT, POST, PATCH, DELETE)
// method must be equal to 'get' || 'put' || 'patch' || 'post' || 'delete'
//NOTE: receives an object
const useRequest = ({ url, method, body }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);
      return response.data;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>oops..</h4>
          <ul className="my-0">
            {err.response?.data?.errors.map((err, index) => {
              return <li key={index}>err.message</li>;
            })}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};

export default useRequest;
```

#### using the use-request.js hook

- using the useRequest hook
- client/pages/auth/signup.js

```js
//client/pages/auth/signup.js
import { useState } from 'react';

import useRequest from '../../hooks/use-request'; //our custom reusable request hook :)

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email,
      password,
    },
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    //using re-usable fetch hook...
    doRequest();
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit}>
        <h1>Sign up</h1>
        <div className="form-group">
          <label>Email address</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="form-control"
          />
        </div>
        <br />
        {errors}
        <button className="btn btn-primary">Sign up</button>
      </form>
    </div>
  );
};

export default Signup;
```

### 230. on success callback

- navigate user after sign-in back to root route: /
- use `react router` to programatically navigate
- TODO: redirect after success login
- client/pages/auth/signup.js

- UPDATE: add another prop to useRequest hook (a callback): `useRequest({ onSuccess:()=>{}})` -> it is a callback function if successful
- NOTE: we are creating a callback to be called by passing it in...it is inside the hook where we will know if api request was successful.

- TEST -> `ticketing.dev/auth/signup`

#### OUTCOME

- SUCCESS -> redirect to landing page

<img src="exercise_files/udemy-microservices-section11-230-on-success-callback-redirect-to-root.png" alt="udemy-microservices-section11-230-on-success-callback-redirect-to-root.png" width="800"/>

- ERROR -> show error

<img src="exercise_files/udemy-microservices-section11-230-on-error.png" alt="udemy-microservices-section11-230-on-error.png" width="800"/>

```js
import { useState } from 'react';
import Router from 'next/router';

import useRequest from '../../hooks/use-request'; //our custom reusable request hook :)

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //note: useRequest receives an object
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    await doRequest(); //using re-usable fetch hook...
  };

  //...
};
```

- TODO -> detect if user is signed in, if not show `you are not signed in`, else show `you are signed in`

### 231. overview on server-side rendering

<img src="exercise_files/udemy-microservices-section11-231-overview-ssr.png" alt="udemy-microservices-section11-231-overview-ssr.png" width="800"/>

- with nextjs and server-side rendering (SSR) -> the initial response should send back information about whether we are signed-in (nextjs: we need to figure out at that point before the initial response how to get extra info on server)
- whenever we make a request to nextjs app

<img src="exercise_files/udemy-microservices-section11-231-nextjs-server-side-rendering.png" alt="udemy-microservices-section11-231-nextjs-server-side-rendering.png" width="800"/>

#### calling .getInitialProps()

- regarding nextjs -> with a named page, calling `.getIntialProps()` static method
  -> nextjs will call this function while trying to render our app on the server
  -> gives an oportunity to fetch data that the page component needs during server rendering process.

#### returned data from calling .getInitialProps() (server-side)

- invoking this function -> returns a data object which will be provided to our component as a prop.
- we use this data to render our component.
- if we have to fetch initial data, we have to do it inside .getIntialProps() afterwards, clientside takes over
- nextjs then takes html from all rendered components and sends back the response.
- the results from SSR are rendered once and sent back, afterwards clientside takes over..

- folder: client/pages/index.js

```js
//client/pages/index.js
const LandingPage = ({ color }) => {
  console.log('i am in the component', color);
  return <h1>landing page</h1>;
};

LandingPage.getInitialProps = () => {
  console.log('i am on the server');

  return { color: 'red' };
};

export default LandingPage;
```

### 232. a note about ECONNREFUSED errors

- in lesson 233. econnrefused error -> what happens is making the request from server (.getInitialProps()) fails, but in browser (client component), it succeeds

<img src="exercise_files/udemy-microservices-section11-232-econnrefused-error.png" alt="udemy-microservices-section11-232-econnrefused-error.png" width="800">

- TODO: lesson 233. moving the axios request from the getInitialProps() function directly to the LandingPage component
  -> This will likely fail with a long ECONNREFUSED error in your Skaffold output
  -> Node Alpine Docker images are now likely using the v16 version of Node, so it requires a `catch block`.

```js
// client/pages/index.js

//OLD
// const LandingPage = ({ currentUser }) => {
//   console.log(currentUser);
//   axios.get('/api/users/currentuser');

//   return <h1>Landing Page</h1>;
// };

//UPDATED
const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  axios.get('/api/users/currentuser').catch((err) => {
    console.log(err.message);
  });

  return <h1>Landing Page</h1>;
};
```

### 233. fetching data during server side rendering (SSR)

- during initial request, ie. server-side calls `.getInitialProps()` to fetch data from auth service to check if authenticated

### hooks are ONLY for react components

- NOTE: we are using `axios` server side (even though we created that client/hooks/use-request.js hook)
- so .getInitialProps() is not a component, but plain function, so cant use hook.
- to re-interate, getInitialProps() returns something (see `/api/users/currentuser` for what it returns), and this is received by the component

```js
//client/pages/index.js

import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  console.log('currentUser: ', currentUser);
  return <h1>landing page</h1>;
};

LandingPage.getInitialProps = async () => {
  console.log('i am on the server');
  const response = await axios.get('/api/users/currentuser').catch((err) => {
    console.log(err.message);
  });

  return response.data;
};

export default LandingPage;
```

- if signed-in return will not be `{currentUser: null}`
- response from axios looks like this:

<img src="exercise_files/udemy-microservices-section11-233-fetching-data-during-server-side-rendering.png" width="800" alt="udemy-microservices-section11-233-fetching-data-during-server-side-rendering.png"/>

### 234. why the error?

#### client-side request working...

- NOTE: client side using axios -> making requests from the browser
- succeeds because our host file translates the domain and when using partial paths eg. '/something/etc' it gets ammended to the domain (this is what happens normally normal)

<img src="exercise_files/udemy-microservices-section11-234-making-request-from-browser.png" alt="udemy-microservices-section11-234-making-request-from-browser.png" width="800"/>

#### server-side request not-working...

- when server handles the request:
- the path is relative, ingress nginx passes request -> to our default handler (client service handles it)
  - nextjs then shows the root route (index.js)
  - which invokes the .getInitialProps() which requests `/api/users/currentuser` (NO DOMAIN)
  - nodes HTTP layer sees no domain, so it assumes request is on local machine...
  - so it uses local domain (127.0.0.1:80) BUT... we are running our nextjs app inside its own container (kubernetes world...) so localhost refers to the client container (which is nextjs apps port 80 (and there is nothing running or listening on port 80)) NOT ingress nginx (which handles routing)
  - the request should have been handled by nginx (which requests auth service) becomes handled by the container...

<img src="exercise_files/udemy-microservices-section11-234-making-request-from-server.png" alt="udemy-microservices-section11-234-making-request-from-server.png" width="800">

<img src="exercise_files/udemy-microservices-section11-234-redirect-to-local-container-not-nginx.png" alt="udemy-microservices-section11-234-redirect-to-local-container-not-nginx.png" width="800"/>

### 235. two solutions

- 2 step solution -> axios request will behave differently depending if request is from browser, or nextjs app (server-side)

### browser -> baseurl = ''

<img src="exercise_files/udemy-microservices-section11-235-two-possible-solutions-for-solving-domain-error.png" alt="udemy-microservices-section11-235-two-possible-solutions-for-solving-domain-error.png" width="800"/>

### nextjs (server-side) -> baseurl = 'domain of service/'

- the base url can be figured out using 2 options

<img src="exercise_files/udemy-microservices-section11-235-option2.png" alt="udemy-microservices-section11-235-option2.png" width="800"/>

- OPTION 1 (PREFERED METHOD)

  - nextjs reaches out to ingress nginx controller (already in the cluster) which already has the routing mapped
  - ingress nginx can figure out from `path` by itself what the service name/port should be (configured with the `paths`) (infra/k8s/ingress-srv.yaml )
  - NOTE: from local machine (reach out to nginx via ticketing.dev or localhost:80)
  - just have to figure out how to reach out to nginx from within clusters pod (container)

<img src="exercise_files/udemy-microservices-section11-235-ingress-nginx-controller.png" alt="udemy-microservices-section11-235-ingress-nginx-controller.png" width="800"/>

- OPTION 2

  - the cons of option2 is that we have to remember the name of every service associations of the domain mapping to path (specified in infra/k8s/ yaml files) which domain is associated with which route path etc.
  - the react app then needs to encode the service name into the url
  - infra/k8s/auth-depl.yaml -> named service 'auth-srv'
  - then in nextjs (client) app we use the same reference 'auth-srv'
  - which will then forward the request to auth service

<img src="exercise_files/udemy-microservices-section11-235-option2-kubernetes-nginx-reference-using-auth-srv.png" alt="udemy-microservices-section11-235-option2-kubernetes-nginx-reference-using-auth-srv.png" width="800"/>

### cookies from requests and follow up requests from nextjs

- also note that when request come in from browser, cookie may be attached and follow up requests from nextjs client also need to include the cookie
- so our nextjs : `client/pages/index.js` axios call does NOT have the browser to automatically manage the cookie (so this needs to be handled)

```js
//...
LandingPage.getInitialProps = async () => {
  console.log('i am on the server');
  const response = await axios.get('/api/users/currentuser');

  return response.data;
};
//...
```

<img src="exercise_files/udemy-microservices-section11-235-requests-to-server-have-cookies-follow-up-requests-need-to-include-this-cookie.png" alt="udemy-microservices-section11-235-requests-to-server-have-cookies-follow-up-requests-need-to-include-this-cookie.png" width="800"/>

- TODO: extract cookie from incoming request -> so cookie can be included in follow up requests to auth service

### 236. cross namespace service communication

- telling nextjs to visit localhost will be the pods localhost will result in `connect ECONNREFUSED 127.0.0.1:80` error
- whereas from browser (ticketing.dev / localhost:80) is okay as it reaches ingress nginx
- TODO: tell pod to reach out to nginx directly

#### when 2 pods that needs to communicate with each other

- use cluster ip services (ONLY WHEN IN SAME NAMESPACE)

<img src="exercise_files/udemy-microservices-section11-236-cross-namespace-service-communication-when-pods-want-to-communicate-use-their-sevice-name.png" alt="udemy-microservices-section11-236-cross-namespace-service-communication-when-pods-want-to-communicate-use-their-sevice-name.png" width="800"/>

- in kubernetes, objects we create are under a namespace `default` and we created `ingress-nginx` namespace
- BUT we can reach out to another service in another namespace by referencing the service name

```cmd
kubectl get namespace
```

<img src="exercise_files/udemy-microservices-section11-236-kubectl-get-namespace.png" alt="udemy-microservices-section11-236-kubectl-get-namespace.png" width="800"/>

#### cross namespace service communication

<img src="exercise_files/udemy-microservices-section11-236-cross-namespace-communication-pattern.png" alt="udemy-microservices-section11-236-cross-namespace-communication-pattern.png" width="800"/>

- we have to use a different way to reference a service in another namespace
- `http://NAME_OF_SERVICE.NAMESPACE.svc.cluster.local`

1. what is the namespace to reach? `ingress-nginx`
2. what is the name of service to reach?

<img src="exercise_files/udemy-microservices-section11-236-getting-services-in-namespace.png" alt="udemy-microservices-section11-236-getting-services-in-namespace.png" width="800"/>

- we first list all namespaces
- NOTE: `kubectl get services` lists services in default namespace
- we are listing all services in `ingress-nginx` namespace
- which gives us the name of the service we are trying to reach in ingress-nginx 'ingress-nginx-controller'
- NOTE: UPDATE.. service name of all platforms is now: `ingress-nginx-controller`

```cmd
kubectl get namespace
kubectl get services
kubectl get services -n ingress-nginx
```

- this is the domain of service we want to reach
  <img src="exercise_files/udemy-microservices-section11-236-full-domain-of-service.png" alt="udemy-microservices-section11-236-full-domain-of-service.png" width="800"/>

- so from nextjs to reach outside the pod to nginx, the url world have this syntax:

  - `http:???/api/users/currentuser`
  - specifically `http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser`

  <img src="exercise_files/udemy-microservices-section11-236-reach-nginx-from-pod.png" alt="udemy-microservices-section11-236-reach-nginx-from-pod.png" width="800"/>

- we do not implement this because its difficult to rememeber

#### OPTIONAL

- there is something called an `external name service` which remaps the name of the request (can create more friendly shorter domain)
- the course does NOT implement external name service because (out-of-scope / difficult to recall) but it can be done.

<img src="exercise_files/udemy-microservices-section11-236-external-name-service.png" alt="udemy-microservices-section11-236-external-name-service.png" width="800"/>

### 237. When is .getInitialProps() called? (SUMMARY LESSON)

<img src="exercise_files/udemy-microservices-section11-237-component-request-vs-ssr-getinitalprops.png" alt="udemy-microservices-section11-237-component-request-vs-ssr-getinitalprops.png" width="800"/>

- this lesson summarises the past 3 lessons:
- Required to customize request based on environment...
- client side -> when using browser, given url path, axios baseURL of empty string (browser figures out the domain)
- server sided -> SSR (from server nextjs app...) will need to add `http://NAME_OF_SERVICE.NAMESPACE.svc.cluster.local/`

### How do we know when a request is going to be executed in browser vs server-side (nextjs)?

- component requests are always client-side (browser)
- .getInitialProps is server side and return is provided to server component as props
- the server component (nextjs component) is rendered EXACTLY once wont wait for requests to be resolved during server rendering process.

  - cant update state
  - cant make use of lifecyle methods
  - no hooks

### .getInitialProps() called in browser

- `.getInitialProps()` will also be called inside browser under particular circumstances

<img src="exercise_files/udemy-microservices-section11-237-request-sources.png" alt="udemy-microservices-section11-237-request-sources.png" width="800"/>

### when is getInitialProps() executed?

- to test, add a console log in client/pages/index.js .getInitialProps() 
  - if console.log shows in terminal (server)
  - if console.log shows in console of browser dev tools (client)
- anytime we call getInitialProps, we have to consider adding the domain
- anytime request comes from a component or hook, dont have to worry about the domain problem

#### getInitialProps() execution on server

- hard refresh of page
- clicking link from different domain
- typing url into address bar

#### getInitialProps() execution on client

- navigating from one page to another while in the app
  - TEST: signin-in causes change to url, which should call getInitialProps() of page (see browser console log)

### 238. on the server or browser
- TODO: determining whether we are executing request in browser or on server...
- `window` object is a browser concept, if we test typeof window === 'undefined', then we are on the server

```ts
if (typeof window === 'undefined') {
  //we are on the server requests should follow this format: `http://NAME_OF_SERVICE.NAMESPACE.svc.cluster.local/`
} else {
  //we are on the , baseURL of ''
}
return {}

```

### 239. ingress-nginx namespace and service important update

- TODO: adding the ingress-nginx service name and namespace to our axios request.
- run `kubectl get services -n ingress-nginx` see [236. cross namespace service communication](#236-cross-namespace-service-communication)
- UPATE: the service name for all platforms (Windows, Mac, Linux) and Docker clients (Docker Desktop and Minikube) should be:
- sevice name: `ingress-nginx-controller`

### 240. specifying the host
- NOTE: what is returned from calling getInitialProps() is passed as props to the page component.
- both the requests (from client and server) look identical, but on server, there needs to pass the domain too.

#### on client (browser)
- recall that returning response.data is an object with currentUser prop that gets passed to the component
- and to get LandingPage's getInitialProps() to be called, sign in (which causes it to execute on client)
- requests reaching nginx, ingress wants to know about the host we are trying to reach. 
  - well, requests issued within a browser, includes domain (ticketing.dev) info

#### on server (nextjs)
- identical but we will have to specify domain.
- `kubectl get services -n ingress-nginx` to get service of namespace
- the request has to include the domain AND route
  - NOTE: infra/k8s/ingress-srv.yaml -> we specify under routing rules, the host (ticketing.dev) this is given with browser
- but this is not the browser, so domain is not included
- requests via getInitialProps on server does not have the included domain we are trying to reach.
- FIX: add a second parameter: headers (object) to axios target...add host
- success will return null (on server) meaning we reached service successfully


```ts
//client/pages/index.js
import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);

  return <h1>landing page</h1>;
};

LandingPage.getInitialProps = async ({req}) => {
  console.log(req.headers);

  if (typeof window === 'undefined') {
    //we are on the server requests should follow this format: `http://NAME_OF_SERVICE.NAMESPACE.svc.cluster.local/` 
    const response = await axios.get(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
      {
        headers: {
          Host: 'ticketing.dev' //this will be replaced by {headers: req.headers}
        }
      }
    );
    return response.data;

  } else {
    //we are on the browser, baseURL of ''
    const response = await axios.get('/api/users/currentuser');
    return response.data;
  }

  return {};
};
```

#### why return null?
- the request is going from nginx to auth service to get logged in user: `/api/users/currentuser` but its not sending with the cookie in the request, so auth service is not sending data back (because it assumes no cookie means not signed in)
- FIX: add a cookie to request going to auth service (if its coming from server)

<img src="exercise_files/udemy-microservices-section11-240-returns-null-from-request-because-no-cookie-from-nginx-to-auth-service.png" alt="udemy-microservices-section11-240-returns-null-from-request-because-no-cookie-from-nginx-to-auth-service.png" width="800"/>

### 241. server passing through the cookies
- TODO: when server (nextjs SSR) sending a request to service, needs to include the cookie going out to nginx
- when getInitialProps() gets called on server (see updated getInitialProps() lesson 240), first argument to server is an object with some properties (including request object)
  - same as express app request object

```js
LandingPage.getInitialProps = async ({req}) => {
  console.log(req.headers)
};
```

<img src="exercise_files/udemy-microservices-section11-241-req-headers-cookie.png" alt="udemy-microservices-section11-241-req-headers-cookie.png" width="800"/>

- NOTE: cookie is passed as a header, so we can look at `req.headers` for cookie
- NOTE: the headers also includes `host` which is what we need as well. 
- so we can update the code by passing throught the headers -> req.headers:

```js
//client/pages/index.js

//...
LandingPage.getInitialProps = async ({req}) => {
  if (typeof window === 'undefined') {
    const response = await axios.get(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
      {
        headers: req.headers  
      }
    );

    //...
  }
}
```

#### outcome
- TODO: to test SERVER request -> we hard refresh the browser (we are testing the server sending the request see lesson 237 when is getInitialProps() called -> section getInitialProps() execution on server) 

- confirmation on browser console (console.log of currentUser)

<img src="exercise_files/udemy-microservices-section11-241-signed-in-client-confirmation-browser-console.png" alt= "udemy-microservices-section11-241-signed-in-client-confirmation-browser-console.png" width="800"/>

- confirmation in terminal (console.log of currentUser) 

<img src="exercise_files/udemy-microservices-section11-241-signed-in-server-confirmation-terminal.png" alt="udemy-microservices-section11-241-signed-in-server-confirmation-terminal.png" width="800"/>

- TODO: fix up .getInitialProps() , extract the test for `typeof window === 'undefined'` to check server/client sending request

### 242. a reusable api client (buildClient)

- OUTCOME: `buildClient()` helper (client/api/build-client.js) which creates a configured axios client

- currently everytime we call getInitialProps() we have to: 
  - setup `if(typeof window === 'undefined'){...}` 
  - `http://NAME_OF_SERVICE.NAMESPACE.svc.cluster.local/` domain url
- TODO: update so we extract this to helper file -> by creating `buildClient` helper
  - it will preconfigure axios request regardless whether we are on client or on server making requests to a service

<img src="exercise_files/udemy-microservices-section11-242-reusable-api-client-buildclient-prefconfigures-axios.png" alt="udemy-microservices-section11-242-reusable-api-client-buildclient-prefconfigures-axios.png" width="400"/>

- create: client/api/build-client.js

```js
//client/api/build-client.js
import axios from 'axios';

//usage: call buildClient() passing in an object with request attached
const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    //server
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    //client (browser)
    return axios.create({
      baseURL: '/',
    });
  }
};

export default buildClient;

```

#### usage of build-client.js
- NOTE: the first argument of getIntialProps() is reffered to as 'context' which is the object with the props like `req` etc
  - instead of destructuring this object and getting request `{req}` pass the `context` object.
- define axios client `const client = buildClient(context)` 
  - gets the configured axios instance then we need to pass the requested route
- `const request = await client.get(route)` 

```js
// client/pages/index.js
import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>landing page</h1>;
};

LandingPage.getInitialProps = async (context) => {
  
  const client = buildClient(context);
  const request = await client.get('/api/users/currentuser');
  return request.data;
};

export default LandingPage;

```

### 243. content on the landing page
- the landing page is now prepped to display user logged-in status 
  - 'you are logged in' if the server-component runs getInitialProps() -> receives `currentUser` and its NOT null
  - 'you are NOT logged in' if the server-component runs getInitialProps() -> receives `currentUser`and it IS null

#### TESTING
- gcloud kubernetes engine -> cluster is created -> running
- gcloud network load balancer is created -> running
- docker desktop started -> docker OK -> kubernetes OK
  - kubernetes context is correctly selected
- section05-ticketing/ `skaffold dev`
- visit: ticketing.dev/auth/signin -> type on page `thisisunsafe` -> close browser window -> reopen browser window

- TODO: after signing in -> you will see the respective message -> 'you are signed in'
- TODO: to sign-out, clear cookies in browser (application -> cookies -> select the domain -> clear) -> browser refresh -> 'you are NOT signed in'

### 244. sign-in form

- still TODO: navigation header
- still TODO: sign-in page

- will be similar to signup.js
- client/pages/auth/signin.js
  - header changes to 'sign in'
  - url request path `/api/users/signin`

- TEST: `ticketing.dev/auth/signin`
- BROWSER -> browser tools -> application -> ensure no cookies for domain: cookies -> 'ticketing-dev' -> clear
- then sign-in
- then sign-out (cant sign out YET, but clear the cookie and refresh page should reflect NOT signed-in)

<img src="exercise_files/udemy-microservices-section11-244-testing-sign-in.png" alt="udemy-microservices-section11-244-testing-sign-in.png" width="600" />

```js
//client/pages/auth/signin.js
import { useState } from 'react';
import Router from 'next/router';

import useRequest from '../../hooks/use-request'; //our custom reusable request hook :)

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //note: useRequest receives an object
  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    await doRequest(); //using re-usable fetch hook...
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit}>
        <h1>Sign in</h1>
        <div className="form-group">
          <label>Email address</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="form-control"
          />
        </div>
        <br />
        {errors}
        <button className="btn btn-primary">Sign in</button>
      </form>
    </div>
  );
};

export default Signin;

```

### 245. reusable header
- the header at the top of every single page 
- you can add to _app.js
- TODO: add to nextjs as template's extra content
- the header navigation should update to reflect the signed-in status
  - signed in -> show `sign out`
  - not signedin -> show `sign in` and `signup`

<img src="exercise_files/udemy-microservices-section11-245-reusable-header-_app.png" alt="udemy-microservices-section11-245-reusable-header-_app.png" width="800"/>

- currently our index.js (landing page) knows who loggedin-user is, but we want the header to know it too

- current architecture  

<img src="exercise_files/udemy-microservices-section11-245-current-architecture.png" alt="udemy-microservices-section11-245-current-architecture.png" width="800">
 
- updated architecture  
- extract the fetching of currentuser to app-component so both the index page AND header will receive `currentUser` as prop
- moving getInitialProps() to app component -> later, index.js (at some stage) might both have getInitialProps() -> but this is tricky with nextjs (both should be able to fetch data from their getInitialProps())
- TODO: moving getInitalProps() from landing page to app component

<img src="exercise_files/udemy-microservices-section11-245-update-architecture.png" alt="udemy-microservices-section11-245-update-architecture.png" width="800">

### 246. moving GetInitialProps
- in _app.js change `export default` and assign app to a variable

```js
//client/pages/_app.js

import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';

const AppComponent = ({ Component, pageProps }) => {
  return (
    <div>
      <h1>hello</h1>
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = () => {};

export default AppComponent;
```

### 247. Issues with Custom App GetInitalProps
- _app.js is not a page, it is a custom component that wraps a page
- PROBLEM? the props of getInitialProps() of a custom App component and a Page component are different
  - the props of Page has context with context:`{req, res}`  
  - the props of Custom App Component has context with context:`Component, ctx: {req, res}` 

<img src="exercise_files/udemy-microservices-section11-247-props-for-getinitialprops-of-page-component-vs-custom-app-component.png" alt="udemy-microservices-section11-247-props-for-getinitialprops-of-page-component-vs-custom-app-component.png" width="600">

- FIX: AppComponents' getInitialProps should receive appContext.ctx 

```js
import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
const AppComponent = ({ Component, pageProps }) => {
  return (
    <div>
      <h1>hello</h1>
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitalProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');
  console.log(data);

  let pageProps = {};
  if (appContext.Component.getInitalProps) {
    pageProps = await appContext.Component.getInitalProps(appContext.ctx);
  }
  console.log(pageProps);
  return data;
};

export default AppComponent;
```

#### TROUBLESHOOT
- NOTE: with nextjs, getInitalProps being also in _app, causes the Pages' eg. LandingPage.getInitialProps() to not be automatically invoked.

### 248. handling multiple GetInitialProps

<img src="exercise_files/udemy-microservices-section11-248-handling-multiple-getInitialProps.png" alt="udemy-microservices-section11-248-handling-multiple-getInitialProps.png" width="600">

- the LandingPage (index.js) getInitialProps() is not being invoked if we also have getInitialProps up at _app.js

### fixing multiple getInitialProps

<img src="exercise_files/udemy-microservices-section11-248-handling-multiple-getInitialProps-fix.png" alt="udemy-microservices-section11-248-handling-multiple-getInitialProps-fix.png" width="600">

- FIX: call the landingPage's getInitialProp() from _app.js's getInitialProps() 
- FIX: which will then pass the data for BOTH _app.js AND LandingPage down to AppComponent as props and SOME of it goes to LandingPage
- from AppComponent -> console log the appContext from getInitialProps()
- notice `Component` property which is a reference to the component Page we are trying to render in _app.js
  - and because we have a reference to the component, we can call its Component.getInitialProps() function directly
- NOTE: we will pass it some data by returning data from _app's getInitialProps() call
  - the appContext goes into AppComponent 
  - the appContext.ctx goes into a page
- this means we are executing AppComponents getInitialProps AND Page component (LandingPage's) getInitialProps() and both currently return a console log of the currentUser

<img src="exercise_files/udemy-microservices-section11-248-appContext-has-reference-to-component-its-trying-to-render.png" alt="udemy-microservices-section11-248-appContext-has-reference-to-component-its-trying-to-render.png" width="600">

- NOTE: pages without the .getInitialProps() function have that common header code (we set in _app.js) and we are invoking Component.getInitialProps() which might not exists eg. signin.js and signup.js do not have this .getInitialProps

- now, AppComponents.getInitialProps() has data common for everypage `const { data } = await client.get('/api/users/currentuser')`
AND we can also call .getInitialProps() of Pages from AppComponents getInitialProps()

- TODO: taking the pageProps, and data we are are fetching for AppComponent itself -> return this -> passes it through as props to the component -> ensure the props is used by the components that need it

### 249. passing props through
- TODO: passing data through as props to the server component
  - by returning an object with the properties and values we need
  - NOTE: spreading `data`, because data is what gets returned from `/api/users/currentuser` call -> is an object with currentUser property.

```js
//pages/_app.js
import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <h1>hello {currentUser.email} </h1>
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitalProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  if (appContext.Component.getInitalProps) {
    pageProps = await appContext.Component.getInitalProps(appContext.ctx);
  }
  console.log(pageProps);
  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
```

### 250. error: invalid `<Link>` with `<a>` child
- with nextjs 13 UPDATE:  
  - remove `<a>`
  - move className up to `<Link className={}>`
  - see [nextjs doc](https://nextjs.org/docs/messages/invalid-new-link-with-extra-anchor)

```js
<Link className="navbar-brand" href="/">
  GitTix
</Link>
```

### 251. building the header
- building out the header
  - has logo (left)
  - right-side has buttons `signup` and `signin` OR `signout` if already logged-in

### 252. conditionally showing Links
- links will be an array which we filter any falsy items
- map over each remaining item in links, destructure out label and href

```js
//client/components/header.js
import Link from 'next/link';

const HeaderComponent = ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In ', href: '/auth/signin' },
    currentUser && { label: 'Signout', href: '/auth/signout' },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return <li key={href}>{label}</li>;
    });

  return (
    <nav className="navbar navbar-light bg-light">
      <Link className="navbar-brand" href="/">
        GitTix
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};

export default HeaderComponent;
```

### 253. signing out 
- auth route is /api/users/signout
- TODO: create a page to allow users to signout
- NOTE: the request to signout MUST be coming from a component, NOT getInitalProps (which is serverside), 
  - server doesnt know what to do with cookies
  - ONLY client side browser can work with cookies so our request MUST come from clientside browser
- CREATE client/pages/auth/signout.js
  - by default it will show the message 'signing you out'
  - after initial render, useEffect should call the api route `/api/users/signout`
  - then if we clear the cookie session -> after redirect to landing page

```js
//client/pages/auth/signout.js

import { useEffect } from 'react';
import Router from 'next/router';

import useRequest from '../../hooks/use-request';

const SignOutPage = () => {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/'),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>signing you out...</div>;
};

export default SignOutPage;
```

### 254. React App Catchup & Checkpoint
- nice summary of what we did this section advised to go through [lesson 254](https://www.udemy.com/course/microservices-with-node-js-and-react/learn/lecture/19266074#overview) for refresher.

---

## section 12 - code sharing and re-use between services (52min)
### 255. Shared Logic Between Services
- event-related stuff for auth service ? - no other service really need to know about what the auth service is doing
- everything auth service does is exposed through JWT in the cookie
- TODO: ticketing service
  - list all tickets
  - show a ticket
  - create a ticket (AUTH)
  - edit a ticket (AUTH)

#### moving things from auth service to shared lib
- extract (refactor) code from auth to a common shared library to be used between services
  - TODO: - re-use `requireAuth` middleware
  - TODO: - re-use `NotAuthorizedError`
  - TODO: - re-use request validation middleware

<img src="exercise_files/udemy-microservices-section12-255-code-sharing-between-services-shared-logic-between-services.png" alt="udemy-microservices-section12-255-code-sharing-between-services-shared-logic-between-services.png" width="800" />

### 256. Options for Code Sharing
- we decide that npm package is the way
- i've ordered it from prefferred to least prefferred so diff from slides

- OPTION 1 (npm package) (PREFFERED)
  - adding git repo to npm registry
  - versioning
  - services using the package can use different versions until updated

<img src="exercise_files/udemy-microservices-section12-256-code-sharing-option1-npm-package.png" alt="udemy-microservices-section12-256-code-sharing-option1-npm-package.png" width="600"/>

- OPTION 2 (git submodule)
- using a common git repo for common code -> the code gets copied into the project (we can track which version)
  - ie. we have a repository and copy another git repository inside as a submodule
- PROS -> version control of common code

<img src="exercise_files/udemy-microservices-section12-256-code-sharing-option2-git-submodules.png" alt="udemy-microservices-section12-256-code-sharing-option2-git-submodules.png" width="600"/>

- OPTION 3 (copy-and-paste)
  - bad because the code will not be insync if changes occur
  - difficult to keep track of changes

<img src="exercise_files/udemy-microservices-section12-256-code-sharing-option3-copy-and-paste.png" alt="udemy-microservices-section12-256-code-sharing-option3-copy-and-paste.png" width="600"/>

### 257. NPM Organizations

<img src="exercise_files/udemy-microservices-section12-257-npmjs-publishing-npm-package.png" alt="udemy-microservices-section12-257-npmjs-publishing-npm-package.png" width="600"/>

#### options for publishing as npm package (4 Options)
  - Public Package -> (npm Public Registry): Anyone can view and install.
  - Private Package -> (npm Private Registry): Only authorized users can install; requires a paid plan.
  - Organization Public Registry -> Public packages under an organization's name, viewable and installable by anyone.
  - Organization Private Registry -> Private packages under an organization's name, only accessible by invited members or teams, and requires a paid npm plan.

#### Key Points
  - Free Options: Public packages (either personal or organizational) are free.
  - Paid Options: Private packages (personal or organizational) require a paid plan.
  - npm Organization: If you’re managing a team or business, npm Organizations are a good way to manage private packages and team permissions.
  - npm organizations must be unique

- TODO: [npmjs.com](http://npmjs.com) 
  - sign up for npm account (MUST BE UNIQUE)
  - add an organization (choose public packages)
  - create a npm package 
  - publish to public organization we created

- To delete an organization: select organization name (bottom-left) -> billing -> delete organization

### 258. Publishing NPM Modules
- NOTE: the common folder referenced in these few lessons is moved outside the main project folder
[git repo: https://github.com/clarklindev/microservices-stephengrider-with-node-and-react-common.git](https://github.com/clarklindev/microservices-stephengrider-with-node-and-react-common.git)

#### create project
- creating a shared common library
- create /common/ folder
- from common folder:
```cmd
npm init -y
```
- package.json -> use the organization name like: @organization
- we give our package a name `common` 
- ie. we are publishing a package called common to our organization `"name": "@organization/common",`

#### create package: common
```json
{
  "name": "@organization/common",
}
```
- from common/ folder, we make a git repository, npm checks our repo and checks everything is commited before publishing to the registry
- `git init`
- `git -am "initial commit"`

#### publish to organization
- NOTE: you need to be logged in to npmjs: `npm login`
- `npm publish --access public` 
- NOTE: the --access public (if you omit this, npm assumes we want to publish private package in our org which will throw error because it costs money to publish private package)
- in npmjs under packages -> `@clarklindev/common@1.0.0`

<img src="exercise_files/udemy-microservices-section12-258-publishing-npm-modules.png" alt="udemy-microservices-section12-258-publishing-npm-modules.png" width="800"/>

- NOTE: because `common/` npm module was made its own git repo, npm will ignore the common/ folder when main project git folder is pushing to git.
- NB! it is not included in your git repo for `microservices-stephengrider-with-node-and-react` - thats ok
- go to section05-11-ticketing/common and manage the repo
- By default, if you run `git init` inside common/ and don’t link it as a submodule, the main project will ignore the contents of common/ because it’s a separate Git repository. The main project won’t track changes inside common/ unless you manually add those changes or files.
- i created a git repo for common/ `https://github.com/clarklindev/microservices-stephengrider-with-node-and-react-common.git` so changes can be tracked

#### TROUBLESHOOT - common/ folder location
- NOTE: i think stephen put the common folder inside the main project folder for organizational purpose, as it is ignored by default when you initialize common/ as its own git repo inside the main repo.. (you will see the common/ folder is empty when you look at the git pushes of what gets pushed up in the main project)

#### referenced repository in main project folder
- common/ in the same folder may cause confusion as to whether main project should keep updating the reference to common/
- even though the project is linked to the NPM package version, not the local submodule.
- might mistakenly edit the local common/ submodule, thinking those changes will apply to the main project, but they wont unless published to NPM.
- and also, forgetting to publish will result in outdated npm package
- So if the common/ module is being published to NPM and used as a dependency, the submodule in the main project should be removed.
- note: you never reference common/ via relative path from the other services, its always via the npm package name as imports, so i dont think you need to .gitignore it.
- common/ will get its own git repository url so it can be outside our main project folder (physical location path on disk)
- TODO: create git repository (get common/ git url)

- if you have already created the empty repository (called `git init` inside `common/` folder), set the origin url from within `common/`
- `git remote add origin [git-repo-url]`
- `git remote -v` -> check that we have set the remote url
- `git push --set-upstream origin master` set so it pushes to the origin

```cmd
git remote add origin https://github.com/clarklindev/microservices-stephengrider-with-node-and-react-common.git
git remote -v 
git push --set-upstream origin master
```

### TROUBLESHOOT - publish to organization
- you need to be logged in

```cmd
npm login
```

### 259. Project Setup
- our common/ library will be written as typescript
- before publishing code, it will be transpiled to javascript 

### Steps to Set Up the Global Bin Directory
- note: setup global bin directory (used for pnpm)
- Choose a Directory for Global Binaries: You can choose a directory like `~/.pnpm-global/bin` (userfolder/pnpm-global)to store global binaries. 
  - You can replace `~/.pnpm-global` with another path if you prefer a different location.  
#### MAC
- run: `pnpm config set global-bin-dir ~/.pnpm-global/bin`
- NOTE: . in front of a directory on mac means hidden (Hidden files or directories are usually meant for configuration or system-related files)
- NOTE: on mac ~ means user directory
#### WINDOWS
##### CONFIGURE PATH
- run (powershell style command): `pnpm config set global-bin-dir "$env:USERPROFILE\pnpm-global\bin"` 
##### ADD TO PATH
- NOTE: windows you can reference the user directory like: `%USERPROFILE%`
- add to windows environment variables -> path -> add full path to user folder pnpm-global: `C:\Users\admin\pnpm-global\bin`

#### inside the Common module repository 
- THESE ARE INSTRUCTIONS FOR THE COMMON MODULE (REPOPOSITORY)
- from that projects folder: [microservices-stephengrider-with-node-and-react-common/](https://github.com/clarklindev/microservices-stephengrider-with-node-and-react-common.git) repository folder (this is the common shared module folder we moved to its own repository).
- first install typescript globally to get access to tsc: `pnpm add -g typescript` (might need to Set Up the Global Bin Directory (see below))
- install typescript to project as dev-dependency: `pnpm i -D typescript`
- install `rimraf` as dev-dependency: `pnpm i -D rimraf` -> allows deleting or if doesnt exist, doesnt throw error.
- we will create a types file via `pnpm tsc --init` -> creates a `tsconfig.json` 
- `"declaration": true` adds a type definition file for the ts
- `"outdir": './build'` -> after compile, put output in /build

- edit tsconfig
```json
//tsconfig.json
//...
"declaration": true //Generate .d.ts files from TypeScript and JavaScript files in your project. 
"outdir": './build'
//...
```

- package.json
- pnpm run clean clears the build folder
- 'tsc' builds the project and outputs js specified in 'output' directory we setup in tsconfig.json
```json
"scripts": {
  "clean" : "rimraf ./build",
  "build": "pnpm run clean && tsc"
}
```
#### running the app
- running build: `pnpm run build`

#### tsconfig.json
- "declaration": true -> Generate .d.ts files from TypeScript and JavaScript files in your project. 
- "outdir": './build'

#### package.json
- below commented out as we use 'rimraf' package
<!-- - we installed the `del-cli` npm module
- del command used in the script is not valid for your operating system 
  - FIX: we install `cross-env` so `del-cli`  -->
- install `rimraf` as dev-dependency -> it can delete the directory itself without error if it doesn't exist
```json
//package.json
"scripts": {
  "clean": "rimraf ./build",
  "build": "pnpm run clean && tsc"
}
```

- `pnpm run build`

### 260. Typo in package.json "files" Field - Do Not Skip
- https://github.com/clarklindev/microservices-stephengrider-with-node-and-react-common.git 
- the project is in a folder called `common` in the tutorials,
in the common repo, there is no common folder, package.json should be...

```json
//package.json

//NOT THIS...
// "files": [
//   "./build/**/*"
// ],

//UPDATE
"files": [
  "build/**/*"
]
```

### 261. An Easy Publish Command
- building the project will compile the typescript and output the javascript, where it is output is specified in tsconfig - "outdir": './build'

#### 'name'
- this is value they will use for importing when working with this module
- eg. `import {} from '@organization/common'`

#### 'main'
- package.json `main` property ->  when we are importing this module, what are they importing? we want it to reference the ./build/index.js
- ie. when using this package, and you reference the module via an import: `import {} from '@organization/common'`, where does this import point to...

#### 'types'
- types is the reference to the types file generated when calling tsc compile.

#### 'files'
- 'files' -> an array that specifies what we want npm to include in our package: all files in build

- NOTE: this is inside the Common module repository 
```json
// package.json
"main": "./build/index.js",
"types": "./build/index.d.ts",
"files": ["build/**/*"] 
```
#### .gitignore
- add .gitignore 
- ignore the 'build' folder and 'node_modules'

### steps to updating
1. update the common/ shared repo (add / commit)

2. update the version (after commit)
- always have to update the version number when we publish our package
- look at semmantic versioning
- MANUALLY update the 'version' property of our package: `package.json`
- AUTO-INCREMENT: `npm version patch`

3. npm run build

4. npm publish

#### pub script
- can add to package.json "pub" script 
- NOT FOR PRODUCTION -> AS ALL CHANGES ARE ADDED TO COMMIT AT ONCE, ITS TOO GENERIC, VERSIONING NOT SPECIFIC

```js
"scripts": {
  "clean": "rimraf ./build",
  "build": "pnpm run clean && tsc",
  "pub": "git add . && git commit -m \"updates\" && pnpm version patch && pnpm run build && pnpm publish"
},
```
- pub script creates two commits:

#### First commit (manual):
- `git add . && git commit -m "updates"`
- This stages all changes and creates a commit with the message "updates".

#### Second commit (automatic):
- `pnpm version patch`
- This bumps the version in package.json, commits it with a message like v1.0.1 (the new version), and adds a Git tag.

#### Result
Commit 1: "updates" (manual commit).
Commit 2: vX.Y.Z (automatic version bump commit from pnpm).

### 262. Relocating Shared Code
- TODO: move code form auth service to common service
  - auth/src/errors/ -> move this folder to our shared module (project/src)
  - auth/src/middlewares/ -> move this folder to our shared module (project/src)

<img src="exercise_files/udemy-microservices-section12-262-relocating-shared-code-options-for-syntax-when-import.png" alt="udemy-microservices-section12-262-relocating-shared-code-options-for-syntax-when-import.png" width="800"/>

- options for import syntax:
  - import {} from '@organization/common' 
  - import {} from '@organization/common/errors/bad-request-error'

- to do this, we use the index.ts and import all the files we use, and then export them
- NOTE: if these files are using npm modules, we have to add them to the common package.json

```cmd
pnpm i express express-validator cookie-session jsonwebtoken @types/cookie-session @types/express @types/jsonwebtoken
```

```ts
//common/src/index.ts
export * from './errors/bad-request-error';
export * from './errors/custom-error';
export * from './errors/database-connection-error';
export * from './errors/not-authorized-error';
export * from './errors/not-found-error';
export * from './errors/request-validation-error';

export * from './middlewares/current-user';
export * from './middlewares/error-handler';
export * from './middlewares/require-auth';
export * from './middlewares/validate-request';
```

### 263. Updating Import Statements
- section05-11-ticketing/auth/src/routes/ 
- TODO: fix broken imports in main project folder
- because we moved errors/ and middlewares to common module ([repository](https://github.com/clarklindev/microservices-stephengrider-with-node-and-react-common.git))
- we have to update all code that referenced the errors/ or middlewares/ files by importing our common module as an npm package to the project 

- from the section05-11-ticketing/auth folder:
```
pnpm i @clarklindev/common
```

#### TROUBLESHOOT
- if your package is already installed you need to update to use latest version
```
pnpm update @clarklindev/common
```

### TROUBLESHOOT
- ERROR: "No overload matches this call"
- There is a types mismatch occurring because two libraries are currently not in sync with each other. You have the types installed for v5 Express, however, your Express is v4. I would recommend removing that @types/express version and replacing with the compatible version:

- FIX: "@types/express": "^4.17.21",
- package.json dependencies: "@types/express" -> ensure same version in `common/` repo and the `main project` repo
- FIX: `"@types/express": "^4.17.21"` 

### 264. NPM Update Command
- main project folder:
```
pnpm update @clarklindev/common

```
### 265. Updating the Common Module

#### verify correct version of common repo
- you can verify that skaffold is using the correct version of the common/ repo by inspecting pods

<img src="exercise_files/udemy-microservices-section12-265-validating-correct-updated-common-repo-version.png" alt="udemy-microservices-section12-265-validating-correct-updated-common-repo-version.png" width="800"/>


```
kubectl get pods
```
- then open a shell inside of the pod to look at the files to make sure we using the latest version of `common/` project

<img src="exercise_files/udemy-microservices-section12-265-validating-correct-updated-common-repo-version_2.png" alt="udemy-microservices-section12-265-validating-correct-updated-common-repo-version.png_2" width="800"/>

---

## section 13 - create-read-update-destroy server setup (2hr28min)
### 266. Ticketing Service Overview

<img src="exercise_files/udemy-microservices-section13-266-ticketing-service-overview-routes.png" alt="udemy-microservices-section13-266-ticketing-service-overview-routes.png" width="600"/>

- 4 routes (create, update, view all, view one by ID)
  - get all - GET /api/tickets
  - get one - GET /api/tickets/:id
  - create - POST /api/tickets
  - update - PUT /api/tickets

- NOTE: (create/update) price is string
- ticket collection ({title, price, userId (owner)}) -> ticket service -> will have own copy of mongodb

<img src="exercise_files/udemy-microservices-section13-266-ticketing-collection.png" alt="udemy-microservices-section13-266-ticketing-collection.png" width="600" />

- steps to create the ticketing service

<img src="exercise_files/udemy-microservices-section13-266-ticketing-service-creation.png" alt="udemy-microservices-section13-266-ticketing-service-creation.png" width="600" />

### 267. Project Setup

#### copy + paste from auth/ to tickets/
- section05-13-ticketing/tickets
- from section05-13-ticketing/auth/ copy all files in root of `auth/` folder and paste in tickets/
- from section05-13-ticketing/auth/src/ copy `index.ts`, `app.ts`, `test/`

<img src="exercise_files/udemy-microservices-section13-267-copy-from-auth-into-tickets.png" alt="udemy-microservices-section13-267-copy-from-auth-into-tickets.png" width="400" />

#### replace 'auth' references with 'tickets'
- update: tickets/package.json -> "name": "tickets"
- tickets/src/index.ts -> there is a reference to mongodb connection to connect to `auth-mongo-srv` change to `tickets-mongo-srv`
- tickets/src/app.ts -> remove reference to routes that are not for tickets/
- tickets/src/test/setup.ts -> theres a reference to global.signin (leave for now)

#### install dependencies
- tickets/ -> `pnpm i`

#### build image + pushing to dockerhub
- NOTE: Docker desktop is open, Docker / kubernetes is running
- this step is NOT required for skaffold if running docker/kubernetes on gcloud 
  - from tickets/ `docker build -t clarklindev/tickets .` 
- if using docker locally, skaffold will need this docker image later..

### 268. Running the Ticket Service
#### writing k8s file for deployment + service
- `infra/k8s/tickets-depl.yaml`
- copy contents from infra/k8s/auth-depl.yaml
- search and replace all 'auth' with 'tickets' and 'Auth' with 'Tickets'
- NOTE: the tickets service will try handle authentication by itself, so will also need the JWT_KEY reference 
- need JWT_KEY to validate requests and ensure the token is valid

### update skaffold.yaml (for file sync)
- `section05-13-ticketing/skaffold.yaml` ensure files sync
- copy the artifacts entry for auth and paste, replace `auth` with `tickets`

- skaffold.yaml add entry to artifacts for tickets

```yaml

  artifacts:
    
    #...

    - image: asia.gcr.io/golden-index-441407-u9/tickets
          context: tickets
          docker:
            dockerfile: Dockerfile
          sync:
            manual:
              - src: 'src/**/*.ts'
                dest: .
```

### k8s file for mongodb depl/service
- create `infra/k8s/tickets-mongo-depl.yaml`
- copy contents of `infra/k8s/auth-mongo-depl.yaml` and paste in `infra/k8s/tickets-mongo-depl.yaml`
- replace all reference to 'auth' with 'tickets'

### run skaffold
- close skaffold if already running
- `kubectl get pods` ensure all pods are/have shutdown
- from main project folder: `skaffold dev`

#### TROUBLESHOOT 
- if theres an error: manually create docker image again -> stop skaffold
- from tickets/ `docker build -t clarklindev/tickets .` 
- `docker push clarklindev/tickets`
- then from main project folder: start `skaffold dev`

### 269. Mongo Connection URI
- connection to tickets/ for mongodb is hardcoded: `mongoose.connect('mongodb://tickets-mongo-srv:27017/tickets');`
- TODO: update so its env variable set via deployment yaml
- do this for both auth and tickets

#### 1. CREATE ENV VARIABLE IN infra/k8s/tickets-depl.yaml
- the db connection url should be set via env in `infra/k8s/[x]-depl.yaml file`
- TODO: mongodb database url set via environment variable in `infra/k8s/tickets-depl.yaml`
- general good idea is to make the connection string an environment variable 
- update `infra/k8s/tickets-depl.yaml` env -> by adding env entry for mongo uri.
- `tickets/src/index.ts` already had the mongodb connection so cut from there
- but the connection value you can get from `infra/k8s/tickets-mongo-depl.yaml` -> service name `tickets-mongo-srv` (what we trying to connect to)
- NOTE: the environment variable set in the deployment yaml: `infra/k8s/*-depl.yaml` 
  - ie. auth/src/index.ts using `process.env.MONGO_URI` but the variable is specific to that `auth` containers' deployment (auth-depl.yaml)

  - ie. tickets/src/index.ts using `process.env.MONGO_URI` but the variable is specific to that `tickets` containers' deployment
  (tickets-depl.yaml)

```yaml
//infra/k8s/tickets-depl.yaml
    spec:
      containers:
        - name: tickets
          # image: clarklindev/tickets:latest/tickets
          image: asia.gcr.io/golden-index-441407-u9/tickets:latest
          env: 
            - name: MONGO_URI
              value: 'mongodb://tickets-mongo-srv:27017/tickets'
            - name: JWT_KEY
              valueFrom:
                secretKeyRef:
                  name: jwt-secret
                  key: JWT_KEY
```

#### 2. USE ENV VARIABLE 
- use the ticket env in `tickets/src/index.ts`
- we should do check that MONGO_URI env is defined

```ts
//tickets/src/index.ts
const start = async () => {
  //...

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }  

  try {
    await mongoose.connect(
      process.env.MONGO_URI, 
      {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        // useCreateIndex: true
      }
    ); //connecting to mongodb on cluster ip service
    console.log('connected to mongodb');
  } catch (err) {
    console.error(err);
  }

  //...
}
```

### 270. Quick Auth Update
- move the mongodb connection string from `auth/src/index.ts` to deployment yaml `infra/k8s/auth-depl.yaml`
- update auth/src/index.ts to use environment variable.
- infra/k8s/auth-depl.yaml

```yaml
# infra/k8s/auth-depl.yaml
  env:
    - name: MONGO_URI
      value: 'mongodb://auth-mongo-srv:27017/auth'
#...
```

- auth/src/index.ts

```ts
//auth/src/index.ts

//...

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI must be defined');
}

try {
  await mongoose.connect(process.env.MONGO_URI, {}); //connecting to mongodb on cluster ip service
  console.log('connected to mongodb');
} catch (err) {
  console.error(err);
}

//..
```

### 271. Test-First Approach

- routes we will build:

<img src="exercise_files/udemy-microservices-section13-266-ticketing-service-overview-routes.png" alt="udemy-microservices-section13-266-ticketing-service-overview-routes.png" width="600"/>

- TODO: `create` ticket route handler and create tests: POST `/api/tickets`
- create folder: `tickets/src/routes/__test__/`
- create test file `tickets/src/routes/__test__/new.test.ts`

### TESTING
- `tickets/src/routes/__test__/new.test.ts`

```ts
//tickets/src/routes/__test__/new.test.ts
import { app } from "../../app";
import request from "supertest";

it('has a route handler to handle listening to /api/tickets for post requests', async () => {});
it('can only be accessed if user is signed in', async () => {});
it('returns a status other than 401 if the user is signed in', async () => {});
it('returns an error if invalid title is provided', async () => {});
it('returns an error if invalid price is provided', async () => {});
it('creates a ticket given valid inputs', async () => {});
```

- test -> from tickets/ folder: `pnpm run test`

- what do we test?
  - test route is present
  - test to validate incoming request body (has: title, price and correct type)
  - test user must be authenticated to access route
  - test we are able to create a ticket

### 272. Creating the tickets router
- TODO: test to ensure the request route does NOT return a 404 
- test: `it('has a route handler to handle listening to /api/tickets for post requests', async () => {});`
- NOTE: `tickets/src/app.ts` has catch-all route for invalid url's
- throws NotFoundError status code 404 

```ts
//tickets/src/app.ts

//testing not found error
app.all('*', async (req, res, next) => {
  throw new NotFoundError();
});

```


### TESTING
- `tickets/src/routes/__test__/new.test.ts`

```ts
//tickets/src/routes/__test__/new.test.ts
import { app } from "../../app";
import request from "supertest";

//TODO: test to ensure the request does NOT return a 404 (app.ts throws NotFoundError as catchall route when invalid url)
it('has a route handler to handle listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).not.toEqual(404);
});

// it('can only be accessed if user is signed in', async () => {});
// it('returns a status other than 401 if the user is signed in', async () => {});
// it('returns an error if invalid title is provided', async () => {});
// it('returns an error if invalid price is provided', async () => {});
// it('creates a ticket given valid inputs', async () => {});
```

#### 1. create route
- create src/routes/new.ts -> route `/api/tickets` responsible for creating a ticket

```ts
//src/routes/new.ts
import express, { Request, Response } from 'express';
const router = express.Router();

router.post('/api/tickets', (req: Request, res: Response) => { 
  res.sendStatus(200);
});

export {router as createTicketRouter }
```

#### 2. import router
- import route to app.ts
- then test from tickets/ folder: `pnpm run test`

```ts
//tickets/src/app.ts
import { createTicketRouter } from './routes/new';

//...
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(createTicketRouter);

//testing not found error
app.all('*', async (req, res, next) => {
  throw new NotFoundError();
});

//...
```

### 273. Adding Auth Protection
- test: make an unauthenticated request
- test: `it('can only be accessed if user is signed in', async () => {});`
  - simulate not signed-in by sending request without jwt/cookie in request header
- NOTE: common/ repository library has the errors -> `src/errors/not-authorized-error.ts` 
- `NotAuthorizedError` returns status code `401` when user is not authorized to visit a route
- REPO: `microservices-stephengrider-with-node-and-react-common` -> /src/errors/ NotAuthorizedError

### TESTING
- `tickets/src/routes/__test__/new.test.ts`

```ts
//tickets/src/routes/__test__/new.test.ts
import { app } from "../../app";
import request from "supertest";

//simulate not signed-in by sending request without jwt/cookie in request header
//microservices-stephengrider-with-node-and-react-common/src/errors/ NotAuthorizedError -> throws 401

//BEFORE: test fails -> our test is expecting a 401, 
//it is passing and returning 200 as there is no authentication tied to tickets/ route handler and therefore no NotAuthorizedError thrown.
//FIX: ensure that authentication is required to access route -> add middleware

it('can only be accessed if user is signed in', async () => {
  await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401);
});
```
- test -> from tickets/ folder: `pnpm run test`

#### CHECK1 - middleware currentUser -> if there is token, decoded token and add to req.currentUser 
- NOTE: this middleware has to be added after cookieSession -> because cookieSession can then look at cookie and set `req.session` 
- folder: `tickets/src/app.ts`
- RECALL in `common/src/middlewares/current-user` there is a check to see if request has session and session includes jwt
  - NO token, call `next()`
  - YES there is a token, decode token and set on `req.currentUser`
- TODO: to ensure tickets/ has authentication, just need to add in tickets/src/app.ts/ `current-user` middleware from common/ 

```ts
//tickets/src/app.ts
import { currentUser, errorHandler, NotFoundError } from '@clarklindev/common';
import { createTicketRouter } from './routes/new';

//...
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser); //decoded token is added to req.currentUser if token valid
app.use(createTicketRouter);

```

#### CHECK2 - middleware requireAuth -> if NOT req.currentUser throw error 
- RECALL in `common/src/middlewares/require-auth` there is a check to see if request has req.currentUser
- if requireAuth fails, ie if req.currentUser not defined, throw `NotAuthorizedError()`
- folder: `src/routes/new.ts`
- add `require-auth` middleware to some routes (create, update)
- TEST: with the middleware added -> tests should pass

```ts
//src/routes/new.ts
import { requireAuth } from '@clarklindev/common';
import express, { Request, Response } from 'express';
const router = express.Router();

router.post('/api/tickets', requireAuth, (req: Request, res: Response) => { 
  res.sendStatus(200);
});

export {router as createTicketRouter }
```
### TESTING
- test that if we are authenticated, then it should NOT return 401 status code (opposite of prev test)
- TODO: in tickets/src/tests/setup.ts there is `global.signin = async ()=>{}` helper (from auth) 

```ts
//tickets/src/routes/__test__/new.test.ts
import { app } from "../../app";
import request from "supertest";

//...

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).not.toEqual(401);
});
```

### 274. Faking Authentication During Tests
- TODO: in tickets/src/tests/setup.ts there is `global.signin = async ()=>{}` helper (from auth) 
- this helper was used for tests to fake sign-in during testing and return a cookie
- NOTE: this helper WONT WORK for tickets/ because it doesnt have access to a route `/api/users/signup` to fake test signup
- AND there should NOT be interdependency on services while running tests, eg. `tickets/` reaching out to `auth/`

#### fake signed in
- the purpose of the .signin function was to return a cookie with a JWT
- looking at the cookie after authenticating (sign-in) 

<img src="exercise_files/udemy-microservices-section13-274-faking-authentication-during-testing-sign-in-cookie.png" alt="udemy-microservices-section13-274-faking-authentication-during-testing-sign-in-cookie.png" width="800" />

#### get the cookie
- if we take this cookie, and send it along with requests, we will be authenticated
- TODO: build our own cookie `tickets/src/tests/setup.ts` -> `global.signin = async ()=>{}`

- from browser tools -> network -> XHR -> headers -> request headers -> cookie  (everything after `cookie: express:sess=`)

```req header
//...

cookie: express:sess=

//...
```

- OR from browser tools -> application -> storage -> cookies -> select the domain (ticketing.dev) -> copy cookie value

#### decode the cookie
- paste the cookie in [base64decode.org](http://base64decode.org)

<img src="exercise_files/udemy-microservices-section13-274-faking-authentication-during-testing-decode-cookie.png" alt="udemy-microservices-section13-274-faking-authentication-during-testing-decode-cookie.png" width="800"/>

- returns a json object with 'jwt' key and value with 3 parts separated by '.'
- the global `.signin()` will do the following:
  1. build a jwt payload {id, email}
  2. create the jwt (need process.env.JWT_KEY)
  3. build sesion object {jwt: MY_JWT}
  4. turn session into JSON
  5. take JSON and encode it as base64
  6. return a string with cookie: express:sess=cookie 

```ts
//tickets/src/tests/setup.ts

beforeAll(async ()=>{
  process.env.JWT_KEY = 'adsopsdfisd';
  //OLD WAY
  // const mongo = new MongoMemoryServer();
  // const mongoUri = await mongo.getUri();
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

// await mongoose.connect(mongoUri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
  await mongoose.connect(mongoUri, {});
});

//...

global.signin = async ()=>{
  //1. build a jwt payload {id, email}
  //2. create the jwt (need process.env.JWT_KEY)
  //3. build sesion object {jwt: MY_JWT}
  //4. turn session into JSON
  //5. take JSON and encode it as 
  //6. return a string with cookie: express:sess=cookie 
}
```

### 275. A Required Session Fix and a Global Signin Reminder
- NOTE: this is for lesson 276
- tickets/src/test/setup.ts
- UPDATE: global signin declaration
- UPDATE: the return of the global.signin -> fix is required to return the cookie to prevent our tests from failing
- UPDATE: remove async: `signin = () => {}`

- update: 
```ts
//tickets/src/test/setup.ts

// global signin declaration should look like this after the refactor
declare global {
  var signin: () => string[];
}

global.signin = ()=>{
//...

//return [`express:sess=${base64}`];
  //UPDATE
  return [`session=${base64}`];
}
```

### 276. Building a Session
- tickets/src/test/setup.ts
- `import jwt from 'jsonwebtoken';`
- NOTE: typescript marks the `process.env.JWT_TOKEN` as possibly undefined, FIX: add exclaimation at end `process.env.JWT_TOKEN!`
- jwt has a sign() and we have to provide a jwt key (process.env.JWT_KEY) -> returns a token
- build session object `const session = {jwt: token};`
- turn the session to json `const sessionJSON = JSON.stringify(session);`
- then turn sessionJSON into base64 `const base64 = Buffer.from(sessionJSON).toString('base64');`
- return [`session=${base64}`];
- NOTE: the global declaration... we update it as it used to return promise 
- NOTE: with supatest, cookies should be returned in an array
- NOTE: UPDATE: `tickets/src/test/setup.ts` remove async: `signin = () => {}`

```ts
declare global {
  var signin: () => string[];
} 

```
```ts
//tickets/src/test/setup.ts
import jwt from 'jsonwebtoken';

global.signin = () => {

  //1. build a jwt payload {id, email}
  const payload = {
    id: '23432456565r6',
    email: 'test@test.com'
  }

  //2. create the jwt (need process.env.JWT_KEY)
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  
  //3. build sesion object {jwt: MY_JWT}
  const session = {jwt: token};

  //4. turn session into JSON
  const sessionJSON = JSON.stringify(session);

  //5. take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  //6. return a string with cookie: 
  //return [`express:sess=${base64}`];

  //UPDATE
  return [`session=${base64}`];
}

```

#### attach cookie to test in src/routes/__test__/new.test.ts
- `src/routes/__test__/new.test.ts`
- add a cookie to the test by calling .set('Cookie', global.signin()) - `const response = await request(app).post('/api/tickets').set('Cookie', global.signin()).send({});`

```ts
it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

```

### 277. Testing Request Validation
- TODO: ensure title and price are provided with request
  - if not return an error

```ts

it('returns an error if invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10
    })
    .expect(400);
  
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 10
    })
    .expect(400);

});

it('returns an error if invalid price is provided', async () => {
  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title: 'sdfsdfsfd',
    price: -10
  })
  .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'sdfsdfsfd',
    })
    .expect(400);
});
```

### 278. Validating Title and Price
- src/test/setup.ts
- put the body validation logic after `requireAuth` middleware
- `import {body} from 'express-validator';`
- add middleware: `[body('title').not().isEmpty().withMessage('Title is required')]`
- this only sets an error on incoming request
- no errors are thrown or response sent back.
- `import {validateRequest} from '@clarklindev/common'`
- add `validateRequest` after the validation check
- validation for title  
  - `.not().isEmpty()` will check for title not provided OR title is an empty string
- validation for price
  - accept $ and decimal value for cents
  - price not negative (`.isFloat({ gt: 0})`)
- TEST: tickets/ `pnpm run test`

```ts
import { requireAuth, validateRequest } from '@clarklindev/common';
import express, { Request, Response } from 'express';
import {body} from 'express-validator';

const router = express.Router();

router.post('/api/tickets', 
  requireAuth, 
  [
    body('title')
      .not()
      .isEmpty()
      .withMessage('Title is required'),
    
    body('price')
      .isFloat({ gt: 0})
      .withMessage('Price must be greater than 0')
  ],

  validateRequest,

  (req: Request, res: Response) => { 
    res.sendStatus(200)
  }
);

export {router as createTicketRouter }
```

### 279. Reminder on Mongoose with TypeScript
- refresher lesson (should watch it) - reminder on working with mongoose 
- for mongoose to work with mongodb, have to create a model.
- what we save to database is a Ticket Model (mongoose)
- the model represents the collection of records inside mongodb

- ticket model:

<img src="exercise_files/udemy-microservices-section13-279-ticket-model.png" alt="udemy-microservices-section13-279-ticket-model.png" width="800" />

- TicketAttrs - title:string, price:number, userId:string
  - properties required to build a new Ticket

- TicketDoc - title:string, price:number, userId:string, createAt:string
  - properties that a Ticket has

- TicketModel - build:(attrs) => Doc
  - Properties tied to the model 
  - build() takes in some attributes and returns a document

#### NOTE: TicketAttrs vs TicketDoc 
  - TicketAttrs is properties to build a record (single entry)
  - TicketDoc - this is for after the record is created and saved (becomes a mongoose document), there can be extra properties put on by mongoose

#### Mongoose model
- TicketAttrs -> interface that describes properties to create a new Ticket

- TicketDoc -> interface that describes the properties a saved record has 
  - single record.

- TicketModel -> all different properties that will be assigned to the model itself. 
  - the entire collection of data.

- Schema -> listing all the properties we want AND has toJSON manipulates the json representation of the data.
  - in toJSON convert mongodb id's (has _id) to `id`

- REMINDER using the User example: `userSchema.statics.build = (attrs:UserAttrs) => {return new User(attrs); };` -> there is no type checking when we create new User() so we created a static function build() which knows the received attributes type (attrs:UserAttrs)

TODO: esure if send in valid values and authenticated, ticket gets created

```ts
it('creates a ticket given valid inputs', async () => {
  //add in check to make sure ticket was saved

  await request(app)
    .post('api/tickets')
    .send({
      title:'asdasdas',
      price: 20
    })
    .expect(201);

});
```

#### create a new Ticket model 
- tickets/src/models/ticket.ts
- creating the mongoose model interfaces

```ts
//section05-13-ticketing/tickets/src/models/ticket.ts
import mongoose from 'mongoose';

interface TicketAttrs{
  title: string;
  price: number;
  userId: string;
}

interface TicketDoc extends mongoose.Document{
  title: string;
  price: number;
  userId: string;
}

interface TicketModel extends mongoose.Model<TicketDoc>{
  build(attrs: TicketAttrs): TicketDoc;
}

```

### 280. Defining the Ticket Model
- creating the ticket schema

#### schema type vs interface type
- NOTE: when creating the schema, list out all the properties the schema should have
  - NB!!!! these properties are reference to global `String` Constructor references 
  - NB!!!! the interface refers to a `string` type (typescript concept)
  - therefore we use Capitals for the type
  - the second property to the schema is an object where we put the toJSON function
    - transform() function has `doc` and `ret` 
    - `ret` is the object that will turn into JSON (make direct changes on ret)
  - statics.build() is the method we use to create new objects (because it has type support)
- create the model: `const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)`
  - first argument we provide a name for the collection: `Ticket`
  - second is the schema to use: `ticketSchema`

- OUTCOME: After creating the model, we can use mongoose to save/retrieve data from mongodb

```ts
//section05-13-ticketing/tickets/src/models/ticket.ts
import mongoose from 'mongoose';

//...
const ticketSchema = new mongoose.Schema({
  title:{
    type:String,
    required: true
  },
  price:{
    type:Number,
    required:true
  },
  userId:{
    type:String,
    required:true
  }
}, 

{
  toJSON:{
    transform(doc, ret){
      ret.id = ret._id;
      delete ret._id;
    }
  }
}
);

ticketSchema.statics.build = (attrs:TicketAttrs) => {
  return new Ticket(attrs);
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export {Ticket}

```

### 281. Creation via Route Handler

<img src="exercise_files/udemy-microservices-section13-281-ticketing-service-overview-routes-CREATE.png" alt="udemy-microservices-section13-281-ticketing-service-overview-routes-CREATE.png" width="800"/>

- TODO: create a ticket
- POST /api/tickets
- requires to be authenticated -> YES

- TODO: add in check to make sure ticket was saved
- import our Ticket model to the test `import { Ticket } from "../../models/ticket";`

  1. we will first check the amount of records inside the ticket collection
    - get all tickets -> `let tickets = await Tickets.find({});`
    - the initial call we expect nothing to be inside the mongodb because in test setup (`src/test/setup.ts`) beforeEach() we empty the db collections

  2. then we will make the request to create a ticket and save to database
    - NOTE: we have to be logged in: `.set('Cookie', global.signin())`
    - in the test -> expect the return statusCode 201 (created) 
    - we update the code: `tickets/src/routes/new.ts` -> (req: Request, res: Response) => {}
    - import Ticket 

  3. then we will ensure the number of records increased
    - get tickets in db 
    - `expect(tickets.length).toEqual(1);`

  4. cd section05-13-ticketing/tickets/ `pnpm run test`

```ts
//src/routes/__test__/new.test.ts
import { Ticket } from "../../models/ticket";

it('creates a ticket given valid inputs', async () => {
  let tickets = await Tickets.find({});

  expect(tickets.length).toEqual(0);
  const title = "adsfjsdfdslf";
  const price = 20;

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);

  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(price);
});
```

- in tickets/src/routes/new.ts
- get title, price off request
- create the ticket calling: `const ticket = Ticket.build({title, price, id: req.currentUser.id})`
- NOTE: TypeScript, the `!` symbol is called the non-null assertion operator. 
  - It tells the TypeScript compiler that you are certain a value is not null or undefined
- NOTE: typescript warns that id (req.currentUser.id) might not exist, but we have `requireAuth` middleware which makes sure req.currentUser.id exists.
- TODO: add exclaimation AFTER currentUser so typescript ignores it `id: req.currentUser!.id`
- TODO: make function async and save ticket: `await ticket.save();`
- TODO: return statusCode: 201 and ticket: `res.status(201).send(ticket);`
- TODO: tickets/ `pnpm run test`

```ts
import express, { Request, Response } from 'express';
import {body} from 'express-validator';

import { requireAuth, validateRequest} from '@clarklindev/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.post('/api/tickets',

  requireAuth,

  [
    body('title')
      .not()
      .isEmpty()
      .withMessage('Title is required'),
    
    body('price')
      .isFloat({ gt: 0})
      .withMessage('Price must be greater than 0')
  ],

  validateRequest,

  (req: Request, res: Response) => { 
    
    const { title, price } = req.body;
    
    const ticket = Ticket.build({
      title, 
      price, 
      id: req.currentUser!.id
    });

    await ticket.save();

    res.status(201).send(ticket);

  }
);

export {router as createTicketRouter };

```

### 282. Testing Show Routes

<img src="exercise_files/udemy-microservices-section13-282-ticketing-service-overview-routes-GET-ONE.png" alt="udemy-microservices-section13-282-ticketing-service-overview-routes-GET-ONE.png" width="800"/>

- TODO: showing a specific ticket by id
- GET /api/tickets/:id
- requires to be authenticated -> NO

- does NOT require auth
- gets a ticket from db with a specific ID
- if it cant find ticket, throw 404 error
- folder path AND create file: `tickets/src/routes/__test__/show.test.ts`

### TEST 1 - Ticket NOT FOUND

```ts
//tickets/src/routes/__test__/show.test.ts
import request from 'supertest';
import { app } from '../../app';

// get a ticket by id that does not exist
it('returns a 404 if the ticket is not found', async () => { 
  await request(app)
    .get('/api/tickets/sfjlsdfjdslfdsf')
    .send()
    .expect(404);
});

```

### TEST 2 - Ticket FOUND
- REQUIRED: we have a ticket that we can find from GET
1. TODO: first simulate create a ticket (lesson 281) 
  - POST request
  - requires authentication (cookie)
  - the response from creating the cookie is the ticket (we need its id) 
  - ticket id -> `response.body.id`
  - expect status code: 201 (created)

2. TODO: get the ticket by id
  - GET request
  - does NOT require authentication
  - expect status code: 200

```ts
//tickets/src/routes/__test__/show.test.ts
//...
it('returns the ticket if the ticket is found', async () => {
  const title = "concert";
  const price = 20;

  //create the ticket first
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price
    })
    .expect(201);

  //then get the ticket by its id
  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);

});

```

### 283. Unexpected Failure!
- NOTE: near end of lesson, the tests for ticket not found -> fails
  - we are checking for a 404... but get 400 (bad request)
  - in next lesson, stephen explains why but long story short, its because the ticket id is not a valid mongoose id.

- NOTE: near end of lesson, the test for ticket found passes

- GET `/api/tickets/:id`
- `tickets/src/routes/__test__/show.test.ts`
- building `tickets/src/show.ts`

- TODO: if it cant find the ticket -> return a 404
  - use Ticket model to find by id

- TODO: return ticket if ticket is found
  - if you leave off the status code, default is 200;

#### use showTicketRouter
```ts
//tickets/src/app.ts
//...
import { showTicketRouter } from './routes/show';
//...
app.use(showTicketRouter);

```

```ts
//tickets/src/show.ts
import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import {NotFoundError} from '@clarklindev/common';

const router = express.Router();
router.get('/api/tickets/:id', async (req:Request, res:Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if(!ticket){
    throw NotFoundError();
  }

  res.send(ticket); //no status code... default to 200
});

export { router as showTicketRouter}
```

### 284. What's that Error?!
- our error is currently handled in [common/ module](https://github.com/clarklindev/microservices-stephengrider-with-node-and-react-common.git)
  - `src/middlewares/error-handler.ts` by errorHandler
- the general error handler is called when there is no custom error handler: `res.status(400).send({ errors: [{ message: 'something went wrong' }] });`
- NOTE: we are checking for a 404... but get 400 (bad request) which means the general error was called (not the CustomError)
- try console.log(response.body) after the request (this means error wasnt caught by custom error)

<img src="exercise_files/udemy-microservices-section13-284-logging-the-error.png" alt="udemy-microservices-section13-284-logging-the-error.png" width="800">

- the test wont work because .expect() is an expectation which throws an error if the expectation is not satisfied, therefore exits the error function.
- FIX: remove .expect(404) temporarily to see the error in line after...
  - this will make the test pass, and you will see now be able to see the console.log(response.body)

```ts
//show.test.ts
// get a ticket by id that does not exist
it('returns a 404 if the ticket is not found', async () => { 
  await request(app)
    .get('/api/tickets/sfjlsdfjdslfdsf')
    .send()
    // .expect(404);

  console.log(response.body) //wont log unless .expect(404) is removed temporarily

});

```

### debugging src/middlewares/error-handler.ts
- NOTE: THIS IS A QUICK HACK FOR DEBUGGING
- you can add a console.log(err) to errorHandler BUT will result in rebuild, set new version, redeploy, then in Tickets/ install the updated @clarklindev/common
- Quick hack (NOT RECOMMENDED) -> because we import the @clarklindev/common/ library -> look inside node_modules/ navigate to middlewares/error-handler.js (NOTE: EDIT JS (THE BUILT VERSION OF TYPESCRIPT CODE))
  - add a console log to errorHandler() function

//NOTE: to see the error, the hack is to temporarily add a console log inside `node_modules/` js (the compiled version of typescript files)

- logging the actual error:

```js
//src/middlewares/error-handler.js
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ errors: err.serializeErrors() });
  }

  console.error(err); //temporarily add this to the nodemodules/ .js (NOT RECOMMENDED HACK)

  res.status(400).send({
    errors: [{ message: 'something went wrong' }],
  });

  next();
};
```

<img src="exercise_files/udemy-microservices-section13-284-console-log-the-actual-error.png" alt="udemy-microservices-section13-284-console-log-the-actual-error.png" width="800"/>

- shows the error is we are trying the use an invalid value for mongodb "_id"
- it is saying our api `/api/tickets/:id`, id needs to receive a valid mongodb id and our request is `/api/tickets/sdfhjsdiuhfsdfs` (invalid)
- FIX: in the tests, change to a valid id

```ts
//tickets/src/show.ts
import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import {NotFoundError} from '@clarklindev/common';

const router = express.Router();
router.get('/api/tickets/:id', async (req:Request, res:Response) => {
  const ticket = await Ticket.findById(req.params.id);
  //...
});
```

### 285. Better Error Logging

####  updating middleware errorHandler
- TODO: update by adding `console.error` inside errorHandler (common/), this will give us more information when error not handled by our custom errors.
- make the change in common/ and publish `pnpm run pub`
- update the version in tickets/ `pnpm update @clarklindev/common --latest`

#### generating the mongodb id
- show.test.ts -> generate the mongodb id: `import mongoose from 'mongoose'`
- `const id = new mongoose.Types.ObjectId().toHexString();`

```ts
//show.test.ts
import mongoose from 'mongoose';

//...

// get a ticket by id that does not exist
it('returns a 404 if the ticket is not found', async () => { 
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404);

  console.log(response.body) //wont log unless .expect(404) is removed temporarily

});

```

### 286. Complete Index Route Implementation

<img src="exercise_files/udemy-microservices-section13-286-ticketing-service-overview-routes-GET-ALL.png" alt="udemy-microservices-section13-286-ticketing-service-overview-routes-GET-ALL.png" width="800"/>

- GET /api/tickets
- view all ticket entries in tickets collection
- no authentication for GET

- TODO: test that after 3 tickets are created
  - if you query the api, the response should have length of 3
make a request to api and expect length of 3 in response
#### create test
- `routes/__test__/index.test.ts`

```ts
import request from 'supertest';
import { app } from '../../app';

const createTicket = () => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'adasdasda',
      price: 20
    });
}

it('can fetch a list of tickets', async () => {
  
  //create 3x tickets
  await createTicket();
  await createTicket();
  await createTicket();

  //make a request to api and expect length of 3 in response
  const response = await request(app)
    .get('/api/tickets')
    .send()
    .expect(200);
  
  expect(response.body.length).toEqual(3);

});
```

#### create route
- tickets/src/routes/index.ts

```ts
import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});
  
  res.send(tickets);

});

export { router as indexTicketRouter };
```

```ts
//tickets/src/app.ts
import {indexTicketRouter} from './routes/index';
//...
app.use(indexTicketRouter);
```

### 287. Ticket Updating

<img src="exercise_files/udemy-microservices-section13-287-ticketing-service-overview-routes-UPDATE.png" alt="udemy-microservices-section13-287-ticketing-service-overview-routes-UPDATE.png" width="800"/>

- PUT /api/tickets/:id
- NOTE: requires authentication
- NOTE: only user who owns ticket can update it
- later in sections dealing with orders and payments etc, these tests will be critical
- there will be critical logic to determine whether a user can update a ticket

```ts
//tickets/src/routes/__test__/update.test.ts


import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin()) //is logged in
    .send({
      title: 'sdfsdfdsf',
      price: 20
    })
    .expect(404);
});

it('returns a 401 (not allowed) if user not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'sdfsdfdsf',
      price: 20
    })
    .expect(401);
});

it('returns a 401 if user does not own the ticket', async () => {
    
});

it('returns a 400 if the user provides an invalid title or price', async () => {
    
});

it('updates the ticket if provided valid inputs - happy test', async () => {
    
});

```

### 288. Handling Updates
- implementing the update route
- tickets/src/routes/update.ts

#### testing
- TODO: if `id` does not exist it should return 404
- TODO: if user `not authenticated` return 401
  - add the middleware: `requireAuth` to route, it will through the NotAuthorizedError


```ts
//tickets/src/routes/update.ts

import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError
} from '@clarklindev/common';

import { Ticket } from '../models/ticket';

const router = express.Router();

router.put('/api/tickets/:id', requireAuth, async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if(!ticket){
    throw new NotFoundError();
  }

  res.send(ticket);

});

export {router as updateTicketRouter}

```

- wire up to tickets/src/app.ts

```ts
//...
import {updateTicketRouter} from './routes/update';
//...
app.use(updateTicketRouter);

```

### 289. Permission Checking
- TODO: `tickets/src/routes/__test__/update.test.ts`
- create a ticket and then try update with a different user -> return statusCode: 401

#### create a ticket
- this creates a ticket -> BUT... the ticket will have `user id` that is the same userId as signin (from cookie)
- any follow up request to try edit a ticket will use the same cookie (with same user id) ie. we currently only have one user 
- FIX: fix in test/setup.ts (see below...)

- AFTER UPDATE (tickets/src/test/setup.ts)
- with the request, it calls `global.signin()` which returns a cookie with a new user id 
- REQUIRED: capture the `response` -> to save this cookie or its id
- pretend you're a different user by calling setCookie on follow up request, and calling `global.sigin()` again (produces new id)
  - .expect(401)

- OPTIONAL - do a follow up and check on the ticket and ensure its details did not update (because different user was used)

```ts
//tickets/src/routes/__test__/update.test.ts
it('returns a 401 if user does not own the ticket', async () => {

//create a ticket REQUEST
const response = await request(app)
  .post(`/api/tickets`)
  .set('Cookie', global.signin())
  .send({
    title: 'sfddsfsd',
    price: 20
  });

//...edit a ticket REQUEST
//currently it will use the same cookie
//AFTER UPDATE (tickets/src/test/setup.ts)
await request(app)
  .put(`/api/tickets/${response.body.id}`)
  .set('Cookie', global.signin())
  .send({
    title: 'asddasd',
    price: 20
  })
  .expect(401);
});

```
#### test setup -> setting the id

- tickets/src/test/setup.ts
- we set the cookie id up with the payload in the global `signin()` function
- FIX: instead of hardcoding the id, everytime signin() is called should generate a different id.
  - `new mongoose.Types.ObjectId().toHexString()`

```ts
//tickets/src/test/setup.ts
import mongoose from 'mongoose';

//...

//get cookie
global.signin = ()=> {
  //1. build a jwt payload {id, email}
  const payload = {
    // id: '23432456565r6', 
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  }
  //2. create the jwt (need process.env.JWT_KEY)
  const token = jwt.sign(payload, process.env.JWT_KEY!);

   //3. build sesion object {jwt: MY_JWT}
   const session = {jwt: token};

   //4. turn session into JSON
   const sessionJSON = JSON.stringify(session);
 
   //5. take JSON and encode it as base64
   const base64 = Buffer.from(sessionJSON).toString('base64');
 
   //6. return a string with cookie: express:sess=cookie 
   return [`session=${base64}`];

}
```

#### update the update route
- tickets/src/routes/update.ts
- ensure whoever making request (current logged in user) is same user id as that on ticket
  - `if(ticket.userId !== req.currentUser!.id){}`
  - throw NotAuthorizedError()

```ts
//tickets/src/routes/update.ts

//...

router.put('/api/tickets/:id', requireAuth, async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if(!ticket){
    throw new NotFoundError();
  }

  if(ticket.userId !== req.currentUser!.id){
    throw new NotAuthorizedError();
  }

  res.send(ticket);

});
```

### 290. Final Update Changes
- `tickets/src/routes/__test__/update.test.ts` ...contined
- test with invalid title or price 
  - create a ticket
  - make a request to update - invalid title
  - make a request to update - invalid price

- happy test 
  - create ticket (request)
  - make an update (another request)
  - ensure same cookie as when calling create ticket
  - expect status code: 200
  - make a follow up request after update
```ts
//tickets/src/routes/__test__/update.test.ts

it('returns a 400 if the user provides an invalid title or price', async () => {

  const cookie = global.signin();

  //create a ticket
  const response = await request(app)
  .post(`/api/tickets`)
  .set('Cookie', cookie)
  .send({
    title: 'sfddsfsd',
    price: 20
  });

  //make a request to update - invalid title
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20
    })
    .expect(400);
  
  //make a request to update - invalid price
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'asdasddadsd',
      price: -20
    })
    .expect(400);
});

it('updates the ticket if provided valid inputs - happy test', async () => {
  const cookie = global.signin();

  //create a ticket
  const response = await request(app)
  .post(`/api/tickets`)
  .set('Cookie', cookie)
  .send({
    title: 'sfddsfsd',
    price: 20
  });

  //update ticket
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100
    })
    .expect(200);
  
  //fetch the ticket again
  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();
  
  expect(ticketResponse.body.title).toEqual('new title'); 
  expect(ticketResponse.body.price).toEqual(100); 
});

```

#### update the update route
- tickets/src/routes/update.ts
- validate the request, 
- apply update 
- save ticket
- sending back ticket will have the updated data

```ts
//tickets/src/routes/update.ts
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError
} from '@clarklindev/common';

//...

router.put('/api/tickets/:id',
  requireAuth,
  [
    body('title')
      .not()
      .isEmpty()
      .withMessage('Title is required'),
    body('price')
      .isFloat({gt: 0})
      .withMessage('Price must be provided and greater than 0')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if(!ticket){
      throw new NotFoundError();
    }

    if(ticket.userId !== req.currentUser!.id){
      throw new NotAuthorizedError();
    }

    //apply update 
    ticket.set({
      title: req.body.title,
      price: req.body.price
    })

    await ticket.save();  //ticket is now updated

    //sending back ticket will have the updated data
    res.send(ticket);
  }
);
```

### 291. Manual Testing
- TODO: expose access to the ticket service 
- need to update infra/k8s/ingress-srv.yaml 
- add a new path to ingress-srv before the catchall (`path: /?(.*)`)  route

#### updated kubernetes syntax (Kubernetes 1.19+)
- NOTE: this is the updated syntax used in Kubernetes ingress resources , specifically for Kubernetes 1.19+. The tutorial uses the old style of defining serviceName and servicePort, which was deprecated in newer versions of Kubernetes.
- NOTE: `pathType: ImplementationSpecific` -> allows a regex path match in Kubernetes Ingress

#### DEPRECATED SYNTAX
```yaml
#infra/k8s/ingress-srv.yaml

#...
- path: /api/users/?(.*)
  backend:
    serviceName: auth-srv
    servicePort: 3000
#...
```

#### UPDATED SYNTAX
```yaml
#infra/k8s/ingress-srv.yaml
#...
paths:
- path: /api/users/?(.*)
  pathType: ImplementationSpecific
  backend:
    service:
      name: auth-srv
      port:
        number: 3000
- path: /api/tickets/?(.*)
  pathType: ImplementationSpecific
  backend:
    service:
      name: tickets-srv
      port: 
        number: 3000
- path: /?(.*)
  pathType: ImplementationSpecific
  backend:
    service:
      name: client-srv
      port:
        number: 3000
#...
```

#### manual testing with postman

##### sign in/sign up
- first signin or signup (to be authenticated)
  - the email/password must already exist on auth service (signin) or signup (new credentials)

- POSTMAN POST https://ticketing.dev/api/users/signin
  - body -> raw -> JSON -> {"email": "test@test.com", "password": "password"}

##### ensure user logged in
- POSTMAN GET https://ticketing.dev/api/users/currentuser
- if signedin/signedup -> expect authentication response 

```ts
  "currentUser":{
    "id": "sdfsdfsdfsfsd3424234",
    "email": "test@test.com",
    "password": "password"
  }
```

#### create a ticket
- POSTMAN POST https://ticketing.dev/api/tickets
  - body -> raw -> JSON -> {"title": "new ticket", "price": 20}
- EXPECT RESPONSE status 200
- returns a ticket with (id) property eg. ABCDEFG

#### get ticket (single) -> use ticket id (from create a ticket)  
- POSTMAN GET https://ticketing.dev/api/tickets/54hhh4545636346346
- EXPECT RESPONSE status 200 with details about ticket

#### get all tickets
- POSTMAN GET https://ticketing.dev/api/tickets/
- EXPECT RESPONSE array of tickets

#### update the ticket
- NOTE: you need to use the same ticket id (from create a ticket)
- POSTMAN PUT https://ticketing.dev/api/tickets/ABCDEFG
  - body -> raw -> JSON -> {"title": "updated ticket", "price": 10}
- EXPECT RESPONSE with updated data
- can check the updated ticket with a request `GET ticket (single)`

---

## section 14 - NATS streaming server - an event bus implementation (2hr57min)
### 292. What Now?

- Reminder of our services  

<img src="exercise_files/udemy-microservices-section14-292-reminder-our-services.png" alt="udemy-microservices-section14-292-reminder-our-services.png" width="800"/>

<img src="exercise_files/udemy-microservices-section14-292-next-steps.png" alt="udemy-microservices-section14-292-next-steps.png" width="800">

### what next?
- OPTION 1 - frontend of ticket-related (client side)
- OPTION 2 - ticket 'orders' service
  - deals with people wanting to buy a ticket
- OPTION 3 (WINNER) - add Event bus - wire tickets service up / handling events

#### Event bus

<img src="exercise_files/udemy-microservices-section14-292-reminder-NATS-streaming-server.png" alt="udemy-microservices-section14-292-reminder-NATS-streaming-server.png" width="800"/>

- understanding and taking care of issues with handling data between tickets/orders service
- TODO: implement event bus with NATS (streaming-server)
  - before... we implement a simple event bus from scratch
  - differences between our event bus (express) vs NATS


### 293. NATS Server Status - IMPORTANT NOTE
- DockerHub image of the NATS Streaming Server (and the docs)
- NOTE: [deprecation legacy docs](https://nats-io.gitbook.io/legacy-nats-docs/nats-streaming-server-aka-stan/developing-with-stan) warning for NATS Streaming server on docs 
- So just to be clear, NATS Streaming server is deprecated not NATS, 
- NATS streaming has been deprecated in favor of a more modern JetStream (newer, more robust persistence layer, offering advanced features like durable streams, stream processing, and more extensive support for persistent message queues).
- there are other options for message queue services like RabbitMQ and Kafka
- NATS shows how message queues work

### 294. Three Important Items

#### we are using NATS Streaming server
- [NATS](https://docs.nats.io) streaming server - shares events across different applications
- `NATS` vs `NATS Streaming server` are different programs
- NATS (simple implementation of event sharing) -> WE ARE NOT USING THIS
- NATS Streaming server (built on top of NATS) -> more advanced and full of features
- Stephan mentions that when he uses the term "NATS", he is reffering to "NATS Streaming Server"
- the docs (https://docs.nats.io) is mainly about NATS
- there is a section [`NATS Streaming Concepts`](https://nats-io.gitbook.io/legacy-nats-docs/nats-streaming-server-aka-stan/stan-concepts) which is what we need
- NATS Streaming implements important design decisions that will affect our app.

#### NATS Streaming image in kubernetes
- we will run [`nats-streaming`](https://hub.docker.com/_/nats-streaming) docker image in kubernetes

#### nats-streaming Docker documentation
- note the [command line options](https://hub.docker.com/_/nats-streaming#commandline-options) for nats streaming server

- hub.docker.com -> image `nats-streaming`

```
Streaming Server Options:
    -cid, --cluster_id  <string>         Cluster ID (default: test-cluster)
    -st,  --store <string>               Store type: MEMORY|FILE|SQL (default: MEMORY)
          --dir <string>                 For FILE store type, this is the root directory
    -mc,  --max_channels <int>           Max number of channels (0 for unlimited)
    -msu, --max_subs <int>               Max number of subscriptions per channel (0 for unlimited)
    -mm,  --max_msgs <int>               Max number of messages per channel (0 for unlimited)
    -mb,  --max_bytes <size>             Max messages total size per channel (0 for unlimited)
    -ma,  --max_age <duration>           Max duration a message can be stored ("0s" for unlimited)
    -mi,  --max_inactivity <duration>    Max inactivity (no new message, no subscription) after which a channel can be garbage collected (0 for unlimited)
    -ns,  --nats_server <string>         Connect to this external NATS Server URL (embedded otherwise)
    -sc,  --stan_config <string>         Streaming server configuration file
    -hbi, --hb_interval <duration>       Interval at which server sends heartbeat to a client
    -hbt, --hb_timeout <duration>        How long server waits for a heartbeat response
    -hbf, --hb_fail_count <int>          Number of failed heartbeats before server closes the client connection
          --ft_group <string>            Name of the FT Group. A group can be 2 or more servers with a single active server and all sharing the same datastore
    -sl,  --signal <signal>[=<pid>]      Send signal to nats-streaming-server process (stop, quit, reopen, reload - only for embedded NATS Server)
          --encrypt <bool>               Specify if server should use encryption at rest
          --encryption_cipher <string>   Cipher to use for encryption. Currently support AES and CHAHA (ChaChaPoly). Defaults to AES
          --encryption_key <string>      Encryption Key. It is recommended to specify it through the NATS_STREAMING_ENCRYPTION_KEY environment variable instead
          --replace_durable <bool>       Replace the existing durable subscription instead of reporting a duplicate durable error

Streaming Server Clustering Options:
    --clustered <bool>                     Run the server in a clustered configuration (default: false)
    --cluster_node_id <string>             ID of the node within the cluster if there is no stored ID (default: random UUID)
    --cluster_bootstrap <bool>             Bootstrap the cluster if there is no existing state by electing self as leader (default: false)
    --cluster_peers <string, ...>          Comma separated list of cluster peer node IDs to bootstrap cluster state
    --cluster_log_path <string>            Directory to store log replication data
    --cluster_log_cache_size <int>         Number of log entries to cache in memory to reduce disk IO (default: 512)
    --cluster_log_snapshots <int>          Number of log snapshots to retain (default: 2)
    --cluster_trailing_logs <int>          Number of log entries to leave after a snapshot and compaction
    --cluster_sync <bool>                  Do a file sync after every write to the replication log and message store
    --cluster_raft_logging <bool>          Enable logging from the Raft library (disabled by default)
    --cluster_allow_add_remove_node <bool> Enable the ability to send NATS requests to the leader to add/remove cluster nodes

Streaming Server File Store Options:
    --file_compact_enabled <bool>        Enable file compaction
    --file_compact_frag <int>            File fragmentation threshold for compaction
    --file_compact_interval <int>        Minimum interval (in seconds) between file compactions
    --file_compact_min_size <size>       Minimum file size for compaction
    --file_buffer_size <size>            File buffer size (in bytes)
    --file_crc <bool>                    Enable file CRC-32 checksum
    --file_crc_poly <int>                Polynomial used to make the table used for CRC-32 checksum
    --file_sync <bool>                   Enable File.Sync on Flush
    --file_slice_max_msgs <int>          Maximum number of messages per file slice (subject to channel limits)
    --file_slice_max_bytes <size>        Maximum file slice size - including index file (subject to channel limits)
    --file_slice_max_age <duration>      Maximum file slice duration starting when the first message is stored (subject to channel limits)
    --file_slice_archive_script <string> Path to script to use if you want to archive a file slice being removed
    --file_fds_limit <int>               Store will try to use no more file descriptors than this given limit
    --file_parallel_recovery <int>       On startup, number of channels that can be recovered in parallel
    --file_truncate_bad_eof <bool>       Truncate files for which there is an unexpected EOF on recovery, dataloss may occur
    --file_read_buffer_size <size>       Size of messages read ahead buffer (0 to disable)
    --file_auto_sync <duration>          Interval at which the store should be automatically flushed and sync'ed on disk (<= 0 to disable)

Streaming Server SQL Store Options:
    --sql_driver <string>            Name of the SQL Driver ("mysql" or "postgres")
    --sql_source <string>            Datasource used when opening an SQL connection to the database
    --sql_no_caching <bool>          Enable/Disable caching for improved performance
    --sql_max_open_conns <int>       Maximum number of opened connections to the database
    --sql_bulk_insert_limit <int>    Maximum number of messages stored with a single SQL "INSERT" statement

Streaming Server TLS Options:
    -secure <bool>                   Use a TLS connection to the NATS server without
                                     verification; weaker than specifying certificates.
    -tls_client_key <string>         Client key for the streaming server
    -tls_client_cert <string>        Client certificate for the streaming server
    -tls_client_cacert <string>      Client certificate CA for the streaming server

Streaming Server Logging Options:
    -SD, --stan_debug=<bool>         Enable STAN debugging output
    -SV, --stan_trace=<bool>         Trace the raw STAN protocol
    -SDV                             Debug and trace STAN
         --syslog_name               On Windows, when running several servers as a service, use this name for the event source
    (See additional NATS logging options below)

Embedded NATS Server Options:
    -a, --addr <string>              Bind to host address (default: 0.0.0.0)
    -p, --port <int>                 Use port for clients (default: 4222)
    -P, --pid <string>               File to store PID
    -m, --http_port <int>            Use port for http monitoring
    -ms,--https_port <int>           Use port for https monitoring
    -c, --config <string>            Configuration file

Logging Options:
    -l, --log <string>               File to redirect log output
    -T, --logtime=<bool>             Timestamp log entries (default: true)
    -s, --syslog <bool>              Enable syslog as log method
    -r, --remote_syslog <string>     Syslog server addr (udp://localhost:514)
    -D, --debug=<bool>               Enable debugging output
    -V, --trace=<bool>               Trace the raw protocol
    -DV                              Debug and trace

Authorization Options:
        --user <string>              User required for connections
        --pass <string>              Password required for connections
        --auth <string>              Authorization token required for connections

TLS Options:
        --tls=<bool>                 Enable TLS, do not verify clients (default: false)
        --tlscert <string>           Server certificate file
        --tlskey <string>            Private key for server certificate
        --tlsverify=<bool>           Enable TLS, verify client certificates
        --tlscacert <string>         Client certificate CA for verification

NATS Clustering Options:
        --routes <string, ...>       Routes to solicit and connect
        --cluster <string>           Cluster URL for solicited routes

Common Options:
    -h, --help                       Show this message
    -v, --version                    Show version
        --help_tls                   TLS help.

```



### 295. Creating a NATS Streaming Deployment
- deploy NATS streaming deployment via kubernetes like any other of our services (with deployment yaml)
- `section05-14-ticketing/infra/k8s/nats-depl.yaml`
  - NOTE: the docker image for nats -> `image: nats-streaming:0.17.0`
  - the commandline options (Streaming Server Options) are given and in array `args: []`
  - arg order is important -> each argument and its value are separate values in the array
- create a config for cluster ip service
  - expose 2 separate ports
    - client -> tcp -> port 2222
    - monitoring -> tcp -> port 8222
- skaffold
  - `kubectl get pods`

```yaml
#section05-14-ticketing/infra/k8s/nats-depl.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: nats-depl
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nats
  template:
    metadata:
      labels:
        app: nats
    spec:
      containers:
        - name: nats
          image: nats-streaming:0.17.0
          args: [
            '-p',
            '4222',
            '-m',
            '8222',
            '-hbi',
            '5s',
            '-hbt',
            '5s',
            '-hbf',
            '2',
            '-SD',
            '-cid',
            'ticketing',
          ]
---
apiVersion: v1
kind: Service
metadata:
  name: nats-srv
spec:
  selector:
    app: nats
  ports:
    - name: client
      protocol: TCP
      port: 4222
      targetPort: 4222
    - name: monitoring
      protocol: TCP
      port: 8222
      targetPort: 8222
```

### 296. Big Notes on NATS Streaming
- `NATS streaming server` vs our `custom event bus` 

## our custom event bus
- custom event bus -> shared events with axios and express (eg. post event to event bus service)

<img src="exercise_files/udemy-microservices-section14-296-our-custom-event-bus.png" alt="udemy-microservices-section14-296-our-custom-event-bus.png" width="800"/>

### sending events
- if event bus receives an event, it sends it off to every service (even originating service)

<img src="exercise_files/udemy-microservices-section14-296-our-custom-event-bus-sends-events-to-every-service.png" alt="udemy-microservices-section14-296-our-custom-event-bus-sends-events-to-every-service.png" width="800"/>

### events stored in memory
- event bus stored events in memory -> if there was a service with down time and when it came back up, OR a new service added it fetched events it missed

### adding new service
- this was useful if you added new services -> the new service could request all events ever submitted -> and the event bus would send it and then the new service would be up to date.

<img src="exercise_files/udemy-microservices-section14-296-our-custom-event-bus-new-service-can-request-event-history-to-get-updated.png" alt="udemy-microservices-section14-296-our-custom-event-bus-new-service-can-request-event-history-to-get-updated.png" width="800"/>

## NATS Streaming server (node-nats-streaming)
- NATS Streaming server - uses a client library (instead of custom event bus) called npm package: `node-nats-streaming`
  - event-based 
  - create some objects
  - sets up listeners, 
  - emit events
  - callback based infrastructure
- services listening for events also with `node-nats-streaming` library
- so all event related stuff we use node-nats-streaming
- for normal http requests, still use express/node/axios

<img src="exercise_files/udemy-microservices-section14-296-using-nats.png" alt="udemy-microservices-section14-296-using-nats.png" width="800"/>

- NATS Streaming requires you to subscribe to specific channels (or topics)
- `channels of events OR types of events` you listen to specifically inside our services
- so on NATS streaming server - you create topics/channels
- to submit an event -> create an event in a service, reach out to NATS Streaming library and tell it to publish it to a specific channel
- event only sent to services listening on that channel
- a service has to subscribe/listen to a topics/channels to receive its events

<img src="exercise_files/udemy-microservices-section14-296-using-nats-streaming-subscribe-to-channels.png" alt="udemy-microservices-section14-296-using-nats-streaming-subscribe-to-channels.png" width="800"/>

### NATS streaming storing events - memory
- NATS Streaming stores all events in memory (default), flat files or in a mySQL/Postgres DB
- if a new service comes online -> it requests the NATS Streaming to give all events ever submitted 

<img src="exercise_files/udemy-microservices-section14-296-using-nats-streaming-stores-events-by-default-in-memory.png" alt="udemy-microservices-section14-296-using-nats-streaming-stores-events-by-default-in-memory.png" width="800"/>

### NATS streaming stores events - files (default) or db
- can configure NATS Streaming that events get stored in file or db
  - this way if the NATS Streaming goes down / offline / needs restart it loses everything stored in memory BUT it can then connect to the file / db to fetch all the events ever emitted

<img src="exercise_files/udemy-microservices-section14-296-using-nats-streaming-stores-all-events-in-files-default-or-db.png" alt="udemy-microservices-section14-296-using-nats-streaming-stores-all-events-in-files-default-or-db.png" width="800"/>

### 297. Building a NATS Test Project
<img src="exercise_files/udemy-microservices-section14-297-nats-building-a-NATS-test-project.png" alt="udemy-microservices-section14-297-nats-building-a-NATS-test-project.png" width="800"/>

- create a new sub-project (typscript) (this will be a test project)
- install NATS streaming library and connect to NATS streaming server
- 2 sub programs (npm scripts)
  - one to emit events
  - one to listen for events
- will run outside of kubernetes
  - but should connect to the `NATS Streaming server` inside the kubernetes cluster

- `section05-14-ticketing/nats-test`
- `npm init -y`
- `pnpm i node-nats-streaming ts-node-dev typescript @types/node`
- src/listener.ts
- src/publisher.ts
- add scripts to package.json

#### troubleshoot 
- this `tsc --init` command requires typescript to be installed globally 
- `npm i -g typescript` 
- NOTE: if you installing globally dont use pnpm, use npm is fine
- ensure that npm is added to environment variables -> path: `c:\Users\admin\AppData\Roaming\npm\` 

```json
//package.json
//...

  "scripts": {
    "publish": "ts-node-dev --notify false src/publisher.ts",
    "listen": "ts-node-dev --notify false src/listen.ts"
  },

//...

```
- from `section05-14-ticketing/nats-test/` folder: make it a typescript project: `tsc --init` -> creates a `tsconfig.json`

- note instead of calling it a `client`, documentation calls it `stan` (which is `nats` spelt backwards) 
- `stan` is a nats project terminology for a client
- `nats` is a library
- `stan` is an instance / client used to connect to nats streaming server

#### publisher.ts
- .connect() has some arguments
  - the arguments:
    - 1st argument -> value set to 'ticketing'
    - 2nd argument -> value set to 'abc'
    - 3rd argument -> value set to an object with url

- after client successfully connects to NATS streaming server -> it will emit a `connect` event.
- we can listen for this event via callback: `stan.on('connect', ()=>{}) ` (executes after client has successfully connected to nats streaming server)
- NOTE: this will yield an error because `NATS streaming server` is not on localhost:4222 but in the kubernetes cluster...
  - by default we dont have access to anything running in the kubernetes cluster
  - we are trying to run our program and trying to access a pod running inside a kubernetes cluster

<img src="exercise_files/udemy-microservices-section14-298-connect-nats-on-localhost-port-4222-error.png" alt="udemy-microservices-section14-298-connect-nats-on-localhost-port-4222-error" width="800"/>

```ts
//section05-14-ticketing/nats-test/src/publisher.ts
import nats from 'node-nats-streaming';

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
});

stan.on('connect', ()=>{
  console.log('publisher connected to NATS')
})

```
#### troubleshoot 
- error - typescript error with the `stan.on()` listener
- FIX: ensure the project is typescript project by calling `tsc --init` from within `nats-test/` folder
  - this creates `nats-test/tsconfig.json`

### 298. Port-Forwarding with Kubectl
- for test purposes, to get access to the NATS Streaming server we can:

#### accessing something inside a cluster
- to access something inside the cluster there are some options:
- we will use option 3

## OPTION 1 - clusterIP service
- access pod via cluster ip service
- our publisher program can then communicate directly with ingress nginx
- CON is that its not easy severe the link (ingress-nginx and clusterIP service) and then toggle it back on

<img src="exercise_files/udemy-microservices-section14-298-port-forwarding-option1-connect-via-cluster-ip-service.png" alt="udemy-microservices-section14-298-port-forwarding-option1-connect-via-cluster-ip-service.png" width="800"/>

## OPTION 2 - create a NodePort service
- or can create a node port service to connect pod to outside world (outside the kubernetes cluster)
- CON is that its not easy severe the link (NodePort service) and then toggle it back on
- would still require a config file

<img src="exercise_files/udemy-microservices-section14-298-port-forwarding-option2-connect-via-nodeport-service.png" alt="udemy-microservices-section14-298-port-forwarding-option2-connect-via-nodeport-service.png" width="800"/>

## OPTION 3 - (ONLY while in dev)  
- run a command in terminal that tells `Kubernetes cluster` to `port forward` a port off a `specific pod` in our cluster.
- this will cause cluster to behave as if it has a nodePort service running inside of it 
- will expose the pod (port) to outside world
- allows to connect from local machine

<img src="exercise_files/udemy-microservices-section14-298-port-forwarding-option3-port-forward-a-port-off-a-pod.png" alt="udemy-microservices-section14-298-port-forwarding-option3-port-forward-a-port-off-a-pod.png" width="800"/>

//-------------------------------------------------------------------------------
# STEPS TO PUBLISHING
## STEP1 

- /nats-test/
- `kubectl get pods`

<img src="exercise_files/udemy-microservices-section14-298-kubectrl-get-pods.png" alt="udemy-microservices-section14-298-kubectrl-get-pods.png" width="800"/>


## STEP 2
#### forwarding port
- get name of pod: kubectl port-forward nats-depl-... [port on local machine to get access to the nats-depl-... pod]:[port on the pod trying get access to]
- run from /nats-test/ folder: `kubectl port-forward nats-depl-85f8d5bb89-jx85p 4222:4222`
- this command is not restricted to NATS but can be used connect to any pod we want to temporarily connect to

- NOTE: DO NOT CLOSE THIS TERMINAL WINDOW

```cmd
Forwarding from 127.0.0.1:4222 -> 4222
Forwarding from [::1]:4222 -> 4222
```

## STEP 3
#### running publish
- open another Terminal
  - /nats-test/ `pnpm run publish`

```cmd
[INFO] 15:07:03 ts-node-dev ver. 2.0.0 (using ts-node ver. 10.9.2, typescript ver. 5.7.2)
publisher connected to NATS
```

#### to stop port forwarding
- to easily break connection -> stop the process running the port forward command (will do it later)

### 299. Publishing Events

<img src="exercise_files/udemy-microservices-section14-299-overview-of-publisher-and-listener-and-nats-initial-diagram.png" alt="udemy-microservices-section14-299-overview-of-publisher-and-listener-and-nats-initial-diagram.png" width="800"/>

#### NATS streaming server
- NATS streaming server has list of channels
- we always publish information to a specific channel

#### publisher

- DATA
- `data` to share (eg an object) eg. a ticket with 'title' 'price'
- this data is reffered to in NATS as a message 
- we sometimes refer to it as an event

- SUBJECT
- subject (name of channel where we want to share information): `ticket:created`
- the data and subject is passed into stan client

- CHANNEL
- NATS streaming server will then add subject `ticket:created` to its list of channels
- NATS will take this `data` and broadcast to anyone listening
- NOTE: NATS can only communicate in 'strings' so need to convert js to JSON
- stan.publish() 
  - first param is the subject/channel
  - second is data
  - third (optional) is a callback function once publish has completed

```ts
//nats-test/publisher.ts

import nats from 'node-nats-streaming';

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('publisher connected to NATS')

  const data = JSON.stringify({
    id: '123',
    title: 'concert',
    price: 20,
  });

  stan.publish('ticket:created', data, () => {
    console.log('event published')
  });

});
```

<img src="exercise_files/udemy-microservices-section14-299-stan-publish.png" alt="udemy-microservices-section14-299-stan-publish.png" width="800"/>

#### listener
- the listener will be listening for a subject - `ticket:created`
- it will send this (subject) to stan client
- `stan client` will tell `NATS Streaming server` that anytime data is received from this channel (subject), it should receive a copy of it
- it receives this new data.

- SUBSCRIPTION
- `subscription` is what will listen to the channel and received data

<img src="exercise_files/udemy-microservices-section14-299-overview-of-publisher-and-listener-and-nats.png" alt="udemy-microservices-section14-299-overview-of-publisher-and-listener-and-nats.png" width="800"/>


### 300. Small Required Command Change
- REQUIRED for upcoming lessons
- `ts-node-dev` updated library by default does NOT restart 
- you need to enable it in scripts -> add `--rs` to `ts-node-dev` commands 

- package.json

```json
//package.json
"scripts": {
  "publish": "ts-node-dev --rs --notify false src/publisher.ts",
  "listen": "ts-node-dev --rs --notify false src/listener.ts"
},
```

### 301. Listening For Data
- TODO: create a subject/ channel we want to listen to
- given to stan client
- registers a subscription with NATS Streaming

```ts
//nats-test/src/listener.ts
import nats from 'node-nats-streaming';

console.clear();

const stan = nats.connect('ticketing', '123', {
  url:'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  const subscription = stan.subscribe('ticket:created');

  subscription.on('message', (msg) => {
    console.log('message received');
  })
});
```

### TEST

- vscode terminal 1 -> from main project dir run `scaffold dev` 

#### PUBLISH
- vscode terminal 2 -> from `nats-test/`
  - get pod name: `kubectl get pods`
  - forward port: `kubectl port-forward nats-depl-85f8d5bb89-jx85p 4222:4222`

- vscode terminal 3 -> from `nats-test/` folder
  - run publish: `pnpm run publish`

- EXPECT:
```
publisher connected to NATS
event published
```

#### LISTEN
- vscode terminal 4 -> from `nats-test`
  - run publish: `pnpm run listen`

- EXPECT:
```
Listener connected to NATS
message received
```
### 302. Accessing Event Data
- UPDATED: nats-test/src/listener.ts
- giving the prop an annotation of `Message`
  - ctrl + click on `Message` to see type definition
  - important functions:
    - `getSubject()` returns name of channel
    - `getSequence()` get the number of the message (ie. 1st message is 1)
    - `getData()` returns the data of the message 

- Docker desktop is running / kubernetes is running
- `Skaffold dev`

-LISTEN
- nats-test/ `pnpm run listen`

- PUBLISH
- docker desktop is running (docker / kubernetes)
- 1st terminal window -> `skaffold dev` 

-`nats-test/` folder: 
  - get pods:  `kubectl get pods`
  - 2nd terminal window -> forward port: `kubectl port-forward nats-depl-7b8d75cc76-rk5hd 4222:4222`
    - NOTE: the pods name changes everytime skaffold dev is run: `nats-depl-`

  - in 3rd terminal window -> `pnpm run publish`
  - type: `rs` (to restart/re-connect publish) and everytime a new message will be sent and received by listener
  - expect that the listener terminal receives the message and that event #number `msg.getSequence()` gets incremented

<img src="exercise_files/udemy-microservices-section14-302-accessing-event-data-showing-rs-restarts-which-causes-publish.png" alt="udemy-microservices-section14-302-accessing-event-data-showing-rs-restarts-which-causes-publish.png" width="800"/>

```ts
//nats-test/src/listener.ts
import nats, {Message} from 'node-nats-streaming';

console.clear();

const stan = nats.connect('ticketing', '123', {
  url:'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  const subscription = stan.subscribe('ticket:created');

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    if(typeof data === 'string'){
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }
  })
});
```

### 303. Client ID Generation
- adding additional listener (horizontal scale) causes error
<img src="exercise_files/udemy-microservices-section14-303-client-id-generation-horizontal-scale-adding-additional-listener-causes-error.png" alt="udemy-microservices-section14-303-client-id-generation-horizontal-scale-adding-additional-listener-causes-error.png" width="800"/>

- the second argument to publisher calling .connect() is the client id
- NATS server maintains list of channels (subject)
- NATS server maintains list of clients connected to it.
- so when an additional listener is connected, currently we are using the same client id (which NATS doesnt want)

<img src="exercise_files/udemy-microservices-section14-303-client-id-duplicate-error.png" alt="udemy-microservices-section14-303-client-id-duplicate-error.png" width="800"/>

- FIX: randomly create the connect id 
- OUTCOME: can run multiple clients each with a random generated ID

#### generate connect id
- we use `randomBytes` from `crypto` library `randomBytes(4).toString('hex')`
- nats-test/src/listener.ts

```ts
//nats-test/src/listener.ts
import {randomBytes} from 'crypto';

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url:'http://localhost:4222'
});

```

### 304. Queue Groups
- 1x publisher / 2x listeners
- listeners - second argument to subscribe()
- PROBLEM: if both listeners commited code to db then you would have duplicate entries saved in db

#### Queue Group
- FIX: Queue Group - if there are `multiple instances` of `same service` (horizontal scaling) only one of them should receive the message
- queue groups are created inside a channel
- can have multiple queue groups inside a channel
- queue group has a name (reference)
- every instance of service eg. order service has a subscription and joins this queue group
- incoming message -> NATS only sends it to one member inside queue group

<img src="exercise_files/udemy-microservices-section14-304-queue-group-sends-to-one-in-group.png" alt="udemy-microservices-section14-304-queue-group-sends-to-one-in-group.png" width="800" />

- queue groups basically limit the number of messages received by its members
- other listeners subscribed to channel (not in queue group) will still receive a copy of the message

<img src="exercise_files/udemy-microservices-section14-304-queue-group-all-subscribers-of-channel-receive-events.png" alt="udemy-microservices-section14-304-queue-group-all-subscribers-of-channel-receive-events.png" width="800" />

#### creating queue group
- the first is the name of the channel you want to listen 
- you can add a listener to a queue group by specifying a 2nd parameter to the .subscribe() call
  - eg `orders-service-queue-group` -> other listeners need to use this same string to be in same group 

```ts
//nats-test/src/listeners.ts

//...
stan.on('connect', () => {
  
  const subscription = stan.subscribe(
    'ticket:created', 
    'orders-service-queue-group'
  );
}
```

<img src="exercise_files/udemy-microservices-section14-304-queue-group-only-one-in-group-receives-message.png" alt="udemy-microservices-section14-304-queue-group-only-one-in-group-receives-message.png" width="800"/>

### 305. Manual Ack Mode
- the first 2 paramaters are strings, but the third is chained on function calls
- to add other options you can chain them on as methods onto `subscriptionOption()` call
  - .setDeliverAllAvailable()
  - .setManualAckMode()
  - .setMaxInFlight()
- eg. `const options = stan.subscriptionOptions().setMaxInFlight().setDeliverAllAvailable();`
- options is then passed into subscribe() as the 3rd argument

- **Previous Setup Recap:**
  - Added a second argument to the `subscribe` call for setting up a queue group.
  
- **Customizing Subscriptions:**
  - First two arguments (`channel name`, `queue group`) are strings.
  - Additional options are more complex and set via chained method calls.

- **Setting Options:**
  - Options are created using `stan.subscriptionOptions()`.
  - Configurable methods include:
    - `setDeliverAllAvailable()`
    - `setManualAckMode()`
    - `setMaxInFlight()`
  - Options are provided as the third argument to the `subscribe` call.

```ts
//nats-test/src/listeners.ts

//...
stan.on('connect', () => {
  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true);

  const subscription = stan.subscribe(
    'ticket:created', 
    'orders-service-queue-group',
    options
  );

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`)
    }

    msg.ack();
  });

}
```

### SUMMARY
#### default .subscribe() behavior
- when subscriber (listener) receives a message from NATS channel, by default it is marked as 'processed'
- if there are errors during processing of message, the event/message is lost.

<img src="exercise_files/udemy-microservices-section14-305-default-mode-vs-manual-ack-mode.png" alt="udemy-microservices-section14-305-default-mode-vs-manual-ack-mode.png" width="800" />

- this causes NATS to not retry sending (otherwise it keeps sending message until ack() received)
- getSequence() does not increase on retries

- **Default Behavior of Subscriptions:**
  - Events are marked as processed automatically upon receipt.
  - Errors during processing result in event loss.

#### override default
- call `setManualAckMode(true)`
- makes events NOT marked as processed until explicitly acknowledged calling `msg.ack()`
- unprocessed events keep retries (every 30sec)

- **Changing Default Behavior:**
  - Use `setManualAckMode(true)` to enable manual acknowledgment.
  - Manual acknowledgment ensures:
    - Events are not marked as processed until explicitly acknowledged.
    - Unacknowledged events are retried after a 30-second timeout.
    - Events can be retried by another service or the same service.

- **Manual Acknowledgment Workflow:**
  - Acknowledge events using `msg.ack()`.
  - Without acknowledgment:
    - The server retries delivery every 30 seconds.
    - Events cycle through queue group members until successfully processed.

- **Use Case Importance:**
  - Critical for ensuring event processing reliability (e.g., payment events).
  - Prevents event loss due to transient failures or processing errors.

- **Implementation Steps:**
  1. Enable manual mode with `setManualAckMode(true)`.
  2. Add `msg.ack()` in the event handler after successful processing.
  3. Test by observing retries for unacknowledged events.

- **Conclusion:**
  - `setManualAckMode(true)` is crucial for ensuring fault tolerance and reliability in event processing.

### 306. Client Health Checks
- if the listeners are restarted quickly and publish restarted quickly after - it may publish message but the listeners might miss it, and only after show it with order wrong.

<img src='exercise_files/udemy-microservices-section14-306-client-health-checks.png' alt='udemy-microservices-section14-306-client-health-checks.png' width='800'/>

- troubleshooting an issue in a NATS streaming server where published events are delayed or temporarily lost when restarting listeners. 

#### Issue Replication:

- After restarting listeners, events (e.g., event 71) may not appear immediately in the listeners.
- The server delays processing due to assumptions about temporary disconnections.
- Investigation Using Monitoring Port:
- The NATS server exposes a monitoring port (8222) to provide data about clients, channels, and subscriptions.

- open another terminal window: `nats-test/`
```terminal 
kubectl get pods
kubectl port-forward nats-depl-[pod name] 8222:8222
```

#### NATS streaming server monitoring page
###### view in browser 
- browser: `localhost:8222/streaming` (NATS streaming server monitoring page)

<img src='exercise_files/udemy-microservices-section14-306-localhost-8222-nats-streaming.png' alt='udemy-microservices-section14-306-localhost-8222-nats-streaming.png' width='800'/>

- http://localhost:8222/streaming/clientsz
  - prints out every client (id) connected to NATS streaming server
 
  <img src='exercise_files/udemy-microservices-section14-306-localhost-8222-nats-streaming-clients.png' alt='udemy-microservices-section14-306-localhost-8222-nats-streaming-clients.png' width='800'/>

- http://localhost:8222/streaming/channelsz
  - prints out all channels in NATS

  <img src='exercise_files/udemy-microservices-section14-306-localhost-8222-nats-streaming-clients.png' alt='udemy-microservices-section14-306-localhost-8222-nats-streaming-clients.png' width='800'/>

- http://localhost:8222/streaming/channelsz?subs=1
  - Using the `subs=1` query, detailed channels information NATS streaming server is running
  - helping identify disconnected clients.
  - queue_name
  - ack_wait
  
  <img src='exercise_files/udemy-microservices-section14-306-localhost-8222-nats-streaming-channels-subs=1.png' alt='udemy-microservices-section14-306-localhost-8222-nats-streaming-channels-subs=1.png' width='800'/>

#### NATS waiting for listener to come back online...
- restarting a subscription (listener) and then refreshing `NATS streaming server monitoring page` prints out 3 subscriptions.
- stopping give NATS hope that the listener will come back online
- NATS will wait until eventually it decides listener is not coming back... then removed from the list..
- in `src/infra/k8s/nats-depl.yaml` - NOTE `-hbi`, `-hbt`, `-hbf`
  - `hb` (heartbeat) request that Netsream Server sends to every connected client every x seconds as health check ensures they still running.
  - `hbi` (how often NATS Stream server makes heartbeat request to clients)
  - `hbt` (how long each client has to respond)
  - `hbf` (how many times client request can fail before NATS assumes the connected client is dead)

#### consequence of killing a listener
- killing a listener
- NATS sends a heart beat request
- wait for heartbeat request to fail twice in a row 
- NATS realises client is gone
- NATS removes listener off `streaming/channels/subscriptions` list

### figuring out client not active - OPTION 1
- we can implement tighter heartbeat checks (event then there is delay of eg. 10seconds before cleanup)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nats-depl
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nats
  template:
    metadata:
      labels:
        app: nats
    spec:
      containers:
        - name: nats
          image: nats-streaming:0.17.0
          args: [
            '-p',
            '4222',
            '-m',
            '8222',
            '-hbi',
            '5s',
            '-hbt',
            '5s',
            '-hbf',
            '2',
            '-SD',
            '-cid',
            'ticketing',
          ]
---
apiVersion: v1
kind: Service
metadata:
  name: nats-srv
spec:
  selector:
    app: nats
  ports:
    - name: client
      protocol: TCP
      port: 4222
      targetPort: 4222
    - name: monitoring
      protocol: TCP
      port: 8222
      targetPort: 8222
```


#### Observation:

- When a listener restarts, its subscription lingers briefly as the server assumes it might reconnect.
This leads to delayed delivery of messages or temporary loss until the server determines the client is offline.

#### Root Cause:

- The server's default behavior involves waiting for heartbeat failures before marking a client as disconnected.

#### Potential Solutions:

- Tighter Heartbeat Configurations:
- Adjust: 
  - HB (heartbeat frequency), 
  - HBT (response time), and 
  - HBF (failure count) to detect disconnections faster.

#### Explicit Client Notifications:
- Implement methods for clients to explicitly notify the server of disconnection to prevent lingering subscriptions.

- This diagnostic approach and solutions aim to reduce message delays and ensure the NATS streaming server handles client disconnections more reliably. Further adjustments and enhancements are discussed in subsequent steps.

### figuring out client not active - OPTION 2
### 307. Graceful Client Shutdown
- the client explicitly notifies the NATS Streaming server when it is closing, so the server stops sending messages

- TODO: modify the `listener` and `publisher` code to detect when the process is about to close (eg. on a manual restart or if the terminal is closed).
- calling stan.close() will tell program to close down client first...and dont send any more messages
- then `stan.on('close', ()=>{})` will be invoked

```ts
//nats-test/listeners.ts
//...
stam.on('connect', ()=> {
  //...

  stan.on('close', ()=> {
    console.log('NATS connection closed');
    process.exit();
  });

  //...
});

process.on('SIGINT', ()=> stan.close());
process.on('SIGTERM', ()=> stan.close());

```
- when realizing process will close...we add event handlers to `send a shutdown request` to the server, informing it that the client is going offline and shouldn't receive any more messages
- TODO: add handlers for termination signals to ensure that when the process is interrupted, the client sends a `close signal` to the server before the process ends.
  - `SIGINT` (interrupt signal -> eg. restarting program) 
  - `SIGTERM` (terminate signal -> eg. CTRL + C) 
- NOTE on windows 'SIGINT' and 'SIGTERM' might not work correctly...

TEST - observe the subscription list in the browser, ensuring that closed clients are removed from the server's list of active subscriptions.
- not foolproof -> If the process is forcibly killed (eg. through the task manager), the shutdown request wont be sent.

# 308. Core Concurrency Issues 
- THEORY LESSON
- THIS IS AN IMPORTANT LESSON (MAYBE THE MOST IMPORTANT IN COURSE)
- events arriving outside of intended order

- some things that can go wrong:
  1. Listener can fail to process the event
    - file for storage is locked preventing processing event
    - limit to amount you can deposit
  2. waiting for event 1 to retry 
    - causes order of received events to process out of order
    - ie. event 1 failed and needs to retry
    - event 2, 3 get processed before event 1
  3. one listener might run quicker than another
    - so backlog of deposit
    - and withdrawal (faster)
  4. listener shuts down (ungracefully)
    - NATS thinks listener still alive, sends the message, fails acknowledge 
    - withdrawal request gets processed
    - 30seconds later -> shuts down and retries on another listener
  5. processing same event twice in a row 
    - listener fails to process event on time 
    - eg. time to process event/message takes exactly 30seconds 
    - at 30 seconds NATS assumes the event process failed and sends out another event for processing

### 309. Common Questions

- THEORY

- there are challenges of concurrency and event-based communication in microservices
- potential issues with both asynchronous and synchronous communication styles.

#### Concurrency Problems in Microservices:

<img src="exercise_files/udemy-microservices-section14-309-01-is-async-bad-vs-sync-or-monolithic-vs-microservices.png" alt="udemy-microservices-section14-309-01-is-async-bad-vs-sync-or-monolithic-vs-microservices.png" width="600"/>

- Asynchronous communication between microservices via events can lead to concurrency issues. However, these same problems (eg inconsistent states or race conditions) can also occur with synchronous communication in monolithic architectures.

- in a monolithic app, multiple instances of the application may cause race conditions due to load balancing, leading to potential errors like an incorrect balance during transactions.

<img src="exercise_files/udemy-microservices-section14-309-02-monolithic-with-load-balancer.png" alt="udemy-microservices-section14-309-02-monolithic-with-load-balancer.png" width="600"/>

- with micro-architecture the problems are a lot more prominent because:
  - latency regarding NATS (race-conditions)
  - automatic retries of delivering events
  - more complex system
  - communication jumps

#### Failure of Single Instance Solution:
- 2 instances of account service

<img src="exercise_files/udemy-microservices-section14-309-03-possible-solution-1-two-service-listener.png" alt="udemy-microservices-section14-309-03-possible-solution-1-two-service-listener.png" width="600"/>

- 1 instance of account service

<img src="exercise_files/udemy-microservices-section14-309-03-possible-solution-1-single-copy-service-listener-fail-bottleneck.png" alt="udemy-microservices-section14-309-03-possible-solution-1-single-copy-service-listener-fail-bottleneck.png" width="600"/>

- using just one instance of a service to avoid concurrency issues. 
- creates a bottleneck, limiting the app's scalability. 
- This also doesn't completely solve the issue because failures (e.g., temporary issues with file systems or retries) can still occur, leading to the same concurrency problems.

- Scaling vertically (increasing resources) is not enough for handling more traffic; hence, the need to scale horizontally (running multiple service instances) is important.

#### The Myth of Perfect Concurrency Handling:

<img src="exercise_files/udemy-microservices-section14-309-03-possible-solution-2-solving-every-concurrency-issue-fail.png" alt="udemy-microservices-section14-309-03-possible-solution-2-solving-every-concurrency-issue-fail.png" width="600"/>

- Trying to handle every possible concurrency issue through code is not feasible because there are potentially infinite scenarios. 
- in most applications (e.g., social media platforms), minor inconsistencies like out-of-order or duplicate events are often not critical.
- find balance between solving concurrency issues and the time and effort required. 
- Sometimes, trying to fix every possible issue isn't worth the engineering cost.

#### Conclusion:
- concurrency issues are inevitable, whether in microservices or monolithic architectures. 
- solutions can help mitigate some problems (e.g., limiting instances)
- perfect handling of concurrency is often impractical for most applications.

### 310. [Optional] More Possible Concurrency Solutions
- 16min 42sec
- THESE SOLUTIONS WONT WORK (STEPHENS THOUGHTS)

- Each solution progresses closer to resolving concurrency challenges but falls short due to technical limitations or performance trade-offs. 

## 3 potential solutions 
- highlighting 3 solutions for handling concurrency in distributed systems and why these don't fully work

## 1. Shared State with Sequence Numbers:
- Events are processed sequentially (in-order) by checking a shared store (processed sequence #'s) to ensure previous events are completed (processed).

- Pro: Ensures events are processed exactly once and in the correct order.
- Con: Sequential processing leads to significant performance bottlenecks, especially when unrelated accounts or resources are held up by delays.

### when everything works as it should (in-order)

<img src="exercise_files/udemy-microservices-section14-310-01-possible-solution-3-share-state-between-services-first-ensure-previous-process-sequence_1.png" alt="udemy-microservices-section14-310-01-possible-solution-3-share-state-between-services-first-ensure-previous-process-sequence_1.png" width="600"/>

- number one, it goes over to service A
- service will immediately process this event. So it's going to deposit $70.
- It will then take that sequence number and put it into the shared store.
---

<img src="exercise_files/udemy-microservices-section14-310-01-possible-solution-3-share-state-between-services-first-ensure-previous-process-sequence_2.png" alt="udemy-microservices-section14-310-01-possible-solution-3-share-state-between-services-first-ensure-previous-process-sequence_2.png" width="600"/>

- sequence number two, that's a deposit goes over to B
- B is going to then look into this data store and see if the previous event sequence number (# 1) has already been processed.
- Number one has been processed because it is inside the data store.
- Service B can successfully or at least try to process number two. 
---

<img src="exercise_files/udemy-microservices-section14-310-01-possible-solution-3-share-state-between-services-first-ensure-previous-process-sequence_3.png" alt="udemy-microservices-section14-310-01-possible-solution-3-share-state-between-services-first-ensure-previous-process-sequence_3.png" width="600"/>

- withdrawal goes over to service A
- service A checks to see that the previous sequence number has already been processed.
- number two has been processed because three minus one is two. 
- so it is in the store -> successfully withdraw the $100 right away.

---

### what if there are 2 accounts instead of one?

<img src='exercise_files/udemy-microservices-section14-310-01-possible-solution-3-waiting-for-previous-sequence-one-at-a-time.png'
alt='udemy-microservices-section14-310-01-possible-solution-3-waiting-for-previous-sequence-one-at-a-time.png'
width='600'
/>

- with this same solution, if there are two accounts instead of just one...
- account for userA -> 0 , account for userB -> 0
- sequence1 goes to serviceA , sequence2 goes to serviceB
- serviceB looks at shared store and sees sequence1 is not processed and not in the store yet, so it waits
- say sequence1 (userA) fails and times-out -> goes back to NATS for reissue
- sequence2 (userB) is waiting for sequence1 (userA) event to be processed even though sequence2 (userB) is not for same user (userA)   
---

## 2. User-Specific Sequence Numbers:
- at 4min 15sec

- `Each user/resource` has its `own sequence number`, enabling parallel event processing across users.
- tries to solve problems with solution 1 

- Pro: Eliminates dependency between unrelated users/resources, improving concurrency.
- Con: Requires separate channels for each user/resource, which incurs overhead and hits scalability limits in systems like NATS Streaming Server.

<img src="exercise_files/udemy-microservices-section14-310-02-possible-solution-4-each-user-has-its-sequence.png" alt="udemy-microservices-section14-310-02-possible-solution-4-each-user-has-its-sequence.png" width="600"/>

- going to track exactly which user each event is intended to be processed for.
- sequence #1 for User Jim -> trying to deposit $70 -> goes to service A
- sequence #1 for User Mary -> trying to deposit $40
- Jim's event processed -> stores processed sequence number in its own sequence 
  - and shared data store -> updated: $70
- mary's event processed -> stores processed sequence number in its own sequence 
  - and shared data store -> updated $40
- THEN jims 2nd sequence comes, sees sequence 1 is already processed 
  - sequence 2 is then processed -> stores processed sequence number in its own sequence
- THEN jims 3rd sequence comes, sees sequence 2 is already processed 
  - sequence 3 is then processed -> stores processed sequence number in its own sequence

--- 

<img src="exercise_files/udemy-microservices-section14-310-02-possible-solution-4-event-1-mary-does-not-hold-up-event-2-jim.png" alt="udemy-microservices-section14-310-02-possible-solution-4-event-1-mary-does-not-hold-up-event-2-jim.png" width="600"/>

### how does have separate sequence numbers for separate users (resource) help?
- showing that there is no hold-up for other user sequence
- `event 1 Jim` to service A
- `event 1 Jim `is processed 
- `event 1 Mary` to service B
- `event 2 Jim` to service A
- if there is a problem with `event 1 mary`, `event 2 Jim` can still complete

### problem with channel limits and processing overhead
- problem is that if each user (resource) gets its own sequence numbers, with NATS streaming server you would need a channel for each (ie 2 channels per resource):
  - account:deposit:jim
  - account:withdrawal:jim
  - account:deposit:mary
  - account:withdrawal:mary
- with NAT streaming server (or any event bus) there is processing overhead in adding more channels 
- and there are max limits to number of channels 

<img src="exercise_files/udemy-microservices-section14-310-02-possible-solution-4-each-user-has-its-sequence-channel-deposit-withdraw-overhead-max-limits.png" alt="udemy-microservices-section14-310-02-possible-solution-4-each-user-has-its-sequence-channel-deposit-withdraw-overhead-max-limits" width="600"/>
---

### 3. Publisher-Stored Events with Sequence Numbers:
- 9min 15sec
- solution 3 - trying to overcome users (owners) not being able to get own sequence numbers
  - the event is stored at the publisher (ie. publisher has db that tracks all events dispatched over time)
  - the publisher also tracks the sequence id of every event
  - publisher will know what `last sequences` apply for which user (NOT REALLY TRUE -> see discussion end of solution 3)
  - then when an event is dispatched in future, it will attach the previous sequence id that modified the user

- Publishers track `dispatched events` and `their sequence numbers`, allowing listeners to ensure correct order.
- Pro: Further isolates event dependencies and enforces order.
- Con: Publishers lack access to assigned sequence numbers from NATS Streaming Server, making implementation impractical.

  <img src="exercise_files/udemy-microservices-section14-310-03-possible-solution-5-hoping-NATS-returns-the-sequence-number.png"  alt="udemy-microservices-section14-310-03-possible-solution-5-hoping-NATS-returns-the-sequence-number.png" width="600"/>

  ---

  - the sequence number is only assigned AFTER gets sent from publisher to NATS streaming
  - hoping that the sequence number gets sent back to publisher

  <img src="exercise_files/udemy-microservices-section14-310-03-possible-solution-5-publisher-should-receive-sequence-number_1.png" alt="udemy-microservices-section14-310-03-possible-solution-5-publisher-should-receive-sequence-number_1.png" width="600"/>

  ---

  - then after, event goes on to account service (listener) to be processed
  - the deposit amount is stored in db -> $70
  - the `sequence number` of the event just processed is also `stored` in db (sequence #1)


  <img src="exercise_files/udemy-microservices-section14-310-03-possible-solution-5-publisher-should-receive-sequence-number_1.5.png" alt="udemy-microservices-section14-310-03-possible-solution-5-publisher-should-receive-sequence-number_1.5.png" width="600"/>

  ---

  - the publisher then moves on to `event 2: user mary`
  - dispatch the event
  - NATS assigns the sequence number (2) -> hopefully sent back to publisher
  - moves to service listener
  - processed and saved to db -> last ID processed (sequence number) saved

  <img src="exercise_files/udemy-microservices-section14-310-03-possible-solution-5-publisher-should-receive-sequence-number_2.png" alt="udemy-microservices-section14-310-03-possible-solution-5-publisher-should-receive-sequence-number_2.png" width="600"/>
  
  ---

  - next `event 3 - User Jim`
  - we know its for User Jim and last time this user processed a sequence was 1, so for event 3 we put `1 in last sequence`
  - gets passed to NATS
  - given a sequence number (3)
  - then looks at `last sequence number` that modified user jim -> (1)
  - service A looks in DB -> then makes sure the most recent last processed id was the same -> (1)

  <img src="exercise_files/udemy-microservices-section14-310-03-possible-solution-5-publisher-should-receive-sequence-number_3.png" alt="udemy-microservices-section14-310-03-possible-solution-5-publisher-should-receive-sequence-number_3.png" width="600"/>

---

  - as long as the numbers are equal to each other, the event can be processed

  <img src="exercise_files/udemy-microservices-section14-310-03-possible-solution-5-publisher-should-receive-sequence-number_4.png" alt="udemy-microservices-section14-310-03-possible-solution-5-publisher-should-receive-sequence-number_4.png" width="600"/>

---

  - then we go on to next event 
  - we know its about `user Jim` -> look at most recent event -> which has sequence number of (3)
  - so we put that for the event -> 3

<img src="exercise_files/udemy-microservices-section14-310-03-possible-solution-5-publisher-should-receive-sequence-number_5.png" alt="udemy-microservices-section14-310-03-possible-solution-5-publisher-should-receive-sequence-number_5.png" width="600"/>

---

- sent off to NATS 
- which gives it sequence number -> 4
- sent to account service (listener)
- checks last processed sequence are same (new event's `last processed sequence` AND the saved `db's last processed sequence for user` ) -> 3

<img src="exercise_files/udemy-microservices-section14-310-03-possible-solution-5-publisher-should-receive-sequence-number_6.png" alt="udemy-microservices-section14-310-03-possible-solution-5-publisher-should-receive-sequence-number_6.png" width="600"/>

---

- processes sequence 4
- saves to db -> user jim last processed updates to 4  
- balance updates

<img src="exercise_files/udemy-microservices-section14-310-03-possible-solution-5-publisher-should-receive-sequence-number_7.png" alt="udemy-microservices-section14-310-03-possible-solution-5-publisher-should-receive-sequence-number_7.png" width="600"/>

---

### different scenario

<img src="exercise_files/udemy-microservices-section14-310-03-possible-solution-5-publisher-should-receive-sequence-number_8.png" alt="udemy-microservices-section14-310-03-possible-solution-5-publisher-should-receive-sequence-number_8.png" width="600"/>

- where jim has a deposit $40
- AND simultaneously jim has a withdrawal $100
- if you accidentally try process withdrawal before the deposit
  - service B looks at event's `last sequence` -> 3
  - service B looks in DB's `last sequence`  for `user jim` -> 1
  - AND THAT IS NOT THE SAME!!!
  - service B will refuse to process the event
  - event will eventually time-out
  - sent back to NATS for retry
  - sequence 4 is waiting until sequence 3 gets processe
  - sequence 3 then gets processed (last processed sequence in db same as last sequence number on event)
  - db -> `user jim` gets updated with last processed sequence id (3)
  - (see image below)

  - then sequence 4 goes to account service (listener) etc...

<img src="exercise_files/udemy-microservices-section14-310-03-possible-solution-5-publisher-should-receive-sequence-number_9.png" alt="udemy-microservices-section14-310-03-possible-solution-5-publisher-should-receive-sequence-number_9.png" width="600"/>

---

#### why this wont work?
- it wont work because the event sequence number is not sent back from NATS to publisher
- sending events to NATS is a one-way operation 
- so NATS doesnt send anything back to the publisher 
  - it cant figure out the next events' last sequence number...

### 311. Solving Concurrency Issues
- the system is poorly designed and relying on NATS to fix it
- redesign the service
- SOLUTION -> adding the transaction number to events (by redesigning the transaction service / db stored data)

#### revisiting the blog app (earlier in course)

<img src='exercise_files/udemy-microservices-section14-311-revisiting-blog-post.png'
alt='udemy-microservices-section14-311-revisiting-blog-post.png'
width='600'
/>

- simplified diagram:

<img src='exercise_files/udemy-microservices-section14-311-revisiting-blog-post-simplified-diag.png'
alt='udemy-microservices-section14-311-revisiting-blog-post-simplified-diag.png'
width='600'
/>

- simplified with generic terminology:

<img src='exercise_files/udemy-microservices-section14-311-revisiting-blog-post-simplified-diag-generic-terminology.png'
alt='udemy-microservices-section14-311-revisiting-blog-post-simplified-diag-generic-terminology.png'
width='600'
/>
- we've been focusing on NATS and the services that listens to events coming out from NATS

<img src='exercise_files/udemy-microservices-section14-311-revisiting-blog-post-simplified-diag-relates-to-nats+service.png'
alt='udemy-microservices-section14-311-revisiting-blog-post-simplified-diag-relates-to-nats+service.png'
width='600'
/>

- but the publisher we've neglected
- what is the publisher 
  - where the events are coming from and its underlying data
- TODO: figuring out what service is responsible for these events
- for our app it would probably be a transactions/account service

#### updated diagram

<img src='exercise_files/udemy-microservices-section14-311-solving-concurrency-issues-updated-transaction-service-diagram.png'
alt='udemy-microservices-section14-311-solving-concurrency-issues-updated-transaction-service-diagram.png'
width='600'
/>

- the diagram brings the idea of transactions service
  - create transactions
  - service to record transactions
  - db to store them
  - emit transaction event (which is the publisher events)

#### visualizing how we would design this transactions service
- user logs onto banking website
- makes transactions
- event moves to transaction service
- saved in transactions db (storing user id who created transaction and will also have list of all their transactions)

<img src='exercise_files/udemy-microservices-section14-311-solving-concurrency-issues-visualizing-transactions-service.png'
alt='udemy-microservices-section14-311-solving-concurrency-issues-visualizing-transactions-service.png'
width='600'
/>
---

<img src='exercise_files/udemy-microservices-section14-311-solving-concurrency-issues-transaction-events.png'
alt='udemy-microservices-section14-311-solving-concurrency-issues-transaction-events.png'
width='600'
/>

- with the transactions saved -> emit events
- event would be an object with possibly the follwing properties:

<div style="background-color: #f3ba7b; color: black">
  eg. 
  <ul>
    <li>description of event -`transaction:created`</li>
    <li>deposit: 70</li>
    <li>id: 'ksjf'</li>
    <li>userId: 'CZQ'</li>
    <li>number: 1</li>
  </ul>
</div>

- NOTE: the number is `transaction number` for the user `determined by the database` NOT sequence number determined by NATS

- transactions for accounts service (redesigned publisher message / event(transaction))

<img src='exercise_files/udemy-microservices-section14-311-solving-concurrency-issues-better-redesigned-publisher-events.png'
alt='udemy-microservices-section14-311-solving-concurrency-issues-better-redesigned-publisher-events.png'
width='600'
/>   

- the database would have an entry for each user calculating the balance
- each user starts with `balance: 0` and no `last transaction number: -`

### normal processing flow - no problems

<img src='exercise_files/udemy-microservices-section14-311-solving-concurrency-issues-processing-event-transaction_1.png'
alt='udemy-microservices-section14-311-solving-concurrency-issues-processing-event-transaction_1.png'
width='600'
/>

---

- after processing 1st transaction...

<img src='exercise_files/udemy-microservices-section14-311-solving-concurrency-issues-processing-event-transaction_2.png'
alt='udemy-microservices-section14-311-solving-concurrency-issues-processing-event-transaction_2.png'
width='600'
/>

---
- after processing 2nd transaction...

<img src='exercise_files/udemy-microservices-section14-311-solving-concurrency-issues-processing-event-transaction_3_2nd-transaction.png'
alt='udemy-microservices-section14-311-solving-concurrency-issues-processing-event-transaction_3_2nd-transaction.png'
width='600'
/>

---
- after processing 3rd transaction...

<img src='exercise_files/udemy-microservices-section14-311-solving-concurrency-issues-processing-event-transaction_4_3nd-transaction.png'
alt='udemy-microservices-section14-311-solving-concurrency-issues-processing-event-transaction_4_3nd-transaction.png'
width='600'
/>

### handling unprocessed events  

## NEW RULE
- events now have a transaction number 
- service should only process the event if the event's `transaction number` is one more than `user in db's` last transaction number
  - ie. db user -> last transaction number should equal the event's transaction number minus 1.

- `event 1` goes to service A and service A crashes...
- if event is not acknowledged (30seconds) -> moves back to NATS for retry later
- `event 2` goes to service B

<img src='exercise_files/udemy-microservices-section14-311-solving-concurrency-issues-unprocessed-events-flow.png'
alt='udemy-microservices-section14-311-solving-concurrency-issues-unprocessed-events-flow.png'
width='600'
/>

- service tries to process transaction 2 (2-1 = 1 (look in db for last tranaction number of 1)) BUT the db doesnt have a last transaction number yet...
- this means we didnt process event 2 before event 1 (even though they are handled by different service listeners)
- when transaction 1 is ready for processing by account service it does the comparison and sees theres nothing in db, but its okay because the event is the first transaction.
- transaction is processed
- balance and last transaction number updated in db

<img src='exercise_files/udemy-microservices-section14-311-solving-concurrency-issues-processing-1.png'
alt='udemy-microservices-section14-311-solving-concurrency-issues-processing-1.png'
width='600'
/>

- transaction number 2 is reissued by NATS
- transaction 2 is processed
- balance and last transaction number is updated in db

<img src='exercise_files/udemy-microservices-section14-311-solving-concurrency-issues-processing-after-2.png'
alt='udemy-microservices-section14-311-solving-concurrency-issues-processing-after-2.png'
width='600'
/>

- transaction 3 goes to `Account service listener B` etc etc

#### concurrency issues fixed
1. where NATS thinks client is alive while its actually dead
2. one listener running quicker than another
3. listener can fail to process the event where we have to wait 30secs before re-issue
4. different users trying to access the db committing to db at same time

### 312. Concurrency Control with the Tickets App
- theory lesson

<img src='exercise_files/udemy-microservices-section14-312-concurrency-control-with-ticketing-service-using-ticket-versioning.png'
alt='udemy-microservices-section14-312-concurrency-control-with-ticketing-service-using-ticket-versioning.png'
width='600'
/>

- how the concept of "versioning" (or "last transaction number") is applied to the ticketing service in a microservices architecture. 
- The ticketing service, which handles creating and updating tickets, will maintain a version number that tracks changes to each ticket. 
- This versioning is critical because the order service, which handles ticket orders, needs to know the current price of tickets and how that price changes over time.

### how it works:

- request will come in to service that owns the resource
- save the resource
- emit event describing change
- NOTE: the Orders service is interested in the price and any price changes
- The `ticket service` is responsible for management of `ticket version` in tickets database...
- all other services will lag the ticket version in ticket database managed by ticket service

#### Ticket Creation and Versioning: 
- When a ticket is created with a price (e.g., $10), it's assigned a version number (e.g., version 1). 

<img src='exercise_files/udemy-microservices-section14-312-concurrency-with-tickets-app-01-create-ticket-event-saved.png'
alt='udemy-microservices-section14-312-concurrency-with-tickets-app-01-create-ticket-event-saved.png'
width='600'
/>

- An event is emitted to notify other services, such as the order service, about the creation.

<img src='exercise_files/udemy-microservices-section14-312-concurrency-with-tickets-app-02-emit-event.png'
alt='udemy-microservices-section14-312-concurrency-with-tickets-app-02-emit-event.png'
width='600'
/>

#### Ticket Updates: 
- Subsequent updates (e.g., changing the price from $10 to $50, and then to $100) also increment the version number. 

<img src='exercise_files/udemy-microservices-section14-312-concurrency-with-tickets-app-03-ticket-update.png'
alt='udemy-microservices-section14-312-concurrency-with-tickets-app-03-ticket-update.png'
width='600'
/>

- Each update triggers an event that is sent to other services.

<img src='exercise_files/udemy-microservices-section14-312-concurrency-with-tickets-app-03-ticket-update-version3.png'
alt='udemy-microservices-section14-312-concurrency-with-tickets-app-03-ticket-update-version3.png'
width='600'
/>

#### Event Processing: 
- Events are processed by services (like the order service) in the correct order. 
- Sometimes events may arrive out of order or fail to be processed. In such cases, the version number helps ensure that updates are applied correctly, and prevents inconsistent states.

<img src='exercise_files/udemy-microservices-section14-312-concurrency-with-tickets-app-04-ticket-created-fails-to-be-processed.png'
alt='udemy-microservices-section14-312-concurrency-with-tickets-app-04-ticket-created-fails-to-be-processed.png'
width='600'
/>

#### Handling Failures: 
- If an event fails or is processed out of order, the service checks the version number of the ticket before applying the update. 
- If the ticket version is incorrect, the update is not applied until the correct version is processed, ensuring consistency.

<img src='exercise_files/udemy-microservices-section14-312-concurrency-with-tickets-app-05-incorrect-version-order.png'
alt='udemy-microservices-section14-312-concurrency-with-tickets-app-05-incorrect-version-order.png'
width='600'
/>

- ticket v1 moves out from NATS to be processed
- ticket v1 gets processed

<img src='exercise_files/udemy-microservices-section14-312-concurrency-with-tickets-app-06-retry-v1-and-processed.png'
alt='udemy-microservices-section14-312-concurrency-with-tickets-app-06-retry-v1-and-processed.png'
width='600'
/>

- etc etc for v2 and v3

#### Versioning and MongoDB: 
- MongoDB and Mongoose can handle much of the versioning automatically, simplifying the implementation. The versioning system ensures that services always have the correct, or lagging, version of a ticket, preventing inconsistencies between services.

- while the versioning system might sound complex, it's crucial for maintaining data integrity across microservices, especially when events are delayed or processed out of order. 

- versioning always fixes every scenario UNLESS the event/message for a ticket continuously loops on retry/fail attempts to be processed.

### 313. Event Redelivery
- all events emmited to NATS Streaming is automatically saved in NATS `event history`
- event also gets send to account service (listeners) 
- a subscription can then be customized to retrieve the list of events from NATS

<img src='exercise_files/udemy-microservices-section14-313-event-redelivery-nats-event-history.png'
alt='udemy-microservices-section14-313-event-redelivery-nats-event-history.png'
width='600'
/>

- TODO: ensure there is only one listener (these options run differently with a [304. Queue Groups](#304-queue-groups))
  - remove queue-group from `nats-test/src/listeners.ts`

```ts
// section05-14-ticketing/nats-test/src/listeners.ts

//...
  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true);

  const subscription = stan.subscribe(
    'ticket:created',
    // 'orders-service-queue-group',
    options
  );
//...
```

#### events history redelivery

- in `listeners.ts` to tell nats to get some messages delivered in the past...add a subscription option
- CTRL + click on `.subscriptionOptions()`
- methods available to call to customize which events (submitted in past) get replayed (resent) while offline
  - `setStartAtSequence()`
  - `setStartTime()`
  - `setStartWithLastReceived()`
  - `setDeliverAllAvailable()`

- FIX: chain on `setDeliverAllAvailable()`
- PROS - this delivers all events/messages sent in the past
- CON - everytime starting a new listener (restarting service, scaling up) - the full event history is sent -> not feasible

```ts
// section05-14-ticketing/nats-test/src/listeners.ts

//...
  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()

  const subscription = stan.subscribe(
    'ticket:created',
    // 'orders-service-queue-group',
    options
  );
//...
```

- below is copy-and-paste from CTRL+click: `nats-test/node_modules/node-nats-streaming/index.d.ts`
```ts
//nats-test/node_modules/node-nats-streaming/index.d.ts
//...
declare interface SubscriptionOptions  {
    durableName?: string;
    maxInFlight?: number;
    ackWait?: number;
    startPosition: StartPosition;
    startSequence?: number;
    startTime?: number;
    manualAcks?: boolean;
    setMaxInFlight(n: number):SubscriptionOptions;
    setAckWait(millis: number): SubscriptionOptions;
    setStartAt(startPosition: StartPosition): SubscriptionOptions;
    setStartAtSequence(sequence: number): SubscriptionOptions;
    setStartTime(date: Date): SubscriptionOptions;
    setStartAtTimeDelta(millis: number):SubscriptionOptions;
    setStartWithLastReceived():SubscriptionOptions;
    setDeliverAllAvailable():SubscriptionOptions;
    setManualAckMode(tf: boolean): SubscriptionOptions;
    setDurableName(durableName: string): SubscriptionOptions;
}
//...
```

### 314. Durable Subscriptions
- durable subscriptions is a more effective alternative to re-delivering all past events for message processing systems.

- A subscription with a unique identifier (set using `setDurableName`) allows the system to `track which events have been processed`.
- when calling `setDurableName()` pass-in a name (string) for the subscription

```ts
// section05-14-ticketing/nats-test/src/listeners.ts

//...
  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName('accounting-service');

  const subscription = stan.subscribe(
    'ticket:created',
    // 'queue-group',
    options
  );
//...
```

<img src='exercise_files/udemy-microservices-section14-314-durable-subscription_1.png'
alt='udemy-microservices-section14-314-durable-subscription_1.png'
width='600'
/>

- creating a durable subscription -> in channel we are listening to, NATS will internally create a record listing all durable subscriptions we have.

- when we emit an event -> NATS will record whether durable subscription has received AND successfully processed the event
- as soon as service (listener) has processed event, NATS will store a record in the (durable subscription) the event processed successfully

<img src='exercise_files/udemy-microservices-section14-314-durable-subscription_2-storing-event-as-processed.png'
alt='udemy-microservices-section14-314-durable-subscription_2-storing-event-as-processed.png'
width='600'
/>

---

#### service goes offline
- if service goes down (offline)... 
- and events come in eg. `event 2` and `event 3`
- the service wont receive the event BUT.. NATS will store the event the service missed in durable subscription

<img src='exercise_files/udemy-microservices-section14-314-durable-subscription_3-storing-unprocessed-events.png'
alt='udemy-microservices-section14-314-durable-subscription_3-storing-unprocessed-events.png'
width='600'
/>

---

#### service comes back online
- when service comes back online 
- and connects with same id (durable-subscription-`ID`)
- NATS looks at what was processed and what hasnt
- unprocessed events/messages are sent to account service (listener) for processing

<img src='exercise_files/udemy-microservices-section14-314-durable-subscription_4-service-back-online-messages-processed-nats-marks-as-processed.png'
alt='udemy-microservices-section14-314-durable-subscription_4-service-back-online-messages-processed-nats-marks-as-processed.png'
width='600'
/>

- once processed
- durable subscriptions marks it as PROCCESSED 

<img src='exercise_files/udemy-microservices-section14-314-durable-subscription_5-after-processed.png'
alt='udemy-microservices-section14-314-durable-subscription_5-after-processed.png'
width='600'
/>

- Ensures no events are missed (by services), even if the service goes offline temporarily.
- Events that were missed during downtime are re-delivered when the service reconnects with the same durable name.
- AND no events are erroneously re-processed (fixing `setDeliverAllAvailable()` option when called on its own)..

#### Set Deliver All Available:
- when using `setDurableName()` you still need `setDeliverAllAvailable()`
- `setDeliverAllAvailable()` ensures that when a service connects for the first time, it receives all past events.
- Used only for the initial subscription setup. 
- On subsequent reconnects (restarts), `setDeliverAllAvailable()` is ignored and the system checks the durable name to avoid redundant re-delivery.

#### The Issue of Disconnections:
- If a client disconnects, we close our connection to NATS 
- NATS sees it is the client with the durable subscription `setDurableName`
- NATS might assume it won't reconnect and discard the durable subscription's history.

<img src='exercise_files/udemy-microservices-section14-314-durable-subscription_6-durable-subscript-history-dump.png'
alt='udemy-microservices-section14-314-durable-subscription_6-durable-subscript-history-dump.png'
width='600'
/>

- This can be mitigated by using `queue groups`.

#### Queue Groups:
- fixing NATS discarding durable subscription history...

- Adding a queue group (setQueueGroup) ensures the durable subscription's state is preserved even during brief disconnections.
- queue group -> `Prevents the system from dumping the durable subscription's history` and allows multiple instances of a service to process events efficiently without redundancy.

```ts
// section05-14-ticketing/nats-test/src/listeners.ts

//...
  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable() 
    .setDurableName('accounting-service');

  const subscription = stan.subscribe(
    'ticket:created',
    'queue-group-name'  //set queue group name
    options
  );
//...
```

#### Combining Options:

- `SetDeliverAllAvailable` ensures delivery of all past events during the first connection.
- `SetDurableName` tracks processed events for a subscription.
- `Queue Groups` prevent the loss of durable subscription state (prevent durableName history dump) during disconnections and coordinate event delivery across multiple service instances.
- These three options are tightly coupled and essential for achieving reliable and efficient event processing in systems where services might go offline or scale dynamically.

---

## section 15 - connecting to NATS in a nodejs world (1hr22min)
### 315. Reusable NATS Listeners

<img src='exercise_files/udemy-microservices-section16-315-reusable-nats-listener.png'
alt='udemy-microservices-section16-315-reusable-nats-listener.png'
width='600'
/>

- extracting code to make reusable listeners (pub/receive messages)
- move to common module library
- TODO: create a class called `Listener`
- `Listener` -> `abstract` class 

- properties:
  - (abstract) `subject` -> string -> channel to listen to 
  - (abstract) `onMessage()` -> function -> run when a message is received
  - `client` -> Stan -> pre-initialized NATS client
  - (abstract) `queueGroupName` -> string -> name of the queue group this listener will join
  - `ackWait` -> number -> number of seconds this listener has to ack a messsage (default 30seconds)
  - `subscriptionOptions` -> SubscriptionOptions -> subscription options
  - `listen` -> function -> code to set up the subscription
  - `parseMessage` -> function -> helper to parse a message

<img src='exercise_files/udemy-microservices-section16-315-reusable-nats-listener-abstract-subclasses.png'
alt='udemy-microservices-section16-315-reusable-nats-listener-abstract-subclasses.png'
width='600'
/>

- will create subclasses of Listener 
  - `orderUpdatedListener` 
  - `ticketCreatedListener`  
  - listens for a particular event
  - customize `subject`
  - customize `onMessage`

### 316. Listener abstract class
- TODO: implement class `Listener`
- `nats-test/src/listener.ts`

### listener class

- the `client is a pre-initialized NATS client` (Stan) -> ready-to-use.
- passed into the `Listener constructor` to ensure it is already connected.

### subscription options

- subscription options - defined using a helper method, which configures settings like: 
  - `setDeliverAllAvailable()` - delivering all available messages, 
  - `setManualAckMode(true)` - enabling manual acknowledgement, 
  - `setDurableName(this.queueGroupName)` - and setting the durableName to the groupName.

- NOTE: `queueGroupName` and `durableName` are usually the same

### listen method

- subscribes to a subject and group, then `listens for incoming messages`.
- Upon receiving a message -> it is logged and parsed. 
  - if the data is a `string`, its parsed as JSON. 
  - if it’s a `buffer`, it's converted to a string and then parsed.
- the parsed data (parseMessage(msg:Message)) is passed to the `onMessage()` method (which is abstract and must be implemented in subclasses).

```ts
// nats-test/src/listener.ts
import nats, {Message, Stan} from 'node-nats-streaming';
import {randomBytes} from 'crypto';

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url:'http://localhost:4222'
  });

//...
abstract class Listener{
  abstract subject: string;
  abstract queueGroupName: string;
  abstract onMessage: (data:any, msg: Message) => void;

  protected ackWait = 5 * 1000;

  constructor(private client: Stan) {
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    })
  }

  parseMessage(msg:Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data) 
      : JSON.parse(data.toString('utf8'))
  }
}

```

### 317. Extending the Listener

- TODO: making a listener: `TicketCreatedListener` by extending abstract Listener class
- `nats-test/src/publisher.ts` is `publishing events` on channel `ticket:created`
- `nats-test/src/listener.ts` is listening for `ticket:created`

#### using TicketCreatedListener
- usage: `new TicketCreatedListener(stan).listen();`

```ts
//nats-test/src/listener.ts/
//...
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url:'http://localhost:4222'
});

//...
stan.on('connect', () => {
  console.log('Listener connected to NATS');
  
  stan.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

//...
abstract class Listener{
  //...
}
//...

class TicketCreatedListener extends Listener{
  subject = 'ticket:created';
  queueGroupName = 'payments-service';

  onMessage(data: any, msg: Message) {
    console.log('event data:', data);
    msg.ack();
  }
}

//...

```

### 318. Quick Refactor
- The Listener class will be defined in common/ module (repo)
- the services will import this Listener 
- each service will then define a subclass of Listener and have its own custom logic

<img src='exercise_files/udemy-microservices-section16-318-quick-refactor-listeners-defined-in-services.png'
alt='udemy-microservices-section16-318-quick-refactor-listeners-defined-in-services.png'
width='600'
/>

#### Refactor
- the abstact base listener is moved to: `nats-test/src/events/base-listener.ts`
- the TicketCreatedListener is also moved to its own file: `nats-test/src/events/ticket-created-listner.ts`

#### usage
- import `TicketCreatedListener` and create an instance

```ts
//nats-test/src/listener.ts
import { TicketCreatedListener } from './events/ticket-created-listener';

//...

stan.on('connect', () => {
  //...
  new TicketCreatedListener(stan).listen();
});
```

### 319. Leveraging TypeScript for Listener Validation
- the first app: difficult to remember:
  - remembering properties of events
  - remembering names of the events / spelling errors
 
<img src='exercise_files/udemy-microservices-section16-319-mapping-between-subject-names-and-event-data.png'
alt='udemy-microservices-section16-319-mapping-between-subject-names-and-event-data.png'
width='600'
/>

<img src='exercise_files/udemy-microservices-section16-319-mapping-subject-data-relationship.png'
alt='udemy-microservices-section16-319-mapping-subject-data-relationship.png'
width='600'
/>

- mismatched data should result in an error

### 320. Subjects Enum

#### creating a file to store enums
- use enum to store all possible `subjects`
- usage: `Subjects.TicketCreated`
- `nats-test/src/events/subjects.ts`

```ts
//nats-test/src/events/subjects.ts
export enum Subjects{
  TicketCreated = 'ticket:created',
  OrderUpdated = 'order:updated'
}
```

### 321. Custom Event Interface
- Custom Event Interface -> an interface to describe the coupling of a `subject` and its associated `event data` 
- TODO: create a new file `nats-test/src/events/ticket-created-event.ts`
- we set up tight-coupling between the subject and its data.

<img src='exercise_files/udemy-microservices-section16-319-mapping-subject-data-relationship.png'
alt='udemy-microservices-section16-319-mapping-subject-data-relationship.png'
width='600'
/>

```ts
//nats-test/src/events/ticket-created-event.ts

import { Subjects } from "./subjects"; //import enum

export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}
```

### 322. Enforcing Listener Subjects

- typscript needs to check that the `subject` matches up with type of data provided to `onMessage(data)` 

<img src='exercise_files/udemy-microservices-section16-322-enforcing-listener-subjects.png'
alt='udemy-microservices-section16-322-enforcing-listener-subjects.png'
width='600'
/>

- in `src/events/base-listener.ts` 
- create an interface -> this interface describes a generic event 
- it will have a property `subject` and its value must be one of the values of `Subjects` Enum
```ts
//src/events/base-listener.ts
import { Subjects } from './subjects';

interface Event{
  subject: Subjects;
  data: any;
}

//...
```

#### Generic type
- setup Listener as a generic class
- this syntax says whenever we extend Listener, we have to provide a custom type `Listener<T extends Event>`
- this is like an argument for types (reference it in function via T)
- `T extends Event` -> just ensures that whatever is passed in as T -> should abide by Events' interface
- and `subject` should be equal to whatever is T's `subject`
- and `data` should be equal to whatever is T's `data`

```ts
export abstract class Listener<T extends Event> {
  abstract subject: T['subject'];
  abstract onMessage(data: T['data'], msg: Message):void;
  //...
}
```

#### using Listener
- /`nats-test/src/events/ticket-created-listener.ts`
- when using Listener (generic class) -> need to provide an argument for type T
- provide Listener with a type (... eg. TicketCreatedEvent) - that describes the event we expect to receive inside this listener

<img src='exercise_files/udemy-microservices-section16-319-generic-listener-class-warning.png'
alt='udemy-microservices-section16-319-generic-listener-class-warning.png'
width='600'
/>

- TODO: `import {TicketCreatedEvent} from './ticket-created-event';`
- provide this as the generic type to Listener: `... extends Listener<TicketCreatedEvent>`
- typescript warns that subject is a string BUT the Listener class has type passed in to generic `abstract subject: T['subject'];`
  - and when you look at what T is... we pass T as `TicketCreatedEvents`
  - so subject needs to be of type whatever is defined in `TicketCreatedEvents` subject type

#### this part is updated to be 'readonly' in lesson 323
- provide the type annotation to `subject` as `Subjects.TicketCreated` so that subjects type can never be set to anything else (will always only be type: `Subjects.TicketCreated`) later on in code... 
- if it was `subject = Subjects.TicketCreated;` -> subject can be anything else inside `Subjects

- NOTE: defining subject as `readonly` ensures it doesnt get updated.. 

```ts
//nats-test/src/events/ticket-created-listener.ts

import { Message } from "node-nats-streaming";

import { Listener } from "./base-listener";
import { Subjects } from "./subjects";
import {TicketCreatedEvent} from './ticket-created-event';

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
  // subject = 'ticket:created'; 
  // subject: Subjects.TicketCreated = Subjects.TicketCreated;
  readonly subject = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(data: any, msg: Message) {
    console.log('event data:', data);
    msg.ack();
  }
}
```

### 323. Quick Note: 'readonly' in Typescript
- make 'subject' `readonly`

```ts
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
 
  // ...everything else
}
```

### 324. Enforcing Data Types
-`onMessage(data:any)` need to update the type -> it should reference the data type of the T's (TicketCreatedEvent) data type
- FIX: `onMessage(data':TicketCreatedEvent['data'])`
- nats-test/src/events/ticket-created-event.ts

```ts
//nats-test/src/events/ticket-created-event.ts
import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
  readonly subject = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    msg.ack();
  }

}
```

### 325. Where Does this Get Used?
- understanding what code goes into Common module (when refactoring)

<img src='exercise_files/udemy-microservices-section16-325-what-goes-into-common-module.png'
alt='udemy-microservices-section16-325-what-goes-into-common-module.png'
width='600'
/>

- eventually, the code will be merged into a common module. 

#### common module

- subjects: a central list of all possible event channels for emitting events in the streaming server.
- base Listener class: A foundational listener class.
- event interfaces: definitions of all possible events and their data structures.

- these shared components ensure consistency across services by standardizing event subjects, structures, and logic.

#### service modules (e.g., Ticket Service, Payment Service):

- import definitions from the common module (e.g., subjects, listeners, event interfaces).
- define custom listeners specific to the service’s business logic (e.g., handling `ticketCreated` events with custom logic in `onMessage`).

### 326. Custom Publisher
- refactoring to create `base-publisher.ts` (similar to base-listener.ts)
- TODO: the whole point of doing all this is to get Typescript to check our code:
  - that when we emit data, it has the correct properties
  - checking that when publishing data, we provide the correct subject name
- NOTE: in lesson 327. we correct - data should be passed as JSON
- nats-test/src/events/base-publisher.ts

```ts
//nats-test/src/events/base-publisher.ts

import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event{
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  constructor(private client: Stan) { }

  publish(data: T['data']) {
    this.client.publish(this.subject, JSON.stringify(data), () => { 
      console.log('event published');
    })
  }
}
```

#### custom publisher class
- nats-test/src/events/ticket-created-publisher.ts

```ts
//nats-test/src/events/ticket-created-publisher.ts
import { Publisher } from './base-publisher';
import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './subjects';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
```

### 327. Using the Custom Publisher
- FIX: firstly fix this -> data should be passed as JSON (src/events/base-publisher.ts)

- using `TicketCreatedPublisher`

- we receive warning when using TicketCreatedPublisher 
<img src='exercise_files/udemy-microservices-section16-327-using-the-custom-publisher-TicketCreatedPublisher.png'
alt='udemy-microservices-section16-327-using-the-custom-publisher-TicketCreatedPublisher.png'
width='600'
/>

- nats-test/src/publisher.ts

```ts
//...
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

//...
stan.on('connect', () => {
  console.log('publisher connected to NATS');

  //BEFORE
  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'concert',
  //   price: 20,
  // });
  // stan.publish('ticket:created', data, () => {
  //   console.log('event published')
  // });

  //UPDATE
  const publisher = new TicketCreatedPublisher(stan);
  publisher.publish({
    id: '123',
    title: 'concert',
    price: 20
  });

});

//...

```
### 328. Awaiting Event Publication
- publishing to NATS is an async operation 
- TODO: be able to use it as `async` with async/await 
- ensure that the `base-publisher.ts` class `returns a promise` from `publish()`

- UPDATE: src/events/base-publisher.ts
```ts
//base-publisher.ts
import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event{
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  constructor(private client: Stan) { }

  publish(data: T['data']): Promise<void> {

    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, data, (err) => {
        if (err) {
          return reject(err);
        }
        console.log('event published to subject: ', this.subject);
        resolve();
      });

    });
    
  }
}
```
- UPDATED: nats-test/src/publisher.ts
```ts
import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
});

stan.on('connect', async () => {
  console.log('publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 20
    });
  }
  catch (err) {
    console.error(err);
  }
});
```

### 329. Common Event Definitions Summary
#### testing...
  - Publishers -> making requests (axios) -> not a lot to test
  - Listeners -> similar to request handlers -> lots to test

#### architecture
- the common module is where we define list of event names (Subjects)
- the common module is where we define the different events 
- CONS -> the common module is written in typescript -> only works if all our services are written with Typescript
  - ie. if there are multi-languages services

<img src='exercise_files/udemy-microservices-section16-329-common-event-definitions-summary.png'
alt='udemy-microservices-section16-329-common-event-definitions-summary.png'
width='600'
/>

#### cross-language support
- alternatives with cross language support 
  - JSON schema
  - protobuf
  - apache avro

### 330. Updating the Common Module
- TODO: update the common library by extracting code from nats-test
- TODO: rebuild + publish -> common/ project
- TODO: update nats-test tickets project to use the common module inside there...

#### nats-test
- from nats-test/src/events/ move these files to common module under `events/`
  - section05-15-ticketing/nats-test/src/events/base-listener.ts 
  - section05-15-ticketing/nats-test/src/events/base-publisher.ts 
  - section05-15-ticketing/nats-test/src/events/subjects.ts 
  - section05-15-ticketing/nats-test/src/events/ticket-created-event.ts

#### common module ([repo](https://github.com/clarklindev/microservices-stephengrider-with-node-and-react-common.git))
- create events/
- TODO: update subjects.ts

```ts
export enum Subjects{
  TicketCreated = 'ticket:created',
  TicketUpdated = 'ticket:updated',
}
```
- create src/events/ticket-updated-event.ts
```ts
//src/events/ticket-updated-event.ts
import { Subjects } from './subjects';
export interface TicketUdpatedEvent {
  subject: Subjects.TicketUpdated,
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  }
}
```
- src/index.ts -> update by exporting all event files in events/ 

```ts
//...

export * from './events/base-listener';
export * from './events/base-publisher';
export * from './events/subjects';
export * from './events/ticket-created-event';
export * from './events/ticket-updated-event';
```
#### publishing common library
- common/ library
- install `node-nats-streaming` - `pnpm i node-nats-streaming`
- re-publish: `pnpm run pub` 
  - commit
  - build
  - version
  - delete build
  - publish

#### tickets service
- section05-15-ticketing/tickets/
- pnpm update @clarklindev/common

### 331. Restarting NATS to clear NATS history
- restarting nats pod -> will result in a all events that have been emitted to be dumped
- ticketing/

```cmd
kubectl delete pod nats-depl-958fb4786-p8d9m
```

---



## section 16 - managing a NATS client (1hr37min)
- the common library has updated and has the events and listeners and common library's `index.ts` exports them
- tickets service now uses this updated common library -> has access to these updates (events + listeners)

## Tickets/
### 332. Publishing Ticket Creation
- route `tickets/src/routes/new.ts` 
- TODO: when someone issues a new ticket
  1. - ticket is created
  2. - saved to database
  3. - publish an event to notify all other services in app a ticket was just created

- tickets/src/events/publishers
- tickets/src/events/listeners
- TODO: ticket service -> create a new custom publisher -> `ticket-created-publisher.ts`
- `tickets/src/events/publishers/ticket-created-publisher.ts`
- usage: new TicketCreatedPublisher(client).publish(ticket);

```ts
//tickets/src/events/publishers/ticket-created-publisher.ts
import { Publisher, Subjects, TicketCreatedEvent } from '@clarklindev/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
  readonly subject = Subjects.TicketCreated;
}
```

### 333. More on Publishing
- publish an event to notify all other services in app a ticket was just created
- NOTE: you should pull data off the saved ticket
- not whats passed through req.body... because the with pre- and post-save hooks the data can be modified so its better to use the same data as what was saved to db.

#### usage of TicketCreatedPublisher
```ts
//src/routes/new.ts
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';

//...
const router = express.Router();

router.post('/api/tickets', 
  requireAuth,
  [
    body('title')
      .not()
      .isEmpty()
      .withMessage('Title is required'),
    
    body('price')
      .isFloat({ gt: 0})
      .withMessage('Price must be greater than 0')
  ],
  validateRequest,

  async (req: Request, res: Response) => { 
    const { title, price } = req.body;
    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id
    });
  
    await ticket.save();

    await new TicketCreatedPublisher(client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId
    })
  }
);

```
### 334. NATS Client Singleton
- after successfully set up a publisher (TicketCreatedPublisher(client)) needs a nats client instance to handle publishing.
- index.ts already has startup logic
- just like mongodb (which maintains internal connection management)
  - mongoose -> mongoose internally keeps a record of all connections -> does NOT return the client (when you use it, it is a copy of mongoose directly connected to server)
- the NATS client is required to successfully publish messages
  - the Nats client works differently—it returns a connection object upon calling Nats.connect()
  - This means `the client must be manually shared across different parts of the application`, unlike Mongoose's behavior.
  - The issue arises because the dependencies between files could create circular imports. 
  - Specifically, importing the Nats client from index into route handlers (and vice versa) risks cyclical dependencies
- The solution is to create a new singleton-like file called nats-client

#### Nats client

1. Manage the creation and initialization of the Nats client.
2. Act as a singleton to provide consistent client access across different modules without the risk of circular imports.
3. Handle connection logic and ensure graceful shutdowns if the connection is lost or the app shuts down.

- create client -> `nats-client.ts` 
- By isolating the client initialization in this new file, index will import it for startup logic, while route handlers can import this pre-initialized client as needed—avoiding cyclical imports.

<img src='exercise_files/udemy-microservices-section16-334-singleton-nats-client.png'
alt='udemy-microservices-section16-334-singleton-nats-client.png'
width='600'
/> 

### 335. Node Nats Streaming Installation
- folder: `/section05-15-ticketing/tickets/`

```ts
pnpm i node-nats-streaming
```

### 336. Remember Mongoose?

- mongoose design

<img src='exercise_files/udemy-microservices-section16-334-mongoose-design.png'
alt='udemy-microservices-section16-334-mongoose-design.png'
width='600'
/>

- NATS equivalent design
- NatsWrapper's goal is to initialize a client from NATS/stan library
- instead of exporting class, we create an instance of `NatsWrapper` and export single instance
- the file will be called `nats-wrapper.ts` for consistency (instead of nats-client.ts)
- the instance can be shared to other files

<img src='exercise_files/udemy-microservices-section16-334-nats-design.png'
alt='udemy-microservices-section16-334-nats-design.png'
width='600'
/>

```ts
//tickets/src/nats-wrapper.ts
import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper{
  //create a new client
  //assign to a property of class

}

export const natsWrapper = new NatsWrapper();
```

### 337. TS Error - Did you forget to include 'void' in your type argument
- we will be returning a promise in our natsWrapper class.
- for lesson 338...

- ERROR
```cmd
Expected 1 arguments, but got 0. Did you forget to include 'void' in your type argument to 'Promise'?
```
- FIX:
```ts
// src/nats-wrapper.ts
return new Promise<void>((resolve, reject) => {
  this._client!.on('connect', () => {
    console.log('Connected to NATS');
    resolve();
  });
}
```

### 338. Singleton Implementation
- tickets/src/nats-wrapper.ts
- TODO: create a nats client inside nats-wrapper.ts
- creating the client will happen in `connect()` so creation can be deffered
- making a callback a `promise` to allow us to use async/await 
- by wrapping our callback with a promise then calling resolve from within callback
- note typescript warns of this._client pottentially being undefined, because we are calling this._client from within a callback function and could have unassigned the._client 
- FIX: add !

```ts
//tickets/src/nats-wrapper.ts
import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper{
  private _client?: Stan;

  connect(clusterId:string, clientId:string, url:string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this._client!.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });

      this._client!.on('error', (err) => {
        reject(err);
      });

    });
    
  }

}

export const natsWrapper = new NatsWrapper();
```
### using natsWrapper
- note the lowercase 'n' , means this is an instance that is shared between our different files
- connect() 
  - 1st argument -> value of `cluster id` connecting to (infra/k8s/nats-dep.yaml - > args -> -cid -> `ticketing`)
  - 2nd argument is client id (random string)
  - 3rd argumment -> service governing nats deployment (infra/k8s/nats-depl.yaml -> service section -> metadata -> name -> `nats-srv`)
- TEST: skaffold dev

```ts
//tickets/src/index.ts
import { natsWrapper } from './nats-wrapper';

///...
try{
  await natsWrapper.connect('ticketing', 'laskjf', 'http://nats-srv:4222');

  //...
  await mongoose.connect(
    //...
  );
}
catch(err){
  console.error(err);
}
```

#### implementation of a Nats (NATS messaging system) client wrapper class 
- implementation of a Nats client wrapper class with a focus on connecting to the NATS server using async/await syntax. 

#### Class Property for Client:
- A private property `_client` is added to represent the NATS client. 
- It's marked optional (_client?) because it's not immediately initialized during the class's construction.

#### Connection Logic:
- A `connect()` function is defined to establish a connection with the NATS server.
- This method accepts `cluster ID`, `client ID`, and `URL` as arguments.
- The `connection` is established using NatsWrapper's instance `.connect({ cluster ID, client ID, URL })`.
- The connection handling uses Promises to allow async/await syntax instead of relying on traditional callback handling.
- Error handling is implemented using the on('error') event, rejecting the promise on failure.

#### Error Handling:
- Errors are caught and rejected during the connection attempt.

#### Testing the Connection:
- The connect method is invoked from an index file with required connection settings (`ticketing`, `a random client ID`, and the `NATS server` URL http://nats-crv:4222).
- After starting the application, a successful connection logs "Connected to NATS" in the console.

#### Cluster ID and Connection Details:
- The cluster ID (ticketing) comes from the deployment configuration in Kubernetes.
- The client ID should be random to avoid conflicts.
- The URL points to the service nats-crv:4222, which is defined in the deployment.

### 339. Accessing the NATS Client
- TODO: using client from `natsWrapper` inside 'new' route -> `tickets/src/routes/new.ts`
- NOTE: it is marked as private
  - exposing _client to outside but should throw error if still undefined
  - FIX: add a getter `get client()`
  - FIX: updated get client() so src/nats-wrapper.ts `connect()` can access client via `this.client` instead of `this._client!`

```ts
//src/nats-wrapper.ts

get client() {
  if (!this._client) {
    throw new Error('Cannot access NATS client before connecting');
  } 
  return this._client;
}

connect(clusterId:string, clientId:string, url:string) {
  this._client = nats.connect(clusterId, clientId, { url });

  return new Promise<void>((resolve, reject) => {
    this.client.on('connect', () => {
      console.log('Connected to NATS');
      resolve();
    });

    this.client.on('error', (err) => {
      reject(err);
    });

  });
  
}

```
  
- USAGE: access .client via `natsWrapper`

```ts
//tickets/src/routes/new.ts
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

router.post('/api/tickets',
  requireAuth,
  [
    body('title')
      .not()
      .isEmpty()
      .withMessage('Title is required'),
    
    body('price')
      .isFloat({ gt: 0})
      .withMessage('Price must be greater than 0')
  ],
  validateRequest,

  async (req: Request, res: Response) => { 
    //...
    await ticket.save();

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId
    });

    res.status(201).send(ticket);

  }
);



```

### 340. Graceful Shutdown
- similar to to handling shutdown in `nats-test/src/listener.ts`

#### move logic into index.ts
- less ideal implementation that embeds shutdown logic directly into a method, which could lead to bad design. 
- Specifically, having hidden methods arbitrarily exit the program isn't advisable, as it could create problems when shared across services.
- attempt graceful exit by moving shutdown logic to index.ts for better control, centralizing the exit handling.
- This prevents unexpected program exits from being triggered in unintended places.

#### TESTING graceful shutdown
- restart skaffold
- simulating Nats connection loss and ensuring graceful shutdown

#### deleting the pod
- deleting the Nats pod : `section05-15-ticketing/`
```
kubectl get pods
kubectl delete pod ...

```
#### container restarts
- triggering a close event, and observing that the container restarts (due to the process exiting and Kubernetes’ auto-recovery). This confirms the shutdown logic works as expected.


```
kubectl get pods
```

<img src='exercise_files/udemy-microservices-section16-340-restarts-tickets-depl-when-losing-connect-to-nats.png'
alt='udemy-microservices-section16-340-restarts-tickets-depl-when-losing-connect-to-nats.png'
width='600'
/>


```ts
//tickets/src/index.ts
//...
    await natsWrapper.connect('ticketing', 'laskjf', 'http://nats-srv:4222');

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

//...
```

### 341. Successful Listen!
- checking if new ticket route handler (tickets/routes/new.ts) that events are being published event publisher (TicketCreatedPublisher) successfully publishes an event.
- in `nats-test/src/listener.ts` 
  - we are importing `TicketCreatedListener` from './events/ticket-created-listener';
  - `TicketCreatedListener` listening to events of type `Subjects.TicketCreated`


```ts
//nats-test/src/events/ticket-created-listener.ts

import { Message } from "node-nats-streaming";
import { Listener, TicketCreatedEvent, Subjects} from "@clarklindev/common";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
  readonly subject = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('event data:', data);

    console.log(data.id);
    console.log(data.title);
    console.log(data.price);

    msg.ack();
  }

}
```

#### TEST

## TERMINAL WINDOW 1
- skaffold dev

## TERMINAL WINDOW 2
### update nats-test dependencies
- update the nats-test/package.json so it uses @clarklindev/common
  - pnpm update @clarklindev/common

### create port forwarding
- nats-test/ -
  - `kubectl get pods`

<img src='exercise_files/udemy-microservices-section16-341-create-port-forward.png'
alt='udemy-microservices-section16-341-create-port-forward.png'
width='600'
/>

  - `kubectl port-forward [podname] [port-local]:[port-to-access]`
    - eg. kubectl port-forward nats-depl-79cd79cc87-cjxh8 4222:4222

<img src='exercise_files/udemy-microservices-section16-341-nats-test-listener.png'
alt='udemy-microservices-section16-341-nats-test-listener.png'
width='600'
/>

  - see [298. Port-Forwarding with Kubectl](#298-port-forwarding-with-kubectl)
    - this will cause cluster to behave as if it has a nodePort service running inside of it 
    - will expose the pod (port) to outside world
    - allows to connect from local machine

## TERMINAL WINDOW 3
### run nats-test -> listen
- new terminal window
- nats-test/ directory
- `pnpm run listen`
- OUTCOME: 

```cmd
Listener connected to NATS
```

## POSTMAN
### postman create ticket
- create a ticket from POSTMAN
- NOTE: you need to be authenticated to create a ticket
- GET -> https://ticketing.dev/api/users/currentuser

#### sign in if not authenticated
- POST -> https://ticketing.dev/api/users/signin 
- POST -> https://ticketing.dev/api/users/signup

  - headers -> Content-Type - application/json
  - body -> RAW -> JSON
  {
      "email":"test@test.com",
      "password":"password"
  }

### verify the listener receives the event
- verify that the nats-test `ticket-created-listener`

### create a ticket
- POST -> https://ticketing.dev/api/tickets/
- body -> raw -> JSON ->

```json
{
  "title": "NEW CONCERT",
  "price": 50
}
```
### sucess

- post man successfully created ticket

<img src='exercise_files/udemy-microservices-section16-341-create-ticket-success.png'
alt='udemy-microservices-section16-341-create-ticket-success.png'
width='600'
/>

---

- skaffold message: successfully published

<img src='exercise_files/udemy-microservices-section16-341-skaffold-success-publish.png'
alt='udemy-microservices-section16-341-skaffold-success-publish.png'
width='600'
/>

---

- nats-test listener

<img src='exercise_files/udemy-microservices-section16-341-nats-test-message-received.png'
alt='udemy-microservices-section16-341-nats-test-message-received.png'
width='600'
/>

#### troubleshoot
- was complaining about userId not in `TicketCreatedEvent` even though i published common/ repo
- FIX: delete nats-test/node_modules and re-install dependencies: `pnpm i`

---

### 342. Ticket Update Publishing
- `tickets/src/events/publishers/ticket-updated-publisher.ts`
- publishes that a ticket was updated

```ts
//tickets/src/events/publishers/ticket-updated-publisher.ts
import { Publisher, Subjects, TicketUpdatedEvent } from '@clarklindev/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
  readonly subject = Subjects.TicketUpdated;
}
```

- tickets/src/routes/update.ts
- UPDATES..
```ts
//...
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';
//...

router.put('/api/tickets/:id',
//...
await ticket.save();  //ticket is now updated

new TicketUpdatedPublisher(natsWrapper.client).publish({
  id: ticket.id,
  title: ticket.title,
  price: ticket.price,
  userId: ticket.userId
});

//...

);
```
#### Postman
- ensure loggedin - check with GET https://ticketing.dev/api/users/currentuser
- Postman PUT https://ticketing.dev/api/tickets/
- use ticket id from creating a ticket (eg. 675dad175b8e62713cb7ac9c)

- POSTMAN -> PUT https://ticketing.dev/api/tickets/675dad175b8e62713cb7ac9c
  - update eg. price -> 10

- TEST -> scaffold terminal -> should see: `[tickets] event published to subject:  ticket:updated`

#### Tests
- if you try run tests, wont work because tests dont have connection to NATS
 
### 343. Failed Event Publishing

#### no await
- tickets/src/routes/update.ts -> update ticket event, there is no `await` keyword
  - `new TicketUpdatedPublisher(natsWrapper.client).publish({})`
- if there is no await -> and a response is sent immediately after publishing to nats... 
- if an error occurs when publishing event to NATS... you already sent a response...

<img src='exercise_files/udemy-microservices-section16-343-failed-event-publishing-no-await.png'
alt='udemy-microservices-section16-343-failed-event-publishing-no-await.png'
width='600'
/>

#### with await
- tickets/src/routes/new.ts for creating -> creating ticket event, this IS an `await` keyword
  - `await new TicketCreatedPublisher(natsWrapper.client).publish({})`
- if anything goes wrong -> and because we have `await` -> if anything goes wrong -> throwing error will be caught by error handling middleware.

<img src='exercise_files/udemy-microservices-section16-343-failed-event-publishing-with-await.png'
alt='udemy-microservices-section16-343-failed-event-publishing-with-await.png'
width='600'
/>

### Data-integrity issue
- user makes a transaction to deposit money
- the transaction gets saved to Transactions database (+ $70)
- in normal circumstances, event is emitted and accounts database is updated..

<img src='exercise_files/udemy-microservices-section16-343-failed-emit-event.png'
alt='udemy-microservices-section16-343-failed-emit-event.png'
width='600'
/>

- if the emit event fails and never gets communicated with accounts database ($ 0), there is data integrity issue (transactions db and accounts db will show different balance)

<img src='exercise_files/udemy-microservices-section16-343-failed-emit-event_2.png'
alt='udemy-microservices-section16-343-failed-emit-event_2.png'
width='600'
/>

### 344. Handling Publish Failures
- FIX -> fixing lesson 343 design...

#### using an events collection db and a saved flag
- instead of saving transtion to db and then emitting an event, the event is stored in an `events collection db`
- then with the event, we record whether the event has been published (sent) 
  - initially when saved to database -> `sent` will be: `NO`

  <img src='exercise_files/udemy-microservices-section16-344-using-events-collection-with-sent-flag.png'
  alt='udemy-microservices-section16-344-using-events-collection-with-sent-flag.png'
  width='600'
  />

- have separate code to watch events collection - that notes when an event is saved to `events collection db` 
  - it will extract this event
  - publish it off to NATS

  <img src='exercise_files/udemy-microservices-section16-344-watch-for-saved-event-and-publish-to-nats.png'
  alt='udemy-microservices-section16-344-watch-for-saved-event-and-publish-to-nats.png'
  width='600'
  />

  - once sucessfully published -> the `sent` flag can update to `YES`

  <img src='exercise_files/udemy-microservices-section16-344-after-nats-publish-flag-set-to-yes.png'
  alt='udemy-microservices-section16-344-after-nats-publish-flag-set-to-yes.png'
  width='600'
  />

#### rollback when failed saving to db 
- if inserting to any db fails, ALL inserts should be reverted (rollback)
- most db's have this feature implemented (called a `transaction`)
- database transaction is a 'set of changes' and if any of the changes fail, do not make any of the changes
- TODO: wrapping events in a database transaction ensuring: 
  - a record is saved to transactions collection
  - AND the event is recorded in events collection 

- NOTE: this idea of 'transactions' is NOT part of the course - adds complexity (but it should be considered for reallife production env) 

### 345. Fixing a Few Tests

#### failed tests
- The test suite for the ticketing service is failing, primarily due to issues with the NATS client not being initialized. 
- This problem arose after adding event publishing functionality. 
- In development, the NATS client is initialized within a NATS wrapper Singleton, allowing publishers to access it. 

<img src='exercise_files/udemy-microservices-section16-345-development-environment-natswrapper.png'
alt='udemy-microservices-section16-345-development-environment-natswrapper.png'
width='600'
/>

- in the test environment, the client isn't initialized, causing errors such as "Cannot access NATS client before connecting."

<img src='exercise_files/udemy-microservices-section16-345-failed-test-environment-due-to-uninitialized-client.png'
alt='udemy-microservices-section16-345-failed-test-environment-due-to-uninitialized-client.png'
width='600'
/>

### resolve failed tests
- two approaches are considered:

#### Connecting to a real NATS server during tests: 
- This is not ideal, as it would require a running NATS server locally or via another mechanism, complicating the test environment.

#### implement the Jest mocking approach:
- Jest can intercept import statements in the test environment and redirect them to a fake NATS wrapper. 
- This fake wrapper will include a "fake" initialized NATS client, tricking the application into thinking the client is real without actually connecting to a NATS server.
- preffered method -> avoids dependency on a real NATS server while simplifying test execution. 

<img src='exercise_files/udemy-microservices-section16-345-jest-intercept-import-statements.png'
alt='udemy-microservices-section16-345-jest-intercept-import-statements.png'
width='600'
/>

### 346. Redirecting Imports

<img src='exercise_files/udemy-microservices-section16-346-moking-with-jest-process.png'
alt='udemy-microservices-section16-346-moking-with-jest-process.png'
width='600'
/>

- the file we want to fake is `tickets/src/nats-wrapper.ts`
- create `__mocks__` folder: `tickets/src/__mocks__`
- create an identical file inside `__mocks__`:  `tickets/src/__mocks__/nats-wrapper.ts`
  - this file will fake the functionality of real nats-wrapper: `tickets/src/nats-wrapper.ts`
  - the real nats-wrapper.ts file exports `natsWrapper` (essentially an object) a single instance of class `NatsWrapper`

```ts
//tickets/src/__mocks__/nats-wrapper.ts
export const natsWrapper = {
}
```

- the other tests that are referencing nats should use the `mock nats-wrapper`
- in the files that you want to use the mock files, tell jest what file (`tickets/src/nats-wrapper.ts`) you want to mock:
  - `tickets/src/routes/new.ts`
  - `tickets/src/routes/update.ts`

```ts
//tickets/src/routes/new.ts
//...
jest.mock('../../nats-wrapper');

```
- jest will see that we want to mock this file and use the implementation inside `src/__mocks__/` with the same name

### 347. Providing a Mock Implementation
## Summary
- This process involves creating a mock implementation for the Nats wrapper to test the new ticket route handler. 
- The goal is to isolate dependencies and simulate their behavior.

### Understand the Real Nats Wrapper:

- The real wrapper contains a client property, connect function, and private _client property.
- The new ticket route handler only uses the client property, so the mock only needs to simulate this.

### Creating the Mock Implementation:

- Define a client property in the mock object.
- Add a publish function to the mock client that accepts a subject, data, and a callback function.
- The publish function immediately invokes the callback to simulate the event being published.

### Behavior of the Fake Client:

- The fake publish method is used in tests for components like the ticket created publisher which rely on the client.
- This ensures that tests simulate the client.publish behavior without using the actual Nats library.

### Integrating the Mock:

- The mock file is imported in test environments to replace the real Nats wrapper.
- All other tests using the Nats wrapper must also import this mock to avoid test failures.

### Testing:

- After implementing the mock, run the tests. If some still fail, ensure that the mock is used consistently across all test files.
- Modify other test files to redirect imports of the real Nats wrapper to the mock file.
- This approach decouples the tests from external dependencies, ensuring consistent behavior during unit testing.

---

- looking at how new ticket route handler uses the NatsWrapper

<img src='exercise_files/udemy-microservices-section16-347-mocking-looking-at-natswrapper.png'
alt='udemy-microservices-section16-347-mocking-looking-at-natswrapper.png'
width='600'
/>

#### New Ticket Route handler
- does not care about `_client` (as it is private)
- does not care about `connect()` as it is invoked in index.ts when starting project creating NATS client (not in test environment)
- only cares about `client:Stan` -> so this is what we need to define in our fake implementation

<img src='exercise_files/udemy-microservices-section16-347-TicketCreatedPublisher-imports-NatsWrapper-only-cares-about-client.png'
alt='udemy-microservices-section16-347-TicketCreatedPublisher-imports-NatsWrapper-only-cares-about-client.png'
width='600'
/>

- we know the client is provided to TicketCreatedPublisher when using this route: `router.post('/api/tickets',()=>{});`

```ts
//tickets/src/routes/new.ts
import { natsWrapper } from '../nats-wrapper';

router.post('/api/tickets', ()=>{
  //...
  await new TicketCreatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId
  });
});

```

#### client is used in TicketCreatedPublisher which extends Publisher
- `tickets/src/events/publisher/ticket-created-publisher.ts`
- looking at TicketCreatedPublisher -> it doesnt deal with client directly, need to look at `Publisher`

```ts
//tickets/src/events/publisher/ticket-created-publisher.ts
import { Publisher, Subjects, TicketCreatedEvent } from '@clarklindev/common';
export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
  readonly subject = Subjects.TicketCreated;
}
```

#### base publisher (common/src/events/base-publisher.ts)

<img src='exercise_files/udemy-microservices-section16-347-base-publisher-receives-client.png'
alt='udemy-microservices-section16-347-base-publisher-receives-client.png'
width='600'
/>

- the base publisher receives the client
- and the only thing it does with it, is call `this.client.publish(subject, data, callback)` (see below)
- the expectation is that in publish() the `callback` will eventually be called by the client
- NOTE: Publisher is from common/ module -> `import { Publisher, Subjects, TicketCreatedEvent } from '@clarklindev/common';`

```ts
//common/src/events/base-publisher.ts

import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event{
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  constructor(private client: Stan) { }

  publish(data: T['data']): Promise<void> {

    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }
        console.log('event published to subject: ', this.subject);
        resolve();
      });

    });
    
  }
}
```
- so we need to make sure that the mock nats-wrapper `tickets/src/__mocks__/nats-wrapper.ts`
  - has a `client`, that is an object
  - client has a `publish()` function that takes: `subject`, `data`, `callback`

```ts
//tickets/src/__mocks__/nats-wrapper.ts
export const natsWrapper = {
  client: {
    publish: (subject: string, data: string, callback: () => void) => {
      callback();
    }
  }
};
```

### 348. Test-Suite Wide Mocks
- TODO: from `/tickets/src/routes/__test__/new.test.ts`:
  - remove `jest.mock('../../nats-wrapper');`

- TODO: `tickets/src/test/setup.ts` -> add jest.mock() before `beforeAll()`
  - this ensures all of our tests use the `fake` nats-wrapper()

```ts
//...
jest.mock('../nats-wrapper');

let mongo:any;

beforeAll(async ()=>{
  //...
});

//...

```

#### Running tests
- ensure docker is running
- skaffold is running
- forwarding the port `kubectl port-forward nats-depl-56bb68cdfd-82mxd 4222:4222`
- nats-test is listening: nats-test/ `pnpm run listen`
- RUN TEST -> tickets/ `pnpm run test`


### 349. Ensuring Mock Invocations
- ensuring routes are both publishing events:
  - `tickets/src/routes/new.ts` 
  - `tickets/src/routes/update.ts` 

#### wrapping fake implementation with mock function
- update: syntax

```ts
//tickets/src/__mocks__/nats-wrapper.ts
jest.fn().mockImplementation(
  ()=>{} //FAKE IMPLEMENTATION
)
```

- TODO: `tickets/src/__mocks__/nats-wrapper.ts`
  - we have the fake implementation of publish()
  - we need to unsure this (mock function) gets called -> instead of calling this fake implementation of function, we provide a mock function
  - a mock function is a fake function, but we can make tests around it
    - the mock function will internally keep track of whether it has been called, arguments it has been provided.. etc
    - can expect that it gets executed, or executed with a particular argument
  - the mock function still needs to call the callback function that it will be provided (so it needs both the fake implementation AND the mock function)

```ts
//tickets/src/__mocks__/nats-wrapper.ts
export const natsWrapper = {
  client: {
    publish: 
    
    //FAKE IMPLEMENTATION
    // (subject: string, data: string, callback: () => void) => {
    //   callback();
    // }

    //MOCK FUNCTION
    jest.fn().mockImplementation(
      (subject: string, data: string, callback: () => void) => {
        callback();
      }
    )
  }
};
```
- now, we can then make assertions to ensure the publish function is being invoked

#### using mock implementation
- `tickets/src/routes/__test__/new.test.ts`
- create a new test making assertions around the mockImplementation
- the test creates a new ticket
- right after creating a ticket - we expect that it also publish an event notifying other services that a new ticket was created
- so we import `nats-wrapper` (original) and jest will import the fake one from `tickets/src/__mocks__/nats-wrapper.ts`
- NOTE: if you log natsWrapper in `new.test.ts`, it will log the fake implementation which means jest swops out the original for the fake.
- check that publish() was called after creating a ticket: `expect(natsWrapper.client.publish).toHaveBeenCalled();`


```ts
//tickets/src/routes/__test__/new.test.ts
import {natsWrapper} from '../../nats-wrapper';

it('publishes an event', async () => {
  //create a new ticket
  const title = "adsfjsdfdslf";
  const price = 20;

  //create ticket
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price
    })
    .expect(201);

  //publish function should have been called...
  console.log(natsWrapper);

  //check that publish() function gets invoked after creating a ticket
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

```

#### resetting mock function data
- NOTE: the mock implementation in mock natsWrapper gets re-used for all the tests
  - before each test is run, the mockFunction should reset
- ie. the mock function internally tracks how many times it gets called, arguments it is provided etc. and we should reset this for each test
- ticketing/src/test/setup.ts 

```ts
//ticketing/src/test/setup.ts 
beforeEach(async () => {
  jest.clearAllMocks();

  //...
});
```

### ensure publish gets called in update.test.ts
- `tickets/src/routes/__test__/update.test.ts`
- ensure that a ticket is updated
- then ensure that the publish() is called

```ts
//tickets/src/routes/__test__/update.test.ts
import {natsWrapper} from '../../nats-wrapper';

//...
it('publishes an event', async ()=>{
  const cookie = global.signin();

  //create a ticket
  const response = await request(app)
  .post(`/api/tickets`)
  .set('Cookie', cookie)
  .send({
    title: 'sfddsfsd',
    price: 20
  });

  //update ticket
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

```

### 350. NATS Env Variables
- tickets/src/index.ts
- NOTE: the connection props are hardcoded... this should go in environment variables
- move this into: `infra/k8s/tickets-depl.yaml`
  - cluster-id (NATS_CLUSTER_ID)
  - client-id (CLIENT_ID)
  - url-for-nats (NATS_URL)

```ts
//...

const start = async () => {
  //...

  try {
    await natsWrapper.connect('ticketing', 'laskjf', 'http://nats-srv:4222');
  }
  catch (err) {
    console.error(err);
  }
};
```

- with client-id, this is special case because every copy of `tickets` service will get its own `client-id`
- and we should generate a random client-id because when we read the logs, the meaning is lost
- kubectl get pods
- the name of ticket-depl-xxx pod name is unique for every instance, so we can use that as client id

- tell kubernetes to use the name of the current pod as the value:

```yaml
# infra/k8s/tickets-depl.yaml
#...
  - name: NATS_CLIENT_ID
    valueFrom:
      fieldRef:
        fieldPath: metadata.name
#...
```

- full tickets-depl environment variable example:

```yaml
# infra/k8s/tickets-depl.yaml
          env: 
            - name: MONGO_URI
              value: 'mongodb://tickets-mongo-srv:27017/tickets'
            - name: JWT_KEY
              valueFrom:
                secretKeyRef:
                  name: jwt-secret
                  key: JWT_KEY
            - name: NATS_URL
              value: 'http://nats-srv:4222'
            - name: NATS_CLUSTER_ID
              value: ticketing
            - name: NATS_CLIENT_ID
              valueFrom:
                fieldRef:
                  fieldPath: metadata.name
```

#### ensure the environment variables exist
- in `tickets/src/index.ts` 

```ts
//tickets/src/index.ts
//...

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }  
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }  
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }  

//...
```
---

## section 17 - cross-service data replication in action (2hr44min)
### 351. The Orders Service

<img src='exercise_files/'
alt=''
width='600'
/>

### 352. Scaffolding the Orders Service
### 353. A Touch More Setup
### 354. Ingress Routing Rules
### 355. Scaffolding a Few Route Handlers
### 356. Subtle Service Coupling
### 357. Associating Orders and Tickets
### 358. Order Model Setup
### 359. The Need for an Enum
### 360. Creating an Order Status Enum
### 361. More on Mongoose Refs
### 362. Defining the Ticket Model
### 363. Order Creation Logic
### 364. Finding Reserved Tickets
### 365. Convenience Document Methods
### 366. Order Expiration Times
### 367. globalThis has no index signature TS Error
### 368. Test Suite Setup
### 369. Small Update for "Value of type 'typeof ObjectId' is not callable"
### 370. Asserting Tickets Exist
### 371. Asserting Reserved Tickets
### 372. Testing the Success Case
### 373. Fetching a User's Orders
### 374. A Slightly Complicated Testn
### 375. Fetching Individual Orders
### 376. Does Fetching Work?
### 377. Cancelling an Order
### 378. Can We Cancel?
---

## section 18 - understanding event flow (30min)
### 379. Orders Service Events
### 380. Creating the Events
### 381. Implementing the Publishers
### 382. Publishing the Order Creation
### 383. Publishing Order Cancellation
### 384. Testing Event Publishing

---

## section 19 - listening for events and handling concurrency issues (4hr13min)
### 385. Heads Up Regarding Some Mongoose TS Errors
### 386. Time for Listeners!
### 387. Reminder on Listeners
### 388. Blueprint for Listeners
### 389. A Few More Reminders
### 390. Simple onMessage Implementation
### 391. ID Adjustment
### 392. Ticket Updated Listener Implementation
### 393. Initializing the Listeners
### 394. A Quick Manual Test
### 395. Clear Concurrency Issues
### 396. Reminder on Versioning Records
### 397. Optimistic Concurrency Control
### 398. Mongoose Update-If-Current
### 399. Implementing OCC with Mongoose
### 400. Test functions cannot both take a 'done' callback and return something Error
### 401. Testing OCC
### 402. One More Test
### 403. Who Updates Versions?
### 404. Including Versions in Events
### 405. Updating Tickets Event Definitions
### 406. Property 'version' is missing TS Errors After Running Skaffold
### 407. Applying a Version Query
### 408. Did it Work?
### 409. Abstracted Query Method
### 410. [Optional] Versioning Without Update-If-Current
### 411. Testing Listeners
### 412. A Complete Listener Test
### 413. Testing the Ack Call
### 414. Testing the Ticket Updated Listener
### 415. Success Case Testing
### 416. Out-Of-Order Events
### 417. The Next Few Videos
### 418. Fixing a Few Tests
### 419. Listeners in the Tickets Service
### 420. Building the Listener
### 421. Strategies for Locking a Ticket
### 422. Reserving a Ticket
### 423. Setup for Testing Reservation
### 424. Test Implementation
### 425. Missing Update Event
### 426. Private vs Protected Properties
### 427. Publishing While Listening
### 428. Mock Function Arguments
### 429. Order Cancelled Listener
### 430. A Lightning-Quick Test
### 431. Don't Forget to Listen!
### 432. Rejecting Edits of Reserved Tickets
---

## section 20 - worker services (1hr36min)
### 433. The Expiration Service
### 434. Expiration Options
### 435. Initial Setup
### 436. Skaffold errors - Expiration Image Can't be Pulled
### 437. A Touch of Kubernetes Setup
### 438. File Sync Setup
### 439. Listener Creation
### 440. What's Bull All About?
### 441. Creating a Queue
### 442. Queueing a Job on Event Arrival
### 443. Testing Job Processing
### 444. Delaying Job Processing
### 445. Defining the Expiration Complete Event
### 446. Publishing an Event on Job Processing
### 447. Handling an Expiration Event
### 448. Emitting the Order Cancelled Event
### 449. Testing the Expiration Complete Listener
### 450. A Touch More Testing
### 451. Listening for Expiration

---

## section 21 - handling payments (2hr40min)
### 452. The Payments Service
### 453. globalThis has no index signature TS Error
### 454. Initial Setup
### 455. Replicated Fields
### 456. Another Order Model!
### 457. Update-If-Current
### 458. Replicating Orders
### 459. Testing Order Creation
### 460. Marking an Order as Cancelled
### 461. Cancelled Testing
### 462. Starting the Listeners
### 463. Payments Flow with Stripe
### 464. Implementing the Create Charge Handler
### 465. Validating Order Payment
### 466. Testing Order Validation Before Payment
### 467. Testing Same-User Validation
### 468. Stripe Setup
### 469. Creating a Stripe Secret
### 470. Creating a Charge with Stripe
### 471. Manual Testing of Payments
### 472. Automated Payment Testing
### 473. Mocked Stripe Client
### 474. A More Realistic Test Setup
### 475. Realistic Test Implementation
### 476. Tying an Order and Charge Together
### 477. Testing Payment Creation
### 478. Publishing a Payment Created Event
### 479. More on Publishing
### 480. Marking an Order as Complete
### 481. Important Info About the Next Lecture - Don't Skip
### 482. Don't Cancel Completed Orders!

---

## section 22 - back to the client (1hr43min)
### 483. A Few More Pages
### 484. Reminder on Data Fetching with Next
### 485. Two Quick Fixes
### 486. Scaffolding a Form
### 487. Sanitizing Price Input
### 488. Ticket Creation
### 489. Listing All Ticketst
### 490. Reminder on Invalid `<Link>` with `<a>` child Errors
### 491. Linking to Wildcard Routes
### 492. Creating an Order
### 493. Programmatic Navigation to Wildcard Routes
### 494. The Expiration Timer
### 495. Displaying the Expiration
### 496. Showing a Stripe Payment Formt
### 497. Module not found: Can't resolve 'prop-types'
### 498. Configuring Stripe
### 499. Test Credit Card Numbers
### 500. Paying for an Order
### 501. Filtering Reserved Tickets
### 502. Header Links
### 503. Rendering a List of Orders

---

## section 23 - CI/CD (2hr17min)
### 504. Development Workflow
### 505. Git Repository Approaches
### 506. Creating a GitHub Action
### 507. Adding a CI Test Script
### 508. Tests in GitHub Actions Hang - Jest did not exit
### 509. Running Tests on PR Creation
### 510. Output of Failing Tests
### 511. Running Tests in Parallel
### 512. Verifying a Test Run
### 513. Selective Test Execution
### 514. Deployment Options
### 515. Creating a Hosted Cluster
### 516. Reminder on Kubernetes Context
### 517. Reminder on Swapping Contexts
### 518. The Deployment Plan
### 519. Building an Image in an Action
### 520. Testing the Image Build
### 521. Restarting the Deployment
### 522. Applying Kubernetes Manifests
### 523. Prod vs Dev Manifest Files
### 524. Manual Secret Creation
### 525. Don't Forget Ingress-Nginx!
### 526. Testing Automated Deployment
### 527. Additional Deploy Files
### 528. A Successful Deploy!
### 529. Buying a Domain Name
### 530. Three Important Changes Needed to Deploy - Do Not Skip!
### 531. Configuring the Domain Name
### 532. I Really Hope This Works
### 533. Next Steps
---

## section 24 - basics of Docker (3hr3min)

- this section externalized to its own repository: [docker - stephengrider - basics of docker](https://github.com/clarklindev/docker-stephen-grider-basics-of-docker.git)

---

## section 25 - basics of typescript (5hr42min)

- Basics of Typescript -77 lessons (77 lessons (5h 41min))
- NOTE: this section has been extracted to its own repository: [typescript-stephengrider-basics-of-typescript](https://github.com/clarklindev/typescript-stephengrider-basics-of-typescript)
- moved and labelled as `Section 01 to Section 09 - Basics of Typescript`
- this section is also covered in courses:
  - [microservices-with-node-js-and-react](https://www.udemy.com/course/microservices-with-node-js-and-react/) - section 25: appendix B - basics of typescript
  - [typescript-the-complete-developers-guide](https://www.udemy.com/course/typescript-the-complete-developers-guide) - section 01 to section 09
  - [react-and-typescript-build-a-portfolio-project](https://www.udemy.com/course/react-and-typescript-build-a-portfolio-project) - section 26: Appendix:Typescript

---
