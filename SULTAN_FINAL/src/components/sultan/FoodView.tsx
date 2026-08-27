'use client'

import { motion } from 'framer-motion'
import { Star, Clock, MapPin, UtensilsCrossed } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSultanStore } from '@/lib/store'
import { restaurants } from '@/lib/seed-data'

export default function FoodView() {
  const { addToast } = useSultanStore()

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pb-8">
      <div className="flex items-center gap-3 px-2 sm:px-4">
        <UtensilsCrossed className="h-6 w-6 text-[#D4AF37]" />
        <div>
          <h1 className="text-xl font-bold">المطاعم وتوصيل الطعام</h1>
          <p className="text-sm text-muted-foreground">اكتشف أفضل المطاعم في مدينتك</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-2 sm:px-4">
        {restaurants.map((r) => (
          <motion.div
            key={r.id}
            whileHover={{ scale: 1.02 }}
            className="rounded-xl border border-border bg-card overflow-hidden cursor-pointer group hover:border-[#D4AF37]/30"
            onClick={() => addToast('سيتم فتح صفحة المطعم قريباً', 'info')}
          >
            <div className="h-28 bg-gradient-to-br from-orange-700/40 to-red-500/20 relative">
              <Badge variant="secondary" className="absolute top-2 start-2 text-[9px]">بيانات تجريبية</Badge>
              {r.featured && <Badge className="absolute top-2 end-2 bg-[#D4AF37] text-[#0A1628] text-[10px]">مميز</Badge>}
              <div className="absolute bottom-2 start-2 text-white text-lg font-bold drop-shadow">{r.name}</div>
            </div>
            <div className="p-3 space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <Badge variant="outline" className="text-[#D4AF37] border-[#D4AF37]/30 text-[10px]">{r.cuisine}</Badge>
                <span className="text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{r.city}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-[#D4AF37] fill-[#D4AF37]" />
                  <span className="text-foreground font-semibold">{r.rating}</span>
                </span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{r.deliveryTime} د</span>
                <span>الحد الأدنى: {r.minOrder} MAD</span>
              </div>
              <Button className="w-full bg-[#D4AF37] text-[#0A1628] hover:bg-[#E8C84A] text-xs mt-1">
                اطلب الآن
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
