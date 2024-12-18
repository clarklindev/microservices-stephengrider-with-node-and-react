import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import {body} from 'express-validator';

import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@clarklindev/common';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';

const router = express.Router();

router.post('/api/orders',
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

    //make sure ticket is not already reserved (expiresAt - caters for high-traffic)
    //run query to look at all orders. find an order where the ticket is the ticket we just found *and* the orders status is *not* cancelled.
    //if we find an order - that mean the ticket *is* reserved
    const existingOrder = await Order.findOne({
      ticket: ticket,
      status: {
        $in: [
          OrderStatus.Created,
          OrderStatus.AwaitingPayment,
          OrderStatus.Complete
        ]
      }
    });

    if(existingOrder) {
      throw new BadRequestError('Ticket is already reserved');
    }

    //calculate an expiration date for this order

    //build the order and save it to the database

    //publish an event saying that an order was created
    //  - common module -> create an event to handle order created
    //  - orders/ project needs a publisher for order created

    res.send({});
  }
);

export { router as newOrderRouter };
  