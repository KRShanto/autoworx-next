import { z } from "zod";

export const estimateTagsValidationSchema = z.object({
  id: z.number({ message: "Tag id is required" }),
  name: z.string().nonempty("Tag name is required"),
  textColor: z.string({ message: "Text color is required" }),
  bgColor: z.string({ message: "Background color is required" }),
  companyId: z.number({ message: "Company id is required" }),
  createdAt: z.date({ message: "Created at is required" }),
  updatedAt: z.date({ message: "Updated at is required" }),
});
