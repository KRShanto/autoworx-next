import { ZodError } from "zod";
import handleZodError from "./handleZodErrors";
import httpStatus from "http-status";
import { AppError } from "./error";
import { TErrorHandler } from "@/types/globalError";
import { handlePrismaError } from "./handlePrismaError";
import { Prisma } from "@prisma/client";

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
export const errorHandler = (error: any): TErrorHandler => {
  let message: string = error?.message;
  let statusCode: number =
    error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
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
  } else if (error instanceof AppError) {
    message = error.message;
    statusCode = error.statusCode;
    errorSource = [
      {
        path: "",
        message: error.message,
      },
    ];
  } else if (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientValidationError
  ) {
    const prismaError = handlePrismaError(error);
    message = prismaError?.message || "";
    statusCode = prismaError?.statusCode || 500;
    errorSource = [];
  }
  // TODO: Future more implementation
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
    type: "globalError",
    statusCode,
    message,
    errorSource,
    stack: process.env.NODE_ENV === "development" ? error?.stack : null,
  };
};
