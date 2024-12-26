import { Prisma } from "@prisma/client";
import httpStatus from "http-status";

export function handlePrismaError(error: any) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (error.code === "P2002") {
      return {
        statusCode: httpStatus.CONFLICT,
        message: `Duplicate value for ${error.meta?.target}`,
      };
    }

    // Record not found
    if (error.code === "P2025") {
      return {
        statusCode: httpStatus.NOT_FOUND,
        message: "Record not found",
      };
    }

    // Foreign key constraint failed
    if (error.code === "P2003") {
      return {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Invalid relation",
      };
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      statusCode: httpStatus.BAD_REQUEST,
      message: "Validation error",
    };
  }
  return undefined;
}
