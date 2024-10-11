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
- `src/blog-boilerplate` boiler plate code for  Sections 2, 3, and 4

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
