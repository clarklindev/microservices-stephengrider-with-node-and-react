import { Message } from "node-nats-streaming";

import { Subjects, Listener, TicketUpdatedEvent } from "@fightclub/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data:TicketUpdatedEvent['data'], msg:Message) {
    // const ticket = await Ticket.findById(data.id);

    //UPDATE:
    const ticket = await Ticket.findByEvent(data);

    if(!ticket){
      throw new Error('Ticket not found');
    }

    //custom implementation of `mongoose-update-if-current`
    // const {title, price, version} = data;
    // ticket.set({title, price, version});
    // await ticket.save();

    //using `mongoose-update-if-current` (no need for version)
    const {title, price} = data;
    ticket.set({title, price});
    await ticket.save();
   
    msg.ack();
  }

}