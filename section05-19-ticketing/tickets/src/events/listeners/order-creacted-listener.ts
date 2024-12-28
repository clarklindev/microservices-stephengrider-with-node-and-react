import { Message } from 'node-nats-streaming';
import {Listener, Subjects, OrderCreatedEvent} from '@clarklindev/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  
  async onMessage(data:OrderCreatedEvent['data'], msg:Message){
    //find ticket order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    //if no ticket throw error
    if(!ticket){
      throw new Error('Ticket not found');
    }

    //mark ticket as reserved setting 'orderId' property
    ticket.set({orderId: data.id});

    //save the ticket
    await ticket.save();

    //ack the message
    msg.ack();
  }
}