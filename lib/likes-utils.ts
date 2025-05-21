import fs from "fs"
import path from "path"

interface Like {
  itemId: string
  count: number
}

// Path to likes JSON file
const likesFilePath = path.join(process.cwd(), "data", "likes.json")

// Ensure the data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Get all likes
export const getLikes = (): Record<string, number> => {
  ensureDataDir()

  if (!fs.existsSync(likesFilePath)) {
    fs.writeFileSync(likesFilePath, JSON.stringify({}), "utf-8")
    return {}
  }

  const likesData = fs.readFileSync(likesFilePath, "utf-8")
  return JSON.parse(likesData)
}

// Save likes
export const saveLikes = (likes: Record<string, number>) => {
  ensureDataDir()
  fs.writeFileSync(likesFilePath, JSON.stringify(likes, null, 2), "utf-8")
}

// Add a like to an item
export const addLike = (itemId: string): number => {
  const likes = getLikes()

  if (!likes[itemId]) {
    likes[itemId] = 0
  }

  likes[itemId]++
  saveLikes(likes)

  return likes[itemId]
}

// Get likes for a specific item
export const getLikesForItem = (itemId: string): number => {
  const likes = getLikes()
  return likes[itemId] || 0
}

// Get likes for multiple items
export const getLikesForItems = (itemIds: string[]): Record<string, number> => {
  const likes = getLikes()
  const result: Record<string, number> = {}

  itemIds.forEach((id) => {
    result[id] = likes[id] || 0
  })

  return result
}
