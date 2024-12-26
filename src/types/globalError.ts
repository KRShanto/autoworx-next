import { TErrorSource } from "@/error-boundary/globalErrorHandler";

export interface TErrorHandler {
  success: boolean;
  statusCode: any;
  message: any;
  errorSource: TErrorSource[];
  stack?: any;
}
