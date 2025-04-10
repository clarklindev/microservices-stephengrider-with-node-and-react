import { Publisher, Subjects, TicketCreatedEvent } from '@fightclub/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
  readonly subject = Subjects.TicketCreated;
}