import { EmailTemplateType } from "@prisma/client";

export type EmailTemplate = {
  id: number;
  subject: string;
  message: string;
  type: EmailTemplateType;
};
