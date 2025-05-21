import { type NextRequest, NextResponse } from "next/server"
import { saveFile } from "@/lib/file-utils"
import fs from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { type, title, aiTool, model, htmlCode } = data

    console.log("Received upload request:", {
      type,
      title,
      aiTool,
      model,
      contentLength: htmlCode?.length || 0,
    })

    if (!type || !title || !aiTool || !model || !htmlCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (type !== "apps" && type !== "games") {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }

    // Ensure directories exist
    const dirPath = path.join(process.cwd(), "public", type)
    if (!fs.existsSync(dirPath)) {
      console.log(`Creating directory: ${dirPath}`)
      fs.mkdirSync(dirPath, { recursive: true })
    }

    const success = await saveFile(type, title, aiTool, model, htmlCode)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Failed to save file" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to upload file",
      },
      { status: 500 },
    )
  }
}
