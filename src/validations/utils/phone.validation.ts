import { z } from "zod";
export const phoneValidationSchema = z.string().refine(
  (val) => {
    if (!val) return true; // Optional check

    // Remove all non-digit chars except + for international format
    const cleaned = val.replace(/[^\d+]/g, "");

    // Basic format checks
    const isValidFormat = /^\+?[1-9]\d{1,14}$/.test(cleaned);

    // Length check (including country code)
    const hasValidLength = cleaned.length >= 10 && cleaned.length <= 15;

    // Country code check (optional)
    const hasValidCountryCode =
      !cleaned.startsWith("+") ||
      cleaned.substring(1, 4).match(/^[1-9]\d{0,2}$/);

    return isValidFormat && hasValidLength && hasValidCountryCode;
  },
  {
    message:
      "Invalid phone number format. Must be a valid international or local format",
  },
);
