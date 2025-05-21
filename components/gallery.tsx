"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { FileItem } from "@/lib/file-utils"
import ItemModal from "./item-modal"
import { Calendar, Code2, Cpu, ExternalLink, Heart } from "lucide-react"
import { Button } from "./ui/button"
import LikeButton from "./like-button"
import SortControls from "./sort-controls"
import { Input } from "./ui/input" // Import Input component

interface GalleryProps {
  items: FileItem[]
  type: "app" | "game" | "all"
}

export default function Gallery({ items, type }: GalleryProps) {
  const [selectedItem, setSelectedItem] = useState<FileItem | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("") // Add state for search term
  const [filteredItems, setFilteredItems] = useState<FileItem[]>(items) // State for filtered items
  const [sortedItems, setSortedItems] = useState<FileItem[]>(items)
  const [sortBy, setSortBy] = useState<string>("date")

  useEffect(() => {
    // Filter items based on search term
    const filtered = items.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.aiTool.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredItems(filtered)
  }, [items, searchTerm]) // Re-filter when items or search term changes

  useEffect(() => {
    sortItems(sortBy, filteredItems) // Sort filtered items
  }, [filteredItems, sortBy]) // Re-sort when filtered items or sort criteria changes


  const sortItems = (sortType: string, itemsToSort: FileItem[]) => {
    const sorted = [...itemsToSort]

    switch (sortType) {
      case "likes":
        sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0))
        break
      case "title":
        sorted.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "date":
      default:
        sorted.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
        break
    }

    setSortedItems(sorted)
  }

  const handleLike = (itemId: string, newCount: number) => {
    // Update the likes count in the local state
    const updatedItems = sortedItems.map((item) => (item.id === itemId ? { ...item, likes: newCount } : item))
    setSortedItems(updatedItems)
  }

  return (
    <>
      <div className="mb-6 flex justify-between items-center"> {/* Adjusted flex justify */}
        <Input
          type="text"
          placeholder={`Search ${type === 'all' ? 'items' : type + 's'}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <SortControls onSortChange={setSortBy} />
      </div>

      {sortedItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">
            {type === "all"
              ? "No items found. Add HTML files to the apps or games folders to see them here."
              : `No ${type}s found. Add HTML files to the ${type}s folder to see them here.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedItems.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden bg-slate-800 border-slate-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <div className="relative h-48 overflow-hidden bg-slate-900">
                {/* Live preview iframe */}
                <iframe
                  src={item.fullUrl}
                  title={item.title}
                  className="pointer-events-none"
                  style={{
                    width: '800px', // Set a larger intrinsic width
                    height: '600px', // Set a larger intrinsic height
                    transform: 'scale(0.61)', // Scale down to fit the container height (48px / 600px)
                    transformOrigin: '0 0', // Scale from the top-left corner
                    overflow: 'hidden' // Hide scrollbars
                  }}
                  sandbox="allow-scripts allow-same-origin" // Adjust sandbox attributes as needed for security
                ></iframe>

                {/* Action buttons */}
                <div className="absolute top-2 right-2 flex gap-2 z-10"> {/* Added z-10 to ensure buttons are above iframe */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-slate-800/80 hover:bg-slate-700 h-8 px-2"
                    onClick={(e) => {
                      e.stopPropagation() // Prevent card click
                      window.open(item.fullUrl, "_blank")
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    <span className="text-xs">Open</span>
                  </Button>
                </div>

                {/* Like button */}
                <div className="absolute bottom-2 right-2 z-10"> {/* Added z-10 to ensure button is above iframe */}
                  <LikeButton
                    itemId={item.id}
                    initialLikes={item.likes || 0}
                    onLike={(newCount) => handleLike(item.id, newCount)}
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                  <div className="flex items-center text-pink-400 text-sm">
                    <Heart className="h-4 w-4 mr-1 fill-pink-400" />
                    <span>{item.likes || 0}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className="bg-slate-700 text-purple-300 border-purple-500">
                    <Cpu className="w-3 h-3 mr-1" />
                    {item.aiTool}
                  </Badge>
                  <Badge variant="outline" className="bg-slate-700 text-blue-300 border-blue-500">
                    <Code2 className="w-3 h-3 mr-1" />
                    {item.model}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-slate-400 border-t border-slate-700 pt-3">
                <Calendar className="w-3 h-3 mr-1" /> Added {item.dateAdded}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {selectedItem && <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </>
  )
}
