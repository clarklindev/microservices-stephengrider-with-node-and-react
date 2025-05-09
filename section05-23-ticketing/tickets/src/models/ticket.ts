import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

//properties required to build a new Ticket
interface TicketAttrs{
  title: string;
  price: number;
  userId: string;
}

//properties that a Ticket has
interface TicketDoc extends mongoose.Document{
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
}

//Properties tied to the model 
interface TicketModel extends mongoose.Model<TicketDoc>{
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
  title:{
    type:String,
    required: true
  },
  price:{
    type:Number,
    required:true
  },
  userId:{
    type:String,
    required:true
  },

  orderId:{
    type:String,
  }
}, 

{
  toJSON:{
    transform(doc, ret){
      ret.id = ret._id;
      delete ret._id;
    }
  }
}
);

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs:TicketAttrs) => {
  return new Ticket(attrs);
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export {Ticket}