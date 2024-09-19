
"use server";
import { db } from "@/lib/db";
import { z } from "zod";
import { getCompanyId } from "@/lib/companyId";
import { CompanyEmailTemplate,Prisma } from "@prisma/client";



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

// export const createEmailTemplate = async (emailTemplateData: unknown) => {
//   try {
   
//     const validatedData = parsedSafeData(
//       EmailTemplateSchema,
//       emailTemplateData,
//     );

    
//     const createdTemplate = await db.companyEmailTemplate.create({
//       data: {
//         subject: validatedData.subject,
//         message: validatedData.message,
//         companyId: validatedData.companyId,
//       },
//     });

//     return createdTemplate;
//   } catch (error) {
//     console.error("Error creating email template:", error);
//     throw error;
//   }
// };

// Update Email Template


export const getOrCreateEmailTemplate = async (): Promise<CompanyEmailTemplate> => {
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
export const updateEmailTemplate = async (
  id:number,
  emailTemplateData: unknown,
) => {
  try {
    const validatedData = parsedSafeData(
      
      EmailTemplateSchema,
      emailTemplateData,
    );
    const companyId=await getCompanyId();
    const updatedTemplate = await db.companyEmailTemplate.update({
      where: { id },
      data: {
        subject: validatedData.subject,
        message: validatedData.message,
        companyId
      },
    });

    return updatedTemplate;
  } catch (error:any) {
    console.error("Error updating email template:", error);
    throw error;
  }
};

// export const deleteEmailTemplate = async (id: number) => {
//   try {
//     await db.companyEmailTemplate.delete({
//       where: { id },
//     });
//     return { success: true, message: "Email template deleted successfully." };
//   } catch (error) {
//     console.error("Error deleting email template:", error);
//     throw error;
//   }
// };
//update the tax,terms and policy

const companyTaxUpdatesTSchema=z.object({
  tax: z.string().transform((val) => {
    return new Prisma.Decimal(val);
  }),
  currency:z.string().min(1,"Currency is required"),
 


})


export const updateTaxCurrency=async(data:z.infer<typeof companyTaxUpdatesTSchema>)=>{

  const dataValidation=companyTaxUpdatesTSchema.safeParse(data);

  if(!dataValidation.success)
  {
    console.log("Update tax policy error",dataValidation.error)
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

const companyUpdatesTermsPolicySchema=z.object({
  terms: z.string().min(1, "Terms is required").optional(),
  policy: z.string().min(1, "Policy is required").optional(),
 
})
export const updateTermsPolicy=async(data:z.infer<typeof companyUpdatesTermsPolicySchema>)=>{

  const dataValidation=companyUpdatesTermsPolicySchema.safeParse(data);

  if(!dataValidation.success)
  {
    console.log("Update tax policy error",dataValidation.error)
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

}

export const getCompanyTermsAndPolicy = async (): Promise<{ terms: string; policy: string }> => {
  try {
    const companyId = await getCompanyId();
   const companyData = await db.company.findUnique({
    where: { id:companyId },
    select:{terms:true,policy:true}
   })
 
    if (!companyData) {
      throw new Error('Company not found');
    }

    return {
      terms: companyData.terms??'',
      policy: companyData.policy??'',
    };
  } catch (error) {
    console.error("Error fetching company terms and policy:", error);
    throw error;
  }
};