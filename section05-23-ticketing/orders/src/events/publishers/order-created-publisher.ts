import { Publisher, OrderCreatedEvent, Subjects } from "@fightclub/common";

/*
// USAGE:
new OrderCreatedPublisher(natsClient).publish({id, userId, status, expiresAt, ticket, price})
*/

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
  readonly subject = Subjects.OrderCreated;
}

