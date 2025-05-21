"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Upload } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AddFileButtonProps {
  type: "apps" | "games"
  className?: string
}

export default function AddFileButton({ type, className }: AddFileButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [aiTool, setAiTool] = useState("")
  const [model, setModel] = useState("")
  const [htmlCode, setHtmlCode] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!title || !aiTool || !model || (!htmlCode && !uploadedFile)) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      let fileContent = htmlCode

      // If a file was uploaded, read its contents
      if (uploadedFile) {
        fileContent = await readFileAsText(uploadedFile)
      }

      console.log("Submitting file:", {
        type,
        title,
        aiTool,
        model,
        contentLength: fileContent.length,
      })

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          title,
          aiTool,
          model,
          htmlCode: fileContent,
        }),
      })

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success!",
          description: `Your ${type === "apps" ? "app" : "game"} has been added to the gallery.`,
        })

        // Reset form
        setTitle("")
        setAiTool("")
        setModel("")
        setHtmlCode("")
        setUploadedFile(null)
        setIsOpen(false)

        // Refresh the page to show the new file
        window.location.reload()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to upload file",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string)
        } else {
          reject(new Error("Failed to read file"))
        }
      }
      reader.onerror = () => reject(reader.error)
      reader.readAsText(file)
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type === "text/html" || file.name.endsWith(".html")) {
        setUploadedFile(file)
        // Try to extract title from filename if not set
        if (!title) {
          const fileName = file.name.replace(".html", "")
          setTitle(fileName)
        }
        toast({
          title: "File selected",
          description: `${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
        })
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an HTML file",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className={className} variant="outline" size="sm">
        <Plus className="h-4 w-4 mr-1" /> Add {type === "apps" ? "App" : "Game"}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New {type === "apps" ? "App" : "Game"}</DialogTitle>
            <DialogDescription>
              Add a single-file HTML {type === "apps" ? "app" : "game"} to the gallery. The file will be automatically
              added to the {type} section.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload File</TabsTrigger>
              <TabsTrigger value="paste">Paste Code</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4 pt-4">
              <div className="grid gap-4">
                <Label htmlFor="file-upload">HTML File</Label>
                <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center">
                  <Input id="file-upload" type="file" accept=".html" onChange={handleFileChange} className="hidden" />
                  <label htmlFor="file-upload" className="flex flex-col items-center justify-center cursor-pointer">
                    <Upload className="h-10 w-10 text-slate-400 mb-2" />
                    <span className="text-sm font-medium">
                      {uploadedFile ? uploadedFile.name : "Click to upload or drag and drop"}
                    </span>
                    <span className="text-xs text-slate-500 mt-1">HTML files only</span>
                  </label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="paste" className="space-y-4 pt-4">
              <div>
                <Label htmlFor="html-code">HTML Code</Label>
                <Textarea
                  id="html-code"
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  placeholder="Paste your single-file HTML code here..."
                  className="font-mono text-sm h-64"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`My AI ${type === "apps" ? "App" : "Game"}`}
                  required
                />
              </div>

              <div>
                <Label htmlFor="ai-tool">
                  AI Tool <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ai-tool"
                  value={aiTool}
                  onChange={(e) => setAiTool(e.target.value)}
                  placeholder="e.g., Claude, Copilot, Gemini"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="model">
                Model <span className="text-red-500">*</span>
              </Label>
              <Input
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g., GPT-4o, Gemini 1.5 Pro"
                required
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Note: The first line will be automatically updated with the AI tool and model information.
            </p>
          </div>

          <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Adding..." : `Add ${type === "apps" ? "App" : "Game"}`}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
