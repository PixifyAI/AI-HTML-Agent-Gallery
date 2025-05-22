"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, Gamepad2, AppWindow, Github, BrainCircuit } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-green-500 to-teal-500">
                AI HTML Creative Gallery
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant={pathname === "/" ? "secondary" : "ghost"} size="sm" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>

            <Link href="/#all">
              <Button
                variant={pathname === "/#all" ? "secondary" : "ghost"}
                size="sm"
                className="flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                <span className="hidden sm:inline">All</span>
              </Button>
            </Link>

            <Link href="/apps">
              <Button
                variant={pathname === "/apps" ? "secondary" : "ghost"}
                size="sm"
                className="flex items-center gap-1"
              >
                <AppWindow className="h-4 w-4" />
                <span className="hidden sm:inline">Apps</span>
              </Button>
            </Link>

            <Link href="/games">
              <Button
                variant={pathname === "/games" ? "secondary" : "ghost"}
                size="sm"
                className="flex items-center gap-1"
              >
                <Gamepad2 className="h-4 w-4" />
                <span className="hidden sm:inline">Games</span>
              </Button>
            </Link>

            <Link href="/create">
              <Button
                variant={pathname === "/create" ? "secondary" : "ghost"}
                size="sm"
                className="flex items-center gap-1"
              >
                <BrainCircuit className="h-4 w-4" />
                <span className="hidden sm:inline bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-green-500 to-teal-500">Create</span>
              </Button>
            </Link>

            <a href="https://github.com/PixifyAI/AI-HTML-Agent-Gallery" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <Github className="h-4 w-4" />
                <span className="hidden sm:inline">GitHub</span>
              </Button>
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
