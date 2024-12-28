import { OrderCreatedEvent, OrderStatus } from "@clarklindev/common";
import mongoose from 'mongoose';

import { OrderCreatedListener } from "../order-creacted-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { Message } from "node-nats-streaming";
const setup = async () => {
  //create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  //create and save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: 'asdg'
  });

  await ticket.save();

  //create the fake data event (order created event)
  const data:OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'adsdasdqew',
    expiresAt: 'string',
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  };

  //@ts-ignore
  const msg:Message = {
    ack: jest.fn()
  }

  return {listener, ticket, data, msg};
}