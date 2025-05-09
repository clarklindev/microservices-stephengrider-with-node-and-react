import { Message } from 'node-nats-streaming';
import {Listener, Subjects, OrderCreatedEvent} from '@fightclub/common';

import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import {TicketUpdatedPublisher} from '../publishers/ticket-updated-publisher';

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
    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version
    });

    //ack the message
    msg.ack();
  }

}