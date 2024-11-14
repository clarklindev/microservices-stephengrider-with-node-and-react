import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super('route not found');

    //only because we are extending a built in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeError(): { message: string; field?: string }[] {
    return [{ message: 'not found' }];
  }
}

//test: throw new NotFoundError()
