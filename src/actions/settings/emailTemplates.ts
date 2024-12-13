"use server";
import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import getUser from "@/lib/getUser";
import { CompanyEmailTemplate, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const EmailTemplateSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

/**
 * Parses and validates data using a Zod schema.
 * @param {z.ZodType<T>} schema - The Zod schema to use for validation.
 * @param {unknown} data - The data to validate.
 * @returns {T} - The validated data.
 * @throws {Error} - If validation fails.
 */
const parsedSafeData = <T>(schema: z.ZodType<T>, data: unknown) => {
  const result = schema.safeParse(data);
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error.errors.map((e) => e.message).join(","));
  }
};

/**
 * Retrieves or creates an email template for the current user's company.
 * @returns {Promise<CompanyEmailTemplate>} - The email template.
 * @throws {Error} - If there is an error fetching or creating the email template.
 */
export const getOrCreateEmailTemplate =
  async (): Promise<CompanyEmailTemplate> => {
    try {
      const companyId = await getCompanyId(); // Get the company ID
      let template = await db.companyEmailTemplate.findFirst({
        where: { companyId },
      });

      if (!template) {
        template = await db.companyEmailTemplate.create({
          data: {
            subject: "Default Email Subject",
            message: "Default message for Email",
            companyId,
          },
        });
      }

      return template;
    } catch (error) {
      console.error("Error fetching/creating email template:", error);
      throw error;
    }
  };

/**
 * Retrieves an email template for the current user's company.
 * @returns {Promise<CompanyEmailTemplate | null>} - The email template or null if not found.
 * @throws {Error} - If there is an error fetching the email template.
 */
export const getEmailTemplate =
  async (): Promise<CompanyEmailTemplate | null> => {
    try {
      const companyId = await getCompanyId(); // Get the company ID
      let template = await db.companyEmailTemplate.findFirst({
        where: { companyId },
      });

      if (!template) {
        return null;
      }

      return template;
    } catch (error) {
      console.error("Error fetching/creating email template:", error);
      throw error;
    }
  };

/**
 * Updates or creates an email template for the current user's company.
 * @param {number | null} id - The ID of the email template to update, or null to create a new one.
 * @param {unknown} emailTemplateData - The data for the email template.
 * @returns {Promise<CompanyEmailTemplate>} - The updated or created email template.
 * @throws {Error} - If there is an error updating or creating the email template.
 */
export const updateEmailTemplate = async (
  id: number | null,
  emailTemplateData: unknown,
) => {
  try {
    const validatedData = parsedSafeData(
      EmailTemplateSchema,
      emailTemplateData,
    );
    const user = await getUser();
    let updatedTemplate;
    if (id) {
      updatedTemplate = await db.companyEmailTemplate.update({
        where: { id },
        data: {
          subject: validatedData.subject,
          message: validatedData.message,
          companyId: user.companyId,
        },
      });
    } else {
      updatedTemplate = await db.companyEmailTemplate.create({
        data: {
          subject: validatedData.subject,
          message: validatedData.message,
          companyId: user.companyId,
        },
      });
    }
    revalidatePath("/estimate");
    return updatedTemplate;
  } catch (error: any) {
    console.error("Error updating email template:", error);
    throw error;
  }
};

const companyTaxUpdatesTSchema = z.object({
  tax: z.union([z.string(), z.number()]).transform((val) => {
    return new Prisma.Decimal(val);
  }),
  currency: z.string().min(1, "Currency is required"),
});

/**
 * Updates the tax and currency for the current user's company.
 * @param {Object} data - The data for the tax and currency update.
 * @param {string | number} data.tax - The tax value.
 * @param {string} data.currency - The currency value.
 * @throws {Error} - If there is an error updating the tax and currency.
 */
export const updateTaxCurrency = async (data: {
  tax: string | number;
  currency: string;
}) => {
  const dataValidation = companyTaxUpdatesTSchema.safeParse(data);

  if (!dataValidation.success) {
    console.log("Update tax policy error", dataValidation.error);
    throw new Error("Invalid input data");
  }

  const validatedData = dataValidation.data;

  try {
    const companyId = await getCompanyId();
    await db.company.update({
      where: { id: companyId },
      data: {
        tax: validatedData?.tax,
        currency: validatedData?.currency,
      },
    });
  } catch (error) {
    console.error("Error updating company tax:", error);
  }
};

const companyUpdatesTermsPolicySchema = z.object({
  terms: z.string().min(1, "Terms is required").optional(),
  policy: z.string().min(1, "Policy is required").optional(),
});

/**
 * Updates the terms and policy for the current user's company.
 * @param {Object} data - The data for the terms and policy update.
 * @param {string} [data.terms] - The terms value.
 * @param {string} [data.policy] - The policy value.
 * @throws {Error} - If there is an error updating the terms and policy.
 */
export const updateTermsPolicy = async (
  data: z.infer<typeof companyUpdatesTermsPolicySchema>,
) => {
  const dataValidation = companyUpdatesTermsPolicySchema.safeParse(data);

  if (!dataValidation.success) {
    console.log("Update tax policy error", dataValidation.error);
  }

  const validatedData = dataValidation.data;

  try {
    const companyId = await getCompanyId();
    await db.company.update({
      where: { id: companyId },
      data: {
        terms: validatedData?.terms,
        policy: validatedData?.policy,
      },
    });
  } catch (error) {
    console.error("Error updating company terms and policy:", error);
  }
};

/**
 * Retrieves the terms, policy, and tax for the current user's company.
 * @returns {Promise<{ terms: string; policy: string; tax: Prisma.Decimal }>} - The terms, policy, and tax.
 * @throws {Error} - If there is an error fetching the terms, policy, or tax.
 */
export const getCompanyTermsAndPolicyTax = async (): Promise<{
  terms: string;
  policy: string;
  tax: Prisma.Decimal;
}> => {
  try {
    const companyId = await getCompanyId();
    const companyData = await db.company.findUnique({
      where: { id: companyId },
      select: { terms: true, policy: true, tax: true },
    });

    if (!companyData) {
      throw new Error("Company not found");
    }

    return {
      terms: companyData.terms ?? "",
      policy: companyData.policy ?? "",
      tax: companyData.tax ?? new Prisma.Decimal(0),
    };
  } catch (error) {
    console.error("Error fetching company terms and policy:", error);
    throw error;
  }
};

/**
 * Retrieves the tax for the current user's company.
 * @returns {Promise<{ tax: number }>} - The tax value.
 * @throws {Error} - If there is an error fetching the tax.
 */
export const getCompanyTaxCurrency = async (): Promise<{ tax: number }> => {
  try {
    const companyId = await getCompanyId();
    const companyData = await db.company.findUnique({
      where: { id: companyId },
      select: { tax: true },
    });
    if (!companyData) {
      throw new Error("Company not found");
    }

    return {
      tax: companyData.tax ? companyData.tax.toNumber() : 0,
    };
  } catch (error) {
    console.error("Error fetching company tax:", error);
    throw error;
  }
};
