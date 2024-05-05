import type { Key } from "react";

export type EmailTemplateType = "CONFIRMATION" | "REMINDER";

export type EmailTemplate = { id: Key; name: string; type: EmailTemplateType };
