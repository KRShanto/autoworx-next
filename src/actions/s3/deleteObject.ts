"use server";

import { s3Client } from "@/lib/s3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function deleteObject(url: string) {
  try {
    const key = url.split("/").slice(-1)[0];

    const deleteParams = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    };

    return await s3Client.send(new DeleteObjectCommand(deleteParams));
  } catch (e) {
    console.error(e);
  }
}
