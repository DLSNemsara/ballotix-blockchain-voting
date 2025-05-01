// Custom error handler class
export class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    // Create stack property for object
    Error.captureStackTrace(this, this.constructor);
  }
}
