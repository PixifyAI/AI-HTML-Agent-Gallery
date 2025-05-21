"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { BrainCircuit, ClipboardCopy, Eye } from "lucide-react"; // Added Eye icon

const GEMINI_MODELS = [
  "gemini-2.5-flash-preview-04-17",
  "gemini-1.5-flash-latest", // Default in backend, ensure consistency or make configurable
  "gemini-1.5-pro-latest",
  // Add other models if you prefer, but the original list had some preview/older versions
  // For simplicity, I'll use the common ones. Adjust as per your access & preference.
   "gemini-2.5-pro-preview-05-06",
   "gemini-2.0-flash",
   "gemini-2.0-flash-lite",
];

const SYSTEM_PROMPT =
  "You are an expert web developer. Your task is to generate a complete, single-file HTML document for an app or game. The HTML file should include all necessary HTML, CSS, and JavaScript code. Use modern web technologies and best practices. The output should be only the HTML code, starting with <!DOCTYPE html> and ending with </html>. If you are given previous HTML code and a request to modify it, you MUST modify the provided HTML code and not start from scratch. Ensure the entire modified HTML is returned. ONLY USE HTML, CSS AND JAVASCRIPT. If you want to use ICON make sure to import the library first. Try to create the best UI possible by using only HTML, CSS and JAVASCRIPT. Use as much as you can TailwindCSS for the CSS, if you can't do something with TailwindCSS, then use custom CSS . Also, try to ellaborate as much as you can, to create something unique. ALWAYS GIVE THE RESPONSE INTO A SINGLE HTML FILE";

export default function CreatePage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState(GEMINI_MODELS[0]);
  const [generatedHtml, setGeneratedHtml] = useState(""); // Stores the latest AI-generated HTML for iteration
  const [previewHtmlContent, setPreviewHtmlContent] = useState(""); // HTML content for the preview iframe
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState<"apps" | "games">("apps");
  const [previewKey, setPreviewKey] = useState(0);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: "Copied!", description: "HTML code copied to clipboard." });
    }).catch(err => {
      console.error("Failed to copy text: ", err);
      toast({ title: "Error", description: "Failed to copy code.", variant: "destructive" });
    });
  };

  const handlePreviewSpecificVersion = (htmlContent: string) => {
    setPreviewHtmlContent(htmlContent);
    setPreviewKey(prevKey => prevKey + 1); // Force iframe refresh
    toast({ title: "Preview Updated", description: "Displaying selected HTML version in preview." });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessageContent = inputMessage;
    const newMessages = [...messages, { role: "user", content: userMessageContent }];
    setMessages(newMessages);
    setInputMessage("");
    setIsLoading(true);

    const requestBody: {
      model: string;
      prompt: string;
      systemInstruction: string;
      previousHtml?: string;
    } = {
      model: selectedModel,
      prompt: userMessageContent,
      systemInstruction: SYSTEM_PROMPT,
    };

    if (generatedHtml) { // Use the latest fully generated HTML for iteration
      requestBody.previousHtml = generatedHtml;
    }

    try {
      const response = await fetch("/api/gemini-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response from AI");
      }

      const data = await response.json();
      const aiResponse = data.html;

      setMessages([...newMessages, { role: "assistant", content: aiResponse }]);
      setGeneratedHtml(aiResponse); // Update the latest generated HTML
      setPreviewHtmlContent(aiResponse); // Set the preview to this new HTML
      setPreviewKey(prevKey => prevKey + 1);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      toast({
        title: "Error",
        description: (error as Error).message || "Could not generate HTML.",
        variant: "destructive",
      });
      if (messages[messages.length - 1]?.role !== 'assistant' || !messages[messages.length - 1]?.content.startsWith("<!doctype html")) {
        setMessages([
          ...newMessages,
          { role: "assistant", content: `Error: ${(error as Error).message}` },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToGallery = async () => {
    // "Add to Gallery" should always save the LATEST generatedHtml,
    // not necessarily what's in previewHtmlContent if the user is viewing an old version.
    if (!generatedHtml || !fileName.trim()) {
      toast({
        title: "Error",
        description: "No HTML generated or file name is missing. Gallery saves the latest version.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/save-html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          htmlContent: generatedHtml, // Save the latest version
          fileName: fileName.endsWith(".html") ? fileName : `${fileName}.html`,
          type: fileType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save HTML file.");
      }

      const result = await response.json();
      toast({
        title: "Success",
        description: result.message,
      });
      setFileName("");
    } catch (error) {
      console.error("Error saving HTML file:", error);
      toast({
        title: "Error",
        description: (error as Error).message || "Could not save HTML file.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-4 h-[calc(100vh-80px)]">
      {/* Left Panel: Chat and Controls */}
      <div className="md:w-1/2 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Create with HTMLAgent
          </h1>
        </div>

        <div className="flex-grow flex flex-col gap-4 p-4 border rounded-lg shadow-sm bg-card min-h-0">
          <div className="flex-grow overflow-y-auto space-y-2 p-2 bg-muted rounded-md min-h-0">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-[80%] w-full flex flex-col ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground self-end ml-auto"
                    : "bg-secondary text-secondary-foreground self-start"
                }`}
              >
                {msg.role === "assistant" && msg.content.trim().toLowerCase().startsWith("<!doctype html") ? (
                  <>
                    <div className="self-end mb-1 flex items-center">
                      <Button
                        onClick={() => handlePreviewSpecificVersion(msg.content)}
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 mr-1"
                        title="Preview this version"
                      >
                        <Eye className="h-4 w-4 mr-1" /> Preview
                      </Button>
                      <Button
                        onClick={() => copyToClipboard(msg.content)}
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2"
                        title="Copy HTML"
                      >
                        <ClipboardCopy className="h-4 w-4 mr-1" /> Copy
                      </Button>
                    </div>
                    <div className="max-h-32 overflow-y-auto border rounded bg-background p-2">
                      <textarea
                        readOnly
                        className="w-full text-sm font-mono p-2 bg-background border rounded resize-none text-muted-foreground focus:outline-none"
                        value={msg.content}
                        rows={10} // Added a default number of rows for better initial display
                      />
                    </div>
                  </>
                ) : (
                  <pre className="whitespace-pre-wrap break-words">{msg.content}</pre>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="p-2 rounded-lg bg-secondary text-secondary-foreground self-start animate-pulse">
                Generating...
              </div>
            )}
          </div>

          <div className="flex gap-2 items-center">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Describe the App or Game Idea to create... then add your Updates or Changes..."
              rows={2}
              className="flex-grow"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
              Send
            </Button>
          </div>
        </div>
        
        <div className="p-4 border rounded-lg shadow-sm bg-card">
          <Label htmlFor="model-select">Select AI Model:</Label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger id="model-select" className="w-full mt-1">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {GEMINI_MODELS.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Right Panel: Preview and Save */}
      <div className="md:w-1/2 flex flex-col gap-4">
        <div className="flex-grow border rounded-lg shadow-sm bg-card p-4 flex flex-col">
          <h2 className="text-xl font-semibold mb-2">HTML Preview</h2>
          <div className="flex-grow border rounded bg-muted">
            {previewHtmlContent ? ( // Use previewHtmlContent for the iframe
              <iframe
                key={previewKey}
                srcDoc={previewHtmlContent}
                title="HTML Preview"
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Preview will appear here
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border rounded-lg shadow-sm bg-card flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Add to Gallery</h2>
          <div>
            <Label htmlFor="fileName">File Name (e.g., my-game.html):</Label>
            <Input
              id="fileName"
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="my-cool-app.html"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="fileType">Type:</Label>
            <Select
              value={fileType}
              onValueChange={(value: "apps" | "games") => setFileType(value)}
            >
              <SelectTrigger id="fileType" className="w-full mt-1">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apps">App</SelectItem>
                <SelectItem value="games">Game</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleAddToGallery} 
            disabled={!generatedHtml || !fileName.trim() || isLoading} // Still depends on generatedHtml
          >
            Add to Gallery
          </Button>
        </div>
      </div>
    </div>
  );
}
