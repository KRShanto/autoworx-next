"use server";

import { auth } from "@/app/auth";
import { s3Client } from "@/lib/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

// 50mb
const maxFileSize = 50 * 1024 * 1024;

// Generate a random file name
const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

type SignedURLResponse = Promise<
  | { error?: undefined; success: { url: string } }
  | { error: string; success?: undefined }
>;

type GetSignedURLParams = {
  fileType: string;
  fileSize: number;
  checksum: string;
};

/**
 * Generates a signed URL for uploading a file to S3.
 *
 * @param {GetSignedURLParams} params - The parameters for generating the signed URL.
 * @param {string} params.fileType - The MIME type of the file.
 * @param {number} params.fileSize - The size of the file in bytes.
 * @param {string} params.checksum - The SHA256 checksum of the file.
 * @returns {SignedURLResponse} - The signed URL or an error message.
 */
export async function getSignedURL({
  fileType,
  fileSize,
  checksum,
}: GetSignedURLParams): Promise<SignedURLResponse> {
  // Authenticate the user
  const session = await auth();

  // Check if the user is authenticated
  if (!session) {
    return { error: "not authenticated" };
  }

  // Check if the file size exceeds the maximum allowed size
  if (fileSize > maxFileSize) {
    return { error: "File size too large" };
  }

  // Generate a random file name
  const fileName = generateFileName();

  // Create a command to put the object in the S3 bucket
  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileName,
    ContentType: fileType,
    ContentLength: fileSize,
    ChecksumSHA256: checksum,
  });

  // Generate a signed URL for the put object command
  const url = await getSignedUrl(
    s3Client,
    putObjectCommand,
    { expiresIn: 60 }, // URL expires in 60 seconds
  );

  return { success: { url } };
}
