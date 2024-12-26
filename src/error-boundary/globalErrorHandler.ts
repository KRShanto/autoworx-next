import { ZodError } from "zod";
import handleZodError from "./handleZodErrors";
import httpStatus from "http-status";
import { AppError } from "./error";

export type TErrorSource = {
  path: string | number;
  message: string;
};

export type TGenericErrorResponse = {
  message: string;
  statusCode: number;
  errorSource: TErrorSource[];
};

// response error handler
export const notFoundError = () => {
  const error: any = new Error("Response not found");
  error.statusCode = httpStatus.NOT_FOUND;
  return {
    message: error.message,
    statusCode: error.statusCode,
    errorSource: [],
  };
};

// global error handler
export const errorHandler = (error: any) => {
  let message = error?.message;
  let statusCode = error?.statusCode || 500;
  let errorSource: TErrorSource[] = [
    {
      path: error?.path || "",
      message: error?.message,
    },
  ];
  // check zod error instance
  if (error instanceof ZodError) {
    const zodError = handleZodError(error);
    message = zodError.message;
    statusCode = zodError.statusCode;
    errorSource = zodError.errorSource;
  }
  if (error instanceof AppError) {
    message = error.message;
    statusCode = error.statusCode;
    errorSource = [
      {
        path: "",
        message: error.message,
      },
    ];
  }
  // TODO: Future implementation
  //   if (error.name === "ValidationError") {
  //     const mongooseValidationError = handleValidationError(error);
  //     message = mongooseValidationError.message;
  //     statusCode = mongooseValidationError.statusCode;
  //     errorSource = mongooseValidationError.errorSource;
  //   } else if (error.name === "CastError") {
  //     const castError = handleCastError(error);
  //     message = castError.message;
  //     statusCode = castError.statusCode;
  //     errorSource = castError.errorSource;
  //   } else if (error.code === 11000) {
  //     const duplicateError = handleDuplicateError(error);
  //     message = duplicateError.message;
  //     statusCode = duplicateError.statusCode;
  //     errorSource = duplicateError.errorSource;
  //   }

  // send error response to client
  return {
    success: false,
    statusCode,
    message,
    errorSource,
    stack: process.env.NODE_ENV === "development" ? error?.stack : null,
  };
};
