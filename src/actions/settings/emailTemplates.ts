"use server";
import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import getUser from "@/lib/getUser";
import { planObject } from "@/utils/planObject";
import { CompanyEmailTemplate, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const EmailTemplateSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

const parsedSafeData = <T>(schema: z.ZodType<T>, data: unknown) => {
  const result = schema.safeParse(data);
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error.errors.map((e) => e.message).join(","));
  }
};

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

  return planObject({
      terms: companyData.terms ?? "",
      policy: companyData.policy ?? "",
      tax: companyData.tax ?? new Prisma.Decimal(0),
    });
  } catch (error) {
    console.error("Error fetching company terms and policy:", error);
    throw error;
  }
};

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
