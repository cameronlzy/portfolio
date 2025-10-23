import { error as respError } from "../helpers/response.js";
import AppError from "../utils/appError.js";

const handleDuplicateFieldsDB = (err) => {
  const value = err.errorResponse.errmsg.match(/(["'"])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // 1. Log Error
    console.error("ERROR", err);

    // 2. Send Generic message
    res.status(500).json(respError("error", "Something went very wrong!"));
  }

  // Standard procedure to split operational (Trusted error) and non operational (Dont leak error details)
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    // message not enumerable here
    error.message = err.message;
    // if (err.name === "CastError") error = handleCastErrorDB(error);
    // No need handle CastError because of our middleware for object id
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    sendErrorProd(error, res);
  }
};
