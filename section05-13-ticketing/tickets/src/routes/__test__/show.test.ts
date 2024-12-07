import request from 'supertest';
import { app } from '../../app';

// get a ticket by id that does not exist
it('returns a 404 if the ticket is not found', async () => { 
  await request(app)
    .get('/api/tickets/sfjlsdfjdslfdsf')
    .send()
    .expect(404);
});

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