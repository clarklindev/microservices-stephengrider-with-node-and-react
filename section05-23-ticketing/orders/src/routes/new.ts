import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import {body} from 'express-validator';

import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@fightclub/common';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 2 * 60;

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Ticket id must be provided')
  ],
  validateRequest,

  async (req: Request, res: Response) => {
    const {ticketId} = req.body;
    //find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if(!ticket){
      throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved();
    if(isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    //calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    //build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket
    })

    await order.save();

    //publish an event saying that an order was created
    //  - common module -> create an event to handle order created
    //  - orders/ project needs a publisher for order created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket:{
        id: ticket.id,
        price: ticket.price
      }
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
  