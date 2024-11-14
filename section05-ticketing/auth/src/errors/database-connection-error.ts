//database-connection-error.ts
import { ValidationError } from 'express-validator';

export class DatabaseConnectionError extends Error {
  reason = 'Error connecting to database';

  constructor() {
    super();

    //only because we are extending a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}

//usage: throw new DatabaseConnectionError(reason);
