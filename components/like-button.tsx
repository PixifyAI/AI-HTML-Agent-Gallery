"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface LikeButtonProps {
  itemId: string
  initialLikes: number
  onLike?: (newCount: number) => void
  size?: "sm" | "md" | "lg"
  showCount?: boolean
  className?: string
  onClick?: (e: React.MouseEvent) => void
}

export default function LikeButton({
  itemId,
  initialLikes = 0,
  onLike,
  size = "md",
  showCount = true,
  className = "",
  onClick,
}: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [isLiking, setIsLiking] = useState(false)
  const [hasLiked, setHasLiked] = useState(false)
  const { toast } = useToast()

  const handleLike = async (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e)
    }

    e.stopPropagation()

    if (hasLiked) {
      toast({
        title: "Already liked",
        description: "You've already liked this item",
      })
      return
    }

    setIsLiking(true)

    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      })

      const data = await response.json()

      if (data.success) {
        setLikes(data.likes)
        setHasLiked(true)

        if (onLike) {
          onLike(data.likes)
        }

        toast({
          title: "Liked!",
          description: "Your like has been added",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to add like",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLiking(false)
    }
  }

  const sizeClasses = {
    sm: "h-7 px-2 text-xs",
    md: "h-9 px-3 text-sm",
    lg: "h-10 px-4 text-base",
  }

  return (
    <Button
      variant={hasLiked ? "default" : "outline"}
      size="sm"
      className={`${sizeClasses[size]} ${hasLiked ? "bg-pink-600 hover:bg-pink-700" : ""} ${className}`}
      onClick={handleLike}
      disabled={isLiking}
    >
      <Heart className={`h-4 w-4 mr-1 ${hasLiked ? "fill-white" : ""}`} />
      {showCount && <span>{likes}</span>}
    </Button>
  )
}
