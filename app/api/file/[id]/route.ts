import { type NextRequest, NextResponse } from "next/server"
import { getFileById } from "@/lib/file-utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    const file = await getFileById(id)

    if (!file) {
      console.error(`File not found with ID: ${id}`)
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    return NextResponse.json({ file })
  } catch (error) {
    console.error("Error fetching file:", error)
    return NextResponse.json({ error: "Failed to fetch file" }, { status: 500 })
  }
}
