'use client'

import { motion } from 'framer-motion'
import { Briefcase, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useSultanStore } from '@/lib/store'
import { t } from '@/lib/i18n'
import { jobs } from '@/lib/seed-data'
import { cn } from '@/lib/utils'

export default function JobsView() {
  const { addToast, locale } = useSultanStore()

  const typeLabels: Record<string, string> = {
    fulltime: t('fulltime', locale),
    parttime: t('parttime', locale),
    freelance: t('freelance', locale),
    remote: t('remote', locale),
  }

  const typeColors: Record<string, string> = {
    fulltime: 'bg-green-500/20 text-green-400 border-green-500/30',
    parttime: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    freelance: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    remote: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pb-8">
      <div className="flex items-center gap-3 px-2 sm:px-4">
        <Briefcase className="h-6 w-6 text-amber-500" />
        <div>
          <h1 className="text-xl font-bold">{t('jobs', locale)}</h1>
          <p className="text-sm text-muted-foreground">فرص العمل المتاحة في المغرب</p>
        </div>
      </div>

      <div className="space-y-2 px-2 sm:px-4">
        {jobs.map((job) => (
          <motion.div
            key={job.id}
            whileHover={{ scale: 1.01 }}
            className="rounded-xl border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center gap-3 cursor-pointer hover:border-amber-500/40 transition-colors"
            onClick={() => addToast('تم فتح وظيفة: ' + job.title, 'info')}
          >
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-semibold">{job.title}</h3>
                <Badge variant="secondary" className="text-[9px]">بيانات تجريبية</Badge>
              </div>
              <div className="text-xs text-muted-foreground">{job.company}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <MapPin className="h-3 w-3" />{job.city}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">{job.requirements}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge className={cn('text-[10px] border', typeColors[job.type])}>
                {typeLabels[job.type]}
              </Badge>
              <span className="text-amber-500 font-semibold text-sm">{job.salary}</span>
              <Button size="sm" onClick={(e) => { e.stopPropagation(); addToast('تم تقديم طلبك بنجاح', 'success'); }} className="bg-amber-500 text-slate-900 hover:bg-[#E8C84A] text-xs hidden sm:flex">
                قدّم الآن
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
