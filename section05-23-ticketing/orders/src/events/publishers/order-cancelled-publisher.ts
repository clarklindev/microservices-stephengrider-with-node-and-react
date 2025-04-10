import {Subjects, Publisher, OrderCancelledEvent} from '@fightclub/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
  readonly subject = Subjects.OrderCancelled
}