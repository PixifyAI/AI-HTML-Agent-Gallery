"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Heart, SortAsc } from "lucide-react"

interface SortControlsProps {
  onSortChange: (sortBy: string) => void
  className?: string
}

export default function SortControls({ onSortChange, className = "" }: SortControlsProps) {
  const [activeSort, setActiveSort] = useState<string>("date")

  const handleSortChange = (value: string) => {
    setActiveSort(value)
    onSortChange(value)
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-slate-400 mr-1 hidden sm:inline">Sort by:</span>
      <Select value={activeSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[140px] h-9">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Newest</span>
            </div>
          </SelectItem>
          <SelectItem value="likes">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span>Most Liked</span>
            </div>
          </SelectItem>
          <SelectItem value="title">
            <div className="flex items-center gap-2">
              <SortAsc className="h-4 w-4" />
              <span>Title (A-Z)</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
