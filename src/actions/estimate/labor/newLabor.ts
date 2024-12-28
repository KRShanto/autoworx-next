"use server";

import { db } from "@/lib/db";
import { auth } from "@/app/auth";
import { AuthSession } from "@/types/auth";
import { ServerAction } from "@/types/action";
import { Tag } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { laborCreateValidationSchema } from "@/validations/schemas/estimate/labor/labor.validation";
import { errorHandler } from "@/error-boundary/globalErrorHandler";
import { TErrorHandler } from "@/types/globalError";

export async function newLabor({
  name,
  categoryId,
  tags,
  notes,
  hours,
  charge,
  discount,
  cannedLabor,
}: {
  name: string;
  categoryId?: number;
  tags?: Tag[];
  notes?: string;
  hours?: number;
  charge?: number;
  discount?: number;
  cannedLabor?: boolean;
}): Promise<ServerAction | TErrorHandler> {
  try {
    const session = (await auth()) as AuthSession;
    const companyId = session?.user?.companyId;

    const validatedLaborData = await laborCreateValidationSchema.parseAsync({
      name,
      categoryId,
      tags,
      notes,
      hours,
      charge,
      discount,
    });

    const newLabor = await db.labor.create({
      data: {
        name: validatedLaborData.name,
        categoryId: validatedLaborData.categoryId,
        notes: validatedLaborData.notes,
        hours: validatedLaborData.hours,
        charge: validatedLaborData.charge,
        discount: validatedLaborData.discount,
        companyId: companyId,
        cannedLabor: validatedLaborData.cannedLabor,
      },
    });

    // create labor tags
    if (tags) {
      await Promise.all(
        tags.map((tag) =>
          db.laborTag.create({
            data: {
              laborId: newLabor.id,
              tagId: tag.id,
            },
          }),
        ),
      );
    }

    const newLaborTags = await db.laborTag.findMany({
      where: {
        laborId: newLabor.id,
      },
      include: {
        tag: true,
      },
    });

    revalidatePath("/estimate");

    return {
      type: "success",
      data: {
        ...newLabor,
        tags: newLaborTags.map((tag) => tag.tag),
      },
    };
  } catch (error) {
    return errorHandler(error);
  }
}
