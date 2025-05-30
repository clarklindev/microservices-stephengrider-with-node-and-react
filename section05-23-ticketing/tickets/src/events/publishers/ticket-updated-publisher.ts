import { Publisher, Subjects, TicketUpdatedEvent } from '@fightclub/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
  readonly subject = Subjects.TicketUpdated;
}