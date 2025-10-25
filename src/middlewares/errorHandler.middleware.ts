// src/middlewares/errorHandler.ts
import { NextFunction, Request, Response } from "express";
import { ApiError } from "@utils/ApiError.util";

interface ErrorResponse {
  statusCode: number;
  message: string;
  errors?: any[];
  stack?: string;
}

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): Response<ErrorResponse> => {
  let error: ApiError;

  if (err instanceof ApiError) {
    error = err;
  } else if (err instanceof Error) {
    // type-safe extraction using type assertion
    const maybeWithStatus = err as Error & { statusCode?: number; errors?: any[] };
    error = new ApiError(
      maybeWithStatus.statusCode ?? 400,
      err.message,
      maybeWithStatus.errors ?? [],
      err.stack
    );
  } else {
    // For non-Error thrown values
    error = new ApiError(400, "Something went wrong");
  }

  const response: ErrorResponse = {
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  return res.status(error.statusCode).json(response);
};
