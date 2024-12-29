import { z } from "zod";
export const requiredEmailValidationSchema = z
  .string()
  .nonempty("Email is required")
  .refine(
    (val) => {
      if (!val) return true;
      return val.includes("@");
    },
    { message: "Email must contain '@' symbol" },
  )
  .refine(
    (val) => {
      if (!val) return true;
      const [local, domain] = val.split("@");
      return local && local.length <= 64;
    },
    { message: "Local part of email cannot exceed 64 characters" },
  )
  .refine(
    (val) => {
      if (!val) return true;
      const [local, domain] = val.split("@");
      return domain && domain.length <= 255;
    },
    { message: "Domain part of email cannot exceed 255 characters" },
  )
  .refine(
    (val) => {
      if (!val) return true;
      return !val.includes("..");
    },
    { message: "Email cannot contain consecutive dots" },
  )
  .refine(
    (val) => {
      if (!val) return true;
      return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
        val,
      );
    },
    { message: "Invalid email format" },
  );
export const optionalEmailValidationSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val) return true;
      return val.includes("@");
    },
    { message: "Email must contain '@' symbol" },
  )
  .refine(
    (val) => {
      if (!val) return true;
      const [local, domain] = val.split("@");
      return local && local.length <= 64;
    },
    { message: "Local part of email cannot exceed 64 characters" },
  )
  .refine(
    (val) => {
      if (!val) return true;
      const [local, domain] = val.split("@");
      return domain && domain.length <= 255;
    },
    { message: "Domain part of email cannot exceed 255 characters" },
  )
  .refine(
    (val) => {
      if (!val) return true;
      return !val.includes("..");
    },
    { message: "Email cannot contain consecutive dots" },
  )
  .refine(
    (val) => {
      if (!val) return true;
      return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
        val,
      );
    },
    { message: "Invalid email format" },
  );
