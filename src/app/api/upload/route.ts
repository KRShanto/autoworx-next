import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import { nanoid } from "nanoid";
const pump = promisify(pipeline);

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const fileNames = [];

    // Ensure the uploads directory exists
    const uploadsDir = "public/uploads/";
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const formData = await req.formData();
    const photos = formData.getAll("photos") as File[];

    for (const photo of photos) {
      const fileName = `${nanoid()}-${photo.name}`;
      const filePath = `${uploadsDir}${fileName}`;
      fileNames.push(fileName);

      // Create a write stream to the destination file
      const writeStream = fs.createWriteStream(filePath);

      // Pipe the file stream to the write stream
      await pump(photo.stream() as any, writeStream);
    }

    return NextResponse.json({ status: "success", data: fileNames });
  } catch (e) {
    return NextResponse.json({ status: "fail", data: e });
  }
}
