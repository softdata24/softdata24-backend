export class ApiError extends Error {
  statusCode: number;
  data: any;
  success: boolean;
  errors: any[];

  constructor(
    statusCode: number,
    message = "Something went wrong",
    errors: any[] = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static BadRequest(message: string) {
    return new ApiError(400, message);
  }

  static Unauthorized(message: string) {
    return new ApiError(401, message);
  }

  static Forbidden(message: string) {
    return new ApiError(403, message);
  }

  static NotFound(message: string) {
    return new ApiError(404, message);
  }

  static StatusConflict(message: string) {
    return new ApiError(409, message);
  }

  static InternalServerError(message: string) {
    return new ApiError(500, message);
  }
}
