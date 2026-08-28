'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useEconomyStore } from '@/lib/economy'
import { useSultanStore } from '@/lib/store'
import { cn } from '@/lib/utils'

type TargetType = 'profile' | 'post' | 'service' | 'business' | 'project' | 'challenge' | 'bounty' | 'community'

type Size = 'sm' | 'md' | 'lg'

interface SupportButtonProps {
  targetId: string
  targetType: TargetType
  recipientId: string
  recipientName?: string
  size?: Size
  showLabel?: boolean
  className?: string
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-xs px-2 py-1 gap-1',
  md: 'text-sm px-3 py-1.5 gap-1.5',
  lg: 'text-base px-4 py-2 gap-2',
}

const iconSizes: Record<Size, number> = {
  sm: 12,
  md: 14,
  lg: 18,
}

export default function SupportButton({
  targetId,
  targetType,
  recipientId,
  recipientName,
  size = 'md',
  showLabel = true,
  className,
}: SupportButtonProps) {
  const isAuthenticated = useSultanStore((s) => s.isAuthenticated)
  const openSupportModal = useSultanStore((s) => s.openSupportModal)
  const addToast = useSultanStore((s) => s.addToast)
  const isFeaturePaused = useEconomyStore((s) => s.isFeaturePaused)

  const handleClick = () => {
    if (!isAuthenticated) {
      addToast('سجّل دخولك أولاً', 'info')
      return
    }

    if (isFeaturePaused('support')) {
      addToast('الدعم متوقف مؤقتاً', 'info')
      return
    }

    openSupportModal({
      id: targetId,
      title: recipientName,
      type: targetType,
      recipientId,
    })
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={cn(
        'inline-flex items-center rounded-full font-medium transition-colors',
        'border border-sultan text-sultan',
        'hover:bg-sultan/10',
        sizeClasses[size],
        className,
      )}
      aria-label={showLabel ? undefined : `ادعم ${recipientName ?? ''}`}
    >
      <Heart size={iconSizes[size]} className="fill-sultan/20" />
      {showLabel && <span>ادعم</span>}
    </motion.button>
  )
}
