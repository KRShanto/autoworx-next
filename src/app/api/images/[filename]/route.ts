import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";
export async function GET(
  req: Request,
  { params }: { params: { filename: string } },
) {
  const { filename } = params;
  const filePath = path.join(process.cwd(), "images/uploads", filename);
  if (fs.existsSync(filePath)) {
    const ext = path.extname(filename).toLowerCase();
    let contentType = "image/jpeg"; // Default to JPEG
    if (ext === ".png") contentType = "image/png";
    if (ext === ".gif") contentType = "image/gif";
    return new NextResponse(fs.readFileSync(filePath), {
      headers: { "Content-Type": contentType },
      status: 200,
    });
  } else {
    return new NextResponse("", {
      headers: { "Content-Type": "image/jpeg" },
      status: 404,
    });
  }
}
