import fs from "fs"
import path from "path"
import { getLikesForItems } from "./likes-utils"

export interface FileItem {
  id: string
  title: string
  aiTool: string
  model: string
  dateAdded: string
  previewUrl: string
  fullUrl: string
  sourceCode: string
  likes?: number
}

// Read files from a directory
export async function readFilesFromDirectory(dirPath: string): Promise<FileItem[]> {
  const fullPath = path.join(process.cwd(), "public", dirPath)

  try {
    // Check if directory exists
    if (!fs.existsSync(fullPath)) {
      console.log(`Creating directory: ${fullPath}`)
      fs.mkdirSync(fullPath, { recursive: true })
      return []
    }

    const files = fs.readdirSync(fullPath)
    const htmlFiles = files.filter((file) => file.endsWith(".html"))

    const items: FileItem[] = []

    for (const file of htmlFiles) {
      const filePath = path.join(fullPath, file)
      const stats = fs.statSync(filePath)
      const content = fs.readFileSync(filePath, "utf-8")

      // Extract metadata from the first line comment
      const metadata = extractMetadata(content)

      // Use filename as title (without extension) if not specified in metadata
      const fileName = file.replace(".html", "")
      const title = metadata.title || fileName

      const id = Buffer.from(path.join(dirPath, file)).toString("base64")

      items.push({
        id,
        title,
        aiTool: metadata.aiTool || "Unknown",
        model: metadata.model || "Unknown",
        dateAdded: new Date(stats.birthtime).toISOString().split("T")[0],
        previewUrl: `/${dirPath}/${file}`,
        fullUrl: `/${dirPath}/${file}`,
        sourceCode: content,
      })
    }

    // Get likes for all items
    const itemIds = items.map((item) => item.id)
    const likesMap = getLikesForItems(itemIds)

    // Add likes to items
    items.forEach((item) => {
      item.likes = likesMap[item.id] || 0
    })

    return items
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error)
    return []
  }
}

// Extract metadata from the first line comment
function extractMetadata(content: string): { title?: string; aiTool?: string; model?: string } {
  const lines = content.split("\n")
  const firstLine = lines[0].trim()

  // Check if the first line is a comment with metadata
  if (firstLine.startsWith("#") || firstLine.startsWith("//") || firstLine.startsWith("<!--")) {
    // Remove comment symbols
    const cleanLine = firstLine.replace(/^#/, "").replace(/^\/\//, "").replace(/^<!--/, "").replace(/-->$/, "").trim()

    // Parse agent and model information
    const agentMatch = /Agent:([^,]+)/i.exec(cleanLine)
    const modelMatch = /Model:([^,]+)/i.exec(cleanLine)

    return {
      aiTool: agentMatch ? agentMatch[1].trim() : undefined,
      model: modelMatch ? modelMatch[1].trim() : undefined,
    }
  }

  return {}
}

// Get all apps
export async function getApps(): Promise<FileItem[]> {
  return readFilesFromDirectory("apps")
}

// Get all games
export async function getGames(): Promise<FileItem[]> {
  return readFilesFromDirectory("games")
}

// Get all items (apps and games)
export async function getAllItems(): Promise<FileItem[]> {
  const apps = await getApps()
  const games = await getGames()
  return [...apps, ...games]
}

// Get a specific file by ID
export async function getFileById(id: string): Promise<FileItem | null> {
  try {
    // Decode the ID to get the file path
    const filePath = Buffer.from(id, "base64").toString()
    const fullPath = path.join(process.cwd(), "public", filePath)

    if (!fs.existsSync(fullPath)) {
      return null
    }

    const content = fs.readFileSync(fullPath, "utf-8")
    const stats = fs.statSync(fullPath)
    const metadata = extractMetadata(content)

    // Use filename as title (without extension) if not specified in metadata
    const fileName = path.basename(filePath).replace(".html", "")
    const title = metadata.title || fileName

    const fileItem = {
      id,
      title,
      aiTool: metadata.aiTool || "Unknown",
      model: metadata.model || "Unknown",
      dateAdded: new Date(stats.birthtime).toISOString().split("T")[0],
      previewUrl: `/${filePath}`,
      fullUrl: `/${filePath}`,
      sourceCode: content,
    }

    // Get likes for this item
    const likes = getLikesForItems([id])
    return {
      ...fileItem,
      likes: likes[id] || 0,
    }
  } catch (error) {
    console.error(`Error getting file by ID ${id}:`, error)
    return null
  }
}

// Save a new file
export async function saveFile(
  type: "apps" | "games",
  title: string,
  aiTool: string,
  model: string,
  content: string,
): Promise<boolean> {
  try {
    const dirPath = path.join(process.cwd(), "public", type)

    // Create directory if it doesn't exist
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }

    // Create a filename from the title
    const fileName = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const filePath = path.join(dirPath, `${fileName}.html`)

    console.log(`Saving file to: ${filePath}`)

    // Add metadata comment to the first line if not already present
    let fileContent = content
    if (
      !content.trim().startsWith("#Agent:") &&
      !content.trim().startsWith("//Agent:") &&
      !content.trim().startsWith("<!--Agent:")
    ) {
      fileContent = `#Agent:${aiTool},Model:${model}\n${content}`
    }

    fs.writeFileSync(filePath, fileContent, "utf8")
    console.log(`File saved successfully: ${filePath}`)
    return true
  } catch (error) {
    console.error(`Error saving file:`, error)
    return false
  }
}
