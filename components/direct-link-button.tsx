"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import type { FileItem } from "@/lib/file-utils"

interface DirectLinkButtonProps {
  item: FileItem
}

export default function DirectLinkButton({ item }: DirectLinkButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="absolute top-4 right-4 z-10 bg-slate-800/80 hover:bg-slate-700"
      onClick={(e) => {
        e.stopPropagation()
        window.open(item.fullUrl, "_blank")
      }}
    >
      <ExternalLink className="h-4 w-4 mr-1" />
      Open Directly
    </Button>
  )
}
