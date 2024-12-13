"use server";

import { s3Client } from "@/lib/s3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

/**
 * Deletes an object from the S3 bucket.
 *
 * @param {string} url - The URL of the object to delete.
 * @returns {Promise<void>} - A promise that resolves when the object is deleted.
 */
export async function deleteObject(url: string) {
  try {
    // Extract the key (file name) from the URL
    const key = url.split("/").slice(-1)[0];

    // Define the parameters for the delete object command
    const deleteParams = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    };

    // Send the delete object command to S3
    return await s3Client.send(new DeleteObjectCommand(deleteParams));
  } catch (e) {
    console.error(e);
  }
}
