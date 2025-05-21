import { type NextRequest, NextResponse } from "next/server"
import { addLike, getLikes, getLikesForItem } from "@/lib/likes-utils"

// GET handler - fetch likes for an item or all likes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get("itemId")

    if (itemId) {
      const likes = getLikesForItem(itemId)
      return NextResponse.json({ likes })
    } else {
      const likes = getLikes()
      return NextResponse.json({ likes })
    }
  } catch (error) {
    console.error("Error fetching likes:", error)
    return NextResponse.json({ error: "Failed to fetch likes" }, { status: 500 })
  }
}

// POST handler - add a like to an item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { itemId } = body

    if (!itemId) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 })
    }

    const newLikeCount = addLike(itemId)
    return NextResponse.json({ success: true, likes: newLikeCount })
  } catch (error) {
    console.error("Error adding like:", error)
    return NextResponse.json({ error: "Failed to add like" }, { status: 500 })
  }
}
