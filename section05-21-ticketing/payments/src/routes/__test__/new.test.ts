import { OrderStatus } from '@clarklindev/common';
import request from 'supertest';
import mongoose from 'mongoose';

import { Order } from '../../models/order';
import { app } from '../../app';
//throw an error if purchase an error that does not exist

it('throws a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'asdasdasd',
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('returns a 401 when purchasing an order that doesnt belong to a user', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });

  await order.save();
});

it('returns a 400 when purchasing a cancelled order', async () => {});
