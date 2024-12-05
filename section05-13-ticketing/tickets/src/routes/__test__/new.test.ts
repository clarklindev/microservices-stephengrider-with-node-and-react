import { app } from "../../app";
import request from "supertest";

//TODO: test to ensure the request does NOT return a 404 (app.ts throws NotFoundError as catchall route when invalid url)
it('has a route handler to handle listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).not.toEqual(404);
});

//microservices-stephengrider-with-node-and-react-common/src/errors/ NotAuthorizedError -> throws 401
//BEFORE: test fails because there is no authentication tied to tickets/ route handler 
  // - our test is expecting a 401, but it is passing and returning 200  
//FIX: add middleware
it('can only be accessed if user is signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('returns an error if invalid title is provided', async () => {
  
});
it('returns an error if invalid price is provided', async () => {
  
});
it('creates a ticket given valid inputs', async () => {
  
});