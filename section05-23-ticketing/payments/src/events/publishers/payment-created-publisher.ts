import { Subjects, Publisher, PaymentCreatedEvent } from "@fightclub/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}