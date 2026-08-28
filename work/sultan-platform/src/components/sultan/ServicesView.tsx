'use client'

import { motion } from 'framer-motion'
import { Star, MapPin, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSultanStore } from '@/lib/store'
import { services } from '@/lib/seed-data'

export default function ServicesView() {
  const { addToast, locale } = useSultanStore()

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pb-8">
      <div className="flex items-center gap-3 px-2 sm:px-4">
        <Wrench className="h-6 w-6 text-[#D4AF37]" />
        <div>
          <h1 className="text-xl font-bold">الخدمات</h1>
          <p className="text-sm text-muted-foreground">اعثر على أفضل الخدمات المحترفة</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 px-2 sm:px-4">
        {services.map((s) => (
          <motion.div
            key={s.id}
            whileHover={{ scale: 1.02 }}
            className="rounded-xl border border-border bg-card p-4 space-y-2 cursor-pointer group hover:border-[#D4AF37]/40"
            onClick={() => addToast('سيتم فتح صفحة الخدمة قريباً', 'info')}
          >
            <Badge variant="secondary" className="text-[9px]">بيانات تجريبية</Badge>
            <h3 className="text-sm font-semibold">{s.title}</h3>
            <div className="text-xs text-muted-foreground">{s.provider}</div>
            <div className="flex items-center justify-between text-xs">
              <Badge variant="outline" className="text-[10px]">{s.category}</Badge>
              <span className="text-[#D4AF37] font-bold">من {s.price} MAD</span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-[#D4AF37] fill-[#D4AF37]" />
                {s.rating}
              </span>
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{s.city}</span>
              <span>{s.experience}</span>
            </div>
            <Button className="w-full bg-[#D4AF37] text-[#0A1628] hover:bg-[#E8C84A] text-xs">
              تواصل مع المزود
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
