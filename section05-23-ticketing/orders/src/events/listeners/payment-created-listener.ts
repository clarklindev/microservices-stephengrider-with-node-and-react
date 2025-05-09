import { Message } from 'node-nats-streaming';
import {Subjects, Listener, PaymentCreatedEvent, OrderStatus} from '@fightclub/common';

import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;
  async onMessage(data:PaymentCreatedEvent['data'], msg:Message){
    const order = await Order.findById(data.orderId);

    if(!order){
      throw new Error('order not found');
    }

    order.set({
      status: OrderStatus.Complete
    });
    await order.save();

    msg.ack();
  }
}