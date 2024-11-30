"use client";

import { useState } from "react";
import { getSignedURL } from "@/actions/s3/signedURL";
import { deleteObject } from "@/actions/s3/deleteObject";

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    // Get signed URL directly
    const response = await getSignedURL({
      fileType: file.type,
      fileSize: file.size,
      checksum: "", // Provide checksum if needed
    });

    if (response.error) {
      console.error(response.error);
      return;
    }

    const { url } = response.success!;

    // Upload the file to S3 using PUT
    const upload = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
        "Content-Length": file.size.toString(),
        // ...any other required headers...
      },
      body: file,
    });

    if (upload.ok) {
      console.log("File uploaded successfully");
      const uploadedUrl = url.split("?")[0];
      console.log(`You can access the file at: ${uploadedUrl}`);
      setFileUrl(uploadedUrl);
    } else {
      console.error("Upload failed.");
    }
  };

  const handleDelete = async () => {
    if (!fileUrl) return;

    await deleteObject(fileUrl);
    setFileUrl(null);
    setFile(null);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="rounded bg-white p-6 shadow-md">
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-4 border p-2"
        />
        <button
          onClick={handleUpload}
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          Upload
        </button>

        {fileUrl && (
          <div className="mt-6">
            {file && file.type.startsWith("image/") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={fileUrl}
                alt="Uploaded file"
                className="h-auto max-w-full"
              />
            ) : (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {file?.name}
              </a>
            )}
            <button
              onClick={handleDelete}
              className="mt-4 rounded bg-red-500 px-4 py-2 text-white"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
