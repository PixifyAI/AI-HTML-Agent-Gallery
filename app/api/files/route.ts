import { type NextRequest, NextResponse } from "next/server"
import { getApps, getGames } from "@/lib/file-utils"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")

  try {
    if (type === "apps") {
      const apps = await getApps()
      return NextResponse.json({ items: apps })
    } else if (type === "games") {
      const games = await getGames()
      return NextResponse.json({ items: games })
    } else {
      return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error fetching files:", error)
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 })
  }
}
