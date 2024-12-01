import { NextRequest, NextResponse } from "next/server";
// import fs from "fs";
// import { pipeline } from "stream";
// import { promisify } from "util";
// import { nanoid } from "nanoid";
import path from "path";
// import { isImageFile } from "@/utils/isImageFile";
import { getSignedURL } from "@/actions/s3/signedURL";
import { deleteObject } from "@/actions/s3/deleteObject";
// const pump = promisify(pipeline);

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const fileNames = [];

    // Ensure the uploads directory exists
    const uploadsDir = path.join(process.cwd(), "images/uploads/");
    // if (!fs.existsSync(uploadsDir)) {
    //   fs.mkdirSync(uploadsDir, { recursive: true });
    // }

    const formData = await req.formData();
    const files = formData.getAll("photos") as File[];
    for (const file of files) {
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
        console.log({ url });
        const uploadedUrl = url.split("?")[0];
        console.log(`You can access the file at: ${uploadedUrl}`);
        fileNames.push(uploadedUrl);
      } else {
        console.error("Upload failed.");
      }
      // const imagesNameSplit = file.name.split(".");
      // const imageFormate = imagesNameSplit[imagesNameSplit.length - 1];
      // const fileName = isImageFile(file)
      //   ? `${nanoid()}-AWX-image.${imageFormate}`
      //   : `${nanoid()}-AWX-file.${imageFormate}`;
      // const filePath = path.join(uploadsDir, fileName);

      // Create a write stream to the destination file
      // const writeStream = fs.createWriteStream(filePath);
      // Pipe the file stream to the write stream
      // await pump(file.stream() as any, writeStream);
    }

    return NextResponse.json({ status: "success", data: fileNames });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ status: "fail", data: e });
  }
}

// Delete the file
export async function DELETE(req: NextRequest, res: NextResponse) {
  try {
    const json = await req.json();
    let { filePath } = json;
    // const newPath = path.join(process.cwd(), `images/uploads/${filePath}`);

    // // Ensure the file exists
    // if (fs.existsSync(newPath)) {
    //   fs.unlinkSync(newPath);
    // }
    const res = await deleteObject(filePath);
    if (res?.DeleteMarker) {
      return NextResponse.json({ status: "success" });
    }

    return NextResponse.json({ status: "fail", data: "File not found" });
  } catch (e) {
    return NextResponse.json({ status: "fail", data: e });
  }
}
