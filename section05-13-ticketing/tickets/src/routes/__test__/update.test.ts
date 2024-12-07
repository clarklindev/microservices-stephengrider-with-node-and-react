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

  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', global.signin())
    .send({
      title: 'sfddsfsd',
      price: 20
    });

  //...edit a ticket 
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

it('returns a 400 if the user provides an invalid title or price', async () => {
    
});

it('updates the ticket if provided valid inputs - happy test', async () => {
    
});
