"use client"

import * as React from "react"
import { User } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserAvatarProps {
  className?: string
  size?: "sm" | "md" | "lg"
  userId?: string
}

const backgroundColors = [
  "bg-gradient-to-br from-pink-200 to-purple-200 text-gray-700",
  "bg-gradient-to-br from-blue-200 to-cyan-200 text-gray-700", 
  "bg-gradient-to-br from-green-200 to-emerald-200 text-gray-700",
  "bg-gradient-to-br from-yellow-200 to-orange-200 text-gray-700",
  "bg-gradient-to-br from-purple-200 to-pink-200 text-gray-700",
  "bg-gradient-to-br from-indigo-200 to-blue-200 text-gray-700",
  "bg-gradient-to-br from-rose-200 to-pink-200 text-gray-700",
  "bg-gradient-to-br from-teal-200 to-green-200 text-gray-700"
]

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10", 
  lg: "h-24 w-24"
}

const iconSizes = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-12 w-12"
}

export function UserAvatar({ className, size = "md", userId }: UserAvatarProps) {
  // ユーザーIDまたはランダムで背景色を決定
  const colorIndex = userId 
    ? userId.charCodeAt(0) % backgroundColors.length 
    : Math.floor(Math.random() * backgroundColors.length)
  
  const bgColor = backgroundColors[colorIndex]
  
  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full items-center justify-center",
        sizeClasses[size],
        bgColor,
        className
      )}
    >
      <User className={iconSizes[size]} />
    </div>
  )
}