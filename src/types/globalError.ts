import { TErrorSource } from "@/error-boundary/globalErrorHandler";

export interface TErrorHandler {
  success?: boolean;
  statusCode?: number;
  message: string;
  errorSource?: TErrorSource[];
  stack?: string;
  field?: string;
  type?: "globalError";
}
