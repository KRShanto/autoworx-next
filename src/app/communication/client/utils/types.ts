// Type Definitions
export type MessagePart = {
  mimeType: string;
  body?: {
    data?: string;
    attachmentId?: string;
  };
  parts?: MessagePart[];
};

export type EmailMessage = {
  payload: {
    mimeType: string;
    parts?: MessagePart[];
    body?: {
      data?: string;
    };
  };
  internalDate?: string;
};

// TODO: @bettercallsundim - Please if you can, complete the type definitions for this
export type Conversation = any;
