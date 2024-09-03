import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import { nanoid } from "nanoid";
import path from "path";
const pump = promisify(pipeline);

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const fileNames = [];

    // Ensure the uploads directory exists
    const uploadsDir = path.join(process.cwd(), "images/uploads/");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const formData = await req.formData();
    const photos = formData.getAll("photos") as File[];
    for (const photo of photos) {
      const fileName = `${nanoid()}-${photo.name}`;
      const filePath = path.join(uploadsDir, fileName);
      fileNames.push(fileName);

      // Create a write stream to the destination file
      const writeStream = fs.createWriteStream(filePath);
      // Pipe the file stream to the write stream
      await pump(photo.stream() as any, writeStream);
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
    const newPath = path.join(process.cwd(), `images/uploads/${filePath}`);

    // Ensure the file exists
    if (fs.existsSync(newPath)) {
      fs.unlinkSync(newPath);
      return NextResponse.json({ status: "success" });
    }

    return NextResponse.json({ status: "fail", data: "File not found" });
  } catch (e) {
    return NextResponse.json({ status: "fail", data: e });
  }
}
