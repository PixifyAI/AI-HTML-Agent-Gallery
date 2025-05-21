import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

interface Comment {
  id: string
  itemId: string
  author: string
  content: string
  createdAt: string
}

// Path to comments JSON file
const commentsFilePath = path.join(process.cwd(), "data", "comments.json")

// Ensure the data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Get all comments
const getComments = (): Comment[] => {
  ensureDataDir()

  if (!fs.existsSync(commentsFilePath)) {
    fs.writeFileSync(commentsFilePath, JSON.stringify([]), "utf-8")
    return []
  }

  const commentsData = fs.readFileSync(commentsFilePath, "utf-8")
  return JSON.parse(commentsData)
}

// Save comments
const saveComments = (comments: Comment[]) => {
  ensureDataDir()
  fs.writeFileSync(commentsFilePath, JSON.stringify(comments, null, 2), "utf-8")
}

// GET handler - fetch comments for an item
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get("itemId")

    if (!itemId) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 })
    }

    const allComments = getComments()
    const itemComments = allComments.filter((comment) => comment.itemId === itemId)

    // Sort by date (newest first)
    itemComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ comments: itemComments })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

// POST handler - add a new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { itemId, author, content } = body

    if (!itemId || !content) {
      return NextResponse.json({ error: "Item ID and content are required" }, { status: 400 })
    }

    const allComments = getComments()

    // Create new comment
    const newComment: Comment = {
      id: uuidv4(),
      itemId,
      author: author || "Anon",
      content,
      createdAt: new Date().toISOString(),
    }

    // Add to comments array
    allComments.push(newComment)

    // Save to file
    saveComments(allComments)

    return NextResponse.json({ success: true, comment: newComment })
  } catch (error) {
    console.error("Error adding comment:", error)
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
  }
}
