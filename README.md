# Microservices

- given /exercise_files

## Sction 01 - fundamntal idas around Microservices

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
    - 