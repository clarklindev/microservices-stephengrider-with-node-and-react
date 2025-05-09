import { OrderStatus } from '@fightclub/common';
import mongoose from 'mongoose';
import {updateIfCurrentPlugin } from 'mongoose-update-if-current';

//properties -> properties for building an order 
interface OrderAttrs{
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

//properties -> properties an order has
interface OrderDoc extends mongoose.Document{
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

//properties -> properties a model contains
interface OrderModel extends mongoose.Model<OrderDoc>{
  build(attrs:OrderAttrs):OrderDoc;
}

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(doc, ret){
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status
  })
}

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };