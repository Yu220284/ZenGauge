'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface AvatarWithBackgroundProps {
  src?: string
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const pastelBackgrounds = [
  'bg-gradient-to-br from-pink-200 to-purple-200',
  'bg-gradient-to-br from-blue-200 to-cyan-200', 
  'bg-gradient-to-br from-green-200 to-emerald-200',
  'bg-gradient-to-br from-yellow-200 to-orange-200',
  'bg-gradient-to-br from-purple-200 to-pink-200',
  'bg-gradient-to-br from-indigo-200 to-blue-200',
  'bg-gradient-to-br from-rose-200 to-pink-200',
  'bg-gradient-to-br from-teal-200 to-green-200'
]

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10', 
  lg: 'h-12 w-12',
  xl: 'h-16 w-16'
}

export function AvatarWithBackground({ 
  src, 
  alt, 
  fallback, 
  size = 'md', 
  className 
}: AvatarWithBackgroundProps) {
  const backgroundIndex = fallback ? fallback.charCodeAt(0) % pastelBackgrounds.length : 0
  const background = pastelBackgrounds[backgroundIndex]
  
  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback className={cn(background, 'text-gray-700 font-medium')}>
        {fallback}
      </AvatarFallback>
    </Avatar>
  )
}