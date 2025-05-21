"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { FileItem } from "@/lib/file-utils"
import { Maximize2, Minimize2, Code, Play, ExternalLink, Download, MessageSquare } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import CommentSection from "./comment-section"
import LikeButton from "./like-button"

interface ItemModalProps {
  item: FileItem
  onClose: () => void
}

export default function ItemModal({ item, onClose }: ItemModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { toast } = useToast()

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const downloadHtml = () => {
    const blob = new Blob([item.sourceCode], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${item.title}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Download started",
      description: `${item.title}.html is being downloaded`,
    })
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`p-0 gap-0 pr-8 ${isFullscreen ? "max-w-[100vw] h-[100vh] rounded-none" : "max-w-4xl"}`}> {/* Added pr-8 for right padding */}
        <DialogHeader className="p-4 bg-slate-800 border-b border-slate-700 flex flex-col">
          <div className="flex justify-between items-start">
            <DialogTitle className="text-xl font-bold text-white">{item.title}</DialogTitle>
            <div> {/* Removed ml-4 as it's no longer needed with padding */}
              <LikeButton itemId={item.id} initialLikes={item.likes || 0} size="sm" />
            </div>
          </div>
          <div className="flex gap-2 mt-1">
            <Badge variant="outline" className="bg-slate-700 text-purple-300">
              {item.aiTool}
            </Badge>
            <Badge variant="outline" className="bg-slate-700 text-blue-300">
              {item.model}
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex justify-end p-2 bg-slate-800 border-b border-slate-700">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(item.fullUrl, "_blank")}
              className="flex items-center gap-1"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Open</span>
            </Button>
            <Button variant="outline" size="sm" onClick={downloadHtml} className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="code" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-b border-slate-700 rounded-none">
            <TabsTrigger value="code" className="flex items-center gap-1">
              <Code className="h-4 w-4" /> Source Code
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-1">
              <Play className="h-4 w-4" /> Preview Link
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" /> Comments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="code" className="m-0 p-0">
            <div className={`overflow-y-auto w-full bg-slate-900 ${isFullscreen ? "h-[calc(100vh-160px)]" : "h-[60vh]"}`}> {/* Changed overflow-x-auto to overflow-y-auto */}
              <pre className="p-4 text-sm whitespace-pre-wrap break-words max-w-full" style={{ wordBreak: 'break-all' }}> {/* Added max-w-full and wordBreak style */}
                <code className="language-html">{item.sourceCode}</code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="m-0 p-0">
            <iframe
              src={item.fullUrl}
              title={item.title}
              className={`w-full bg-slate-900 ${isFullscreen ? "h-[calc(100vh-160px)]" : "h-[60vh]"}`}
              sandbox="allow-scripts allow-same-origin" // Adjust sandbox attributes as needed for security
            ></iframe>
          </TabsContent>

          <TabsContent value="comments" className="m-0 p-0">
            <div className={`bg-slate-900 ${isFullscreen ? "h-[calc(100vh-160px)]" : "h-[60vh]"} overflow-y-auto`}>
              <CommentSection itemId={item.id} />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
