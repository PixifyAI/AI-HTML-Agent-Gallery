import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Define the base directory for public files
const PUBLIC_DIR = path.join(process.cwd(), "public");

export async function POST(request: Request) {
  try {
    const { htmlContent, fileName, type } = await request.json();

    if (!htmlContent || !fileName || !type) {
      return NextResponse.json(
        { error: "Missing htmlContent, fileName, or type." },
        { status: 400 }
      );
    }

    if (type !== "apps" && type !== "games") {
      return NextResponse.json(
        { error: "Invalid type. Must be 'apps' or 'games'." },
        { status: 400 }
      );
    }

    // Sanitize fileName to prevent directory traversal and ensure it's a valid name
    const sanitizedFileName = path.basename(fileName);
    if (!sanitizedFileName || sanitizedFileName === "." || sanitizedFileName === "..") {
        return NextResponse.json({ error: "Invalid file name." }, { status: 400 });
    }
    if (!sanitizedFileName.endsWith(".html")) {
        return NextResponse.json({ error: "File name must end with .html" }, { status: 400 });
    }


    const targetDir = path.join(PUBLIC_DIR, type);
    const filePath = path.join(targetDir, sanitizedFileName);

    // Ensure the target directory exists
    try {
      await fs.mkdir(targetDir, { recursive: true });
    } catch (mkdirError) {
      console.error(`Error creating directory ${targetDir}:`, mkdirError);
      return NextResponse.json(
        { error: `Could not create directory: ${(mkdirError as Error).message}` },
        { status: 500 }
      );
    }

    // Write the file
    try {
      await fs.writeFile(filePath, htmlContent, "utf8");
    } catch (writeFileError) {
      console.error(`Error writing file ${filePath}:`, writeFileError);
      return NextResponse.json(
        { error: `Could not save HTML file: ${(writeFileError as Error).message}` },
        { status: 500 }
      );
    }
    
    // After saving, update the list of files for the gallery if necessary
    // This might involve re-reading the directory or updating a manifest file.
    // For now, we'll just return success.
    // Example: Trigger a re-scan or update a JSON file listing all gallery items.
    // This part depends on how the gallery items are populated.

    return NextResponse.json({
      message: `File "${sanitizedFileName}" saved successfully to ${type} folder.`,
      filePath: `/${type}/${sanitizedFileName}`, // Path relative to public for client-side linking
    });

  } catch (error) {
    console.error("Error in save-html API:", error);
    return NextResponse.json(
      { error: "Failed to save HTML file." },
      { status: 500 }
    );
  }
}
