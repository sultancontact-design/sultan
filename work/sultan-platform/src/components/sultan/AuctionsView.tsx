'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Gavel, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useSultanStore } from '@/lib/store'
import { auctions } from '@/lib/seed-data'

function CountdownTimer({ endsAt }: { endsAt: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })

  useEffect(() => {
    function calc() {
      const diff = Math.max(0, new Date(endsAt).getTime() - Date.now())
      return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      }
    }
    setTimeLeft(calc())
    const timer = setInterval(() => setTimeLeft(calc()), 1000)
    return () => clearInterval(timer)
  }, [endsAt])

  return (
    <div className="flex gap-1.5 text-xs">
      {Object.entries(timeLeft).map(([label, val]) => (
        <div key={label} className="flex flex-col items-center">
          <span className="bg-[#0A1628] text-[#D4AF37] px-1.5 py-0.5 rounded font-mono font-bold min-w-[28px] text-center">
            {String(val).padStart(2, '0')}
          </span>
          <span className="text-[9px] text-muted-foreground mt-0.5">
            {label === 'days' ? 'يوم' : label === 'hours' ? 'ساعة' : label === 'mins' ? 'دقيقة' : 'ثانية'}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function AuctionsView() {
  const { addToast } = useSultanStore()

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pb-8">
      <div className="flex items-center gap-3 px-2 sm:px-4">
        <Gavel className="h-6 w-6 text-[#D4AF37]" />
        <div>
          <h1 className="text-xl font-bold">المزادات</h1>
          <p className="text-sm text-muted-foreground">زايد على أفضل المنتجات الفاخرة</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-2 sm:px-4">
        {auctions.map((auction) => (
          <motion.div
            key={auction.id}
            whileHover={{ scale: 1.02 }}
            className="rounded-xl border border-border bg-card overflow-hidden"
          >
            <div className={`relative h-40 bg-gradient-to-br ${auction.images}`}>
              <Badge variant="secondary" className="absolute top-2 start-2 text-[9px]">بيانات تجريبية</Badge>
              <Gavel className="absolute bottom-2 start-2 h-6 w-6 text-[#D4AF37]" />
            </div>
            <div className="p-4 space-y-3">
              <h3 className="font-semibold line-clamp-1">{auction.title}</h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">المزايدة الحالية</div>
                  <div className="text-[#D4AF37] font-bold text-lg">{auction.currentBid.toLocaleString()} MAD</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">ينتهي خلال</div>
                  <CountdownTimer endsAt={auction.endsAt} />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>البداية: {auction.startPrice.toLocaleString()} MAD</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3" />{auction.bidCount} مزايدة</span>
              </div>
              <Button
                className="w-full bg-[#D4AF37] text-[#0A1628] hover:bg-[#E8C84A] font-semibold"
                onClick={() => addToast('سيتم فتح المزادة قريباً', 'info')}
              >
                مزايدة الآن
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}