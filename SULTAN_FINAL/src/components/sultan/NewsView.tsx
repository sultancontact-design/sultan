'use client'

import { motion } from 'framer-motion'
import { Newspaper } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useSultanStore } from '@/lib/store'
import { newsArticles } from '@/lib/seed-data'

export default function NewsView() {
  const { addToast } = useSultanStore()

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pb-8">
      <div className="flex items-center gap-3 px-2 sm:px-4">
        <Newspaper className="h-6 w-6 text-[#D4AF37]" />
        <div>
          <h1 className="text-xl font-bold">الأخبار</h1>
          <p className="text-sm text-muted-foreground">آخر الأخبار والمستجدات المغربية</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-2 sm:px-4">
        {newsArticles.map((article) => (
          <motion.div
            key={article.id}
            whileHover={{ scale: 1.02 }}
            className="rounded-xl border border-border bg-card overflow-hidden cursor-pointer hover:border-[#D4AF37]/40"
            onClick={() => addToast('سيتم فتح المقال قريباً', 'info')}
          >
            <div className="h-32 bg-gradient-to-br from-[#D4AF37]/20 to-[#B8941F]/10 flex items-end p-3">
              <Badge className="bg-[#D4AF37] text-[#0A1628] text-[10px]">{article.category}</Badge>
              <Badge variant="secondary" className="text-[9px] ms-auto">بيانات تجريبية</Badge>
            </div>
            <div className="p-3 space-y-1.5">
              <h3 className="text-sm font-semibold line-clamp-2">{article.title}</h3>
              {article.excerpt && <p className="text-xs text-muted-foreground line-clamp-2">{article.excerpt}</p>}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{article.source}</span>
                <span>{article.date}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
