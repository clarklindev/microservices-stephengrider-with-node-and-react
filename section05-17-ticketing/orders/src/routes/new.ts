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

    const isReserved = await ticket.isReserved();
    if(isReserved) {
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
  