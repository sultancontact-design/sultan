'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useSultanStore } from '@/lib/store'
import { charityCases } from '@/lib/seed-data'
import { cn } from '@/lib/utils'

const urgencyColors: Record<string, string> = {
  critical: 'bg-red-500 text-white',
  high: 'bg-orange-500 text-white',
  medium: 'bg-yellow-500 text-[#0A1628]',
  low: 'bg-green-500 text-white',
}

const urgencyLabels: Record<string, string> = {
  critical: 'حرج',
  high: 'عاجل',
  medium: 'متوسط',
  low: 'عادي',
}

export default function CharityView() {
  const { openSupportModal } = useSultanStore()

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pb-8">
      <div className="flex items-center gap-3 px-2 sm:px-4">
        <Heart className="h-6 w-6 text-green-400" />
        <div>
          <h1 className="text-xl font-bold">التضامن والتبرعات</h1>
          <p className="text-sm text-muted-foreground">ادعم القضايا الإنسانية في المغرب</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-2 sm:px-4">
        {charityCases.map((c) => {
          const pct = Math.round((c.collectedAmount / c.goalAmount) * 100)
          return (
            <motion.div
              key={c.id}
              whileHover={{ scale: 1.02 }}
              className="rounded-xl border border-border bg-card p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold flex-1">{c.title}</h3>
                <div className="flex gap-1 shrink-0">
                  <Badge className={cn('text-[10px]', urgencyColors[c.urgency])}>
                    {urgencyLabels[c.urgency]}
                  </Badge>
                  <Badge variant="secondary" className="text-[9px]">تجريبي</Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-3">{c.description}</p>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-green-400 font-semibold">{c.collectedAmount.toLocaleString()} MAD</span>
                  <span className="text-muted-foreground">من {c.goalAmount.toLocaleString()} MAD</span>
                </div>
                <Progress value={pct} className="h-2.5" />
                <div className="text-xs text-muted-foreground mt-1 text-center">{pct}%</div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{c.donors} متبرع</span>
                <Button
                  size="sm"
                  className="bg-green-600 text-white hover:bg-green-700 text-xs"
                  onClick={() => openSupportModal(c)}
                >
                  تبرع الآن
                </Button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
