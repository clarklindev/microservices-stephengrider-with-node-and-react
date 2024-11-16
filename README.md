# Microservices

- Build, deploy, and scale an E-Commerce app using Microservices built with Node, React, Docker and Kubernetes

- [microservices-with-node-js-and-react](https://www.udemy.com/course/microservices-with-node-js-and-react/)

- given /exercise_files

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

### CRUD server

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
- [Section 26 - Bonus (1min)](#section-26---bonus-1min)

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

  #### Windows -> enable kubernetes

  - RECOMMENDED -> Windows users should use -> Docker Desktop with WSL2
  - docker toolbox icon -> preferences -> kubernetes -> enable kubernetes -> restart

  #### mac

  - RECOMMENDED -> macOS users should use Docker Desktops kubernetes instead of Minikube

  #### Linux

  - RECOMMENDED -> Minikube

## 63. NOTE on MiniKube

- Install option -> Install method with Docker-Toolbox (STATUS: unstable) or Linux (need to install [minikube](kubernetes.io/docs/tasks/tools/install-minikube))
  - Minikube is an alternative option to using Docker Desktop's built-in Kubernetes.

## 64. kubernetes tour

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

### TROUBLESHOOT

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
- update kube config file `c:\Users\<user folder>\.kube\config` -> update clusters server -> `server: https://localhost:6443`
- AS ADMINISTRATOR: c:\Windows\System32\drivers\etc\hosts

```
127.0.0.1 kubernetes.docker.internal
127.0.0.1 docker-for-desktop
```

#### Docker desktop for mac

- [Q&A](https://www.udemy.com/course/microservices-with-node-js-and-react/learn/lecture/19099722#questions/10956202) - By default, the server address for the cluster in the kube config file is set to `https://kubernetes.docker.internal:<port number>`. For Docker Desktop for Mac version 2.3.0.3 and K8s version 1.16.5, this server address needs to be changed to `https://localhost:<port number>`, where the port number is usually something like 6443. Once I made this change to the server address, I was finally able to connect to the local kube server and use the kubectl command without any issues.
- kubernetes takes the docker image created and `deploys` and `manages` this instance of image (as a container) in the kubernetes cluster (node -> Virtual Machine)
- a config file for kubernetes -> tells it how to manage the image and host it as container in `kubernetes cluster of nodes`
- config also describes the access rights
- `kubectl` is tool used to interact with the kubernetes cluster
- kubernetes tries to find the image (described in config file) first from local computer
- if it cant find it, then it looks in docker-hub

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
- looking at the yaml, notice: it is creating an load balancer (Kind: service)

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
- create a kubernetes cluster (select Kubernetes engine)
  - cluster basics -> (switch to default cluster (SELECT THIS) / switch to autopilot cluster (CHEAPER-google manages infrastructure))
    - `name`
    - `location type` -> zonal -> zone (select)
    - `master version` (kubernetes version) -> target: `regular (recommended)` / version: `default`
  - node pools -> default-pool
    - number of nodes -> 3
    - nodes -> machine configuration -> `general purpose` -> `N1` series
    - machine type -> `g1-small`
  - TODO: click `create`

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
//src/models/user.ts

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

## section 10 - testing isolated microservices (1hr22min)

---

## section 11 - integrating a server side rendered react app (3hr01min)

---

## section 12 - code sharing and re-use between services (52min)

---

## section 13 - create-read-update-destroy server setup (2hr28min)

---

## section 14 - NATS streaming server - an event bus implementation (2hr57min)

---

## section 15 - connecting to NATS in a nodejs world (1hr22min)

---

## section 16 - managing a NATS client (1hr37min)

---

## section 17 - cross-service data replication in action (2hr44min)

---

## section 18 - understanding event flow (30min)

---

## section 19 - listening for events and handling concurrency issues (4hr13min)

---

## section 20 - worker services (1hr36min)

---

## section 21 - handling payments (2hr40min)

---

## section 22 - back to the client (1hr43min)

---

## section 23 - CI/CD (2hr17min)

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

## section 26 - bonus (1min)

---
