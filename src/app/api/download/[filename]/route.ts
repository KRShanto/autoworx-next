import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } },
) {
  try {
    const filePath = path.join(
      process.cwd(),
      "images/uploads",
      params.filename,
    );
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Disposition": `attachment; filename="${params.filename}"`,
        },
      });
    } else {
      return new NextResponse("file not found", { status: 404 });
    }
  } catch (err) {
    return new NextResponse("server error", { status: 500 });
  }
}
