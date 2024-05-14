export interface ServerAction {
  type: "error" | "success";
  message?: string;
  // if type is error, this will be the field that caused the error
  field?: string;
  data?: any;
}
