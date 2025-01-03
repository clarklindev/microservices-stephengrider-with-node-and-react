import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderStatus, ExpirationCompleteEvent} from '@clarklindev/common';
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";

const setup = async () =>{
  //create an instance of the listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 15
  });
  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: '32423fcdsfs',  //dont matter
    expiresAt: new Date(),  //dont matter
    ticket
  });
  await order.save();

  const data:ExpirationCompleteEvent['data'] = {
    orderId: order.id
  }
  
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, order, ticket, data, msg };
};