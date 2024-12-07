import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError
} from '@clarklindev/common';

import { Ticket } from '../models/ticket';

const router = express.Router();

router.put('/api/tickets/:id',
  requireAuth,
  [
    body('title')
      .not()
      .isEmpty()
      .withMessage('Title is required'),
    body('price')
      .isFloat({gt: 0})
      .withMessage('Price must be provided and greater than 0')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if(!ticket){
      throw new NotFoundError();
    }

    if(ticket.userId !== req.currentUser!.id){
      throw new NotAuthorizedError();
    }

    //apply update 
    ticket.set({
      title: req.body.title,
      price: req.body.price
    })

    await ticket.save();  //ticket is now updated

    //sending back ticket will have the updated data
    res.send(ticket);
  }
);

export {router as updateTicketRouter}