import { Message } from 'node-nats-streaming';
import {Listener, Subjects, OrderCreatedEvent} from '@clarklindev/common';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  
  async onMessage(data:OrderCreatedEvent['data'], msg:Message){

  }
}