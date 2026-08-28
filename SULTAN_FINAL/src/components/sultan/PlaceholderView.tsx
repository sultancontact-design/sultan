'use client'

import { motion } from 'framer-motion'
import { Construction, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSultanStore } from '@/lib/store'

export default function PlaceholderView({ title, description }: { title: string; description: string }) {
  const { navigate } = useSultanStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="h-20 w-20 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-6">
        <Construction className="h-10 w-10 text-[#D4AF37]" />
      </div>
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => navigate('home')}
        >
          العودة للرئيسية
        </Button>
        <Button
          className="bg-[#D4AF37] text-[#0A1628] hover:bg-[#E8C84A]"
          onClick={() => navigate('marketplace')}
        >
          تصفح السوق
        </Button>
      </div>
      <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
        <Crown className="h-4 w-4 text-[#D4AF37]" />
        <span>هذا القسم قيد التطوير وسيكون متاحاً قريباً في سلطان</span>
      </div>
    </motion.div>
  )
}
