"use server"

import {db} from "@/lib/db";

 export const saveInvoiceTag=async(invoiceId:string,tagId:number)=>{

    try{
        const result=await db.invoiceTags.create({
            data:{
                invoiceId:invoiceId,
                tagId:tagId
            }
        })
        return result;
    }catch(error)
    {
        console.log("Invoice tag model saving error",error)
        throw new Error("Invoice tag model");
    }


};

export const removeInvoiceTag=async(invoiceId:string,tagId:number)=>{
    try {
        const result = await db.invoiceTags.deleteMany({
          where: {
            invoiceId: invoiceId,
            tagId: tagId,
          },
        });
        return result;
      } catch (error) {
        console.error("Error removing tag:", error);
        throw new Error("Failed to remove tag");
      }
    };