import { ZodError } from "zod";

export default function handleZodError(error: ZodError) {
  const message = "validation error";
  const statusCode = 400;

  const errorSource = error.issues.map((issue) => {
    return {
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    };
  });

  return {
    message,
    statusCode,
    errorSource,
  };
}
