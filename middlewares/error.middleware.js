const { ApiError } = require("../utils/ApiError.js");

// /*
//  * @param {Error | ApiError} err
//  * @param {import("express").Request} req
//  * @param {import("express").Response} res
//  * @param {import("express").NextFunction} next
//  *
//  * @description This middleware is responsible to catch the errors from any request handler wrapped inside the {@link asyncHandler}
//  */
const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 400;

    const message = error.message || "Something went wrong";
    error = new ApiError(statusCode, message, error?.errors || [], error.stack);
  }

  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}), // Error stack traces should be visible in development for debugging
  };
  // console.log("Printing from Error middleware: ", response);

  return res.status(error.statusCode).json(response);
};

module.exports = { errorHandler };
