export class AppError extends Error {
  public statusCode: number;
  constructor(
    statusCode: number = 500,
    message: string = "Internal server error ",
    stack: string = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
