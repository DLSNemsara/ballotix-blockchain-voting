import { ErrorHandler } from "../utils/errorHandler.js";

export default (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let error = { ...err };
  error.message = err.message || "Internal server error";

  // Wrong mongoose object id error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    error = new ErrorHandler(message, 400);
  }

  // Handling validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((value) => value.message);
    error = new ErrorHandler(message, 400);
  }

  // Handling duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    error = new ErrorHandler(message, 400);
  }

  // Handling wrong JWT token
  if (err.name === "JsonWebTokenError") {
    const message = "JSON Web Token is invalid. Try again";
    error = new ErrorHandler(message, 400);
  }

  // Handling expired JWT token
  if (err.name === "TokenExpiredError") {
    const message = "JSON Web Token is expired. Try again";
    error = new ErrorHandler(message, 400);
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    error: {
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    },
  });
};
