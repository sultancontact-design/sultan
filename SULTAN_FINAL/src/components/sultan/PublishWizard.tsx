'use client';
import { useSultanStore } from '@/lib/store';
import { categories, cities } from '@/lib/seed-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft, Check, Camera } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublishWizard() {
  const { isPublishModalOpen, closePublishModal, addToast, navigate } = useSultanStore();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ category: '', title: '', description: '', condition: 'new', city: '', price: '', negotiation: true, delivery: false });

  const steps = ['الفئة', 'التفاصيل', 'الموقع والسعر', 'المعاينة'];

  const canNext = step === 0 ? !!form.category : step === 1 ? !!form.title && !!form.description : step === 2 ? !!form.city && !!form.price : true;

  const handlePublish = () => {
    closePublishModal();
    setStep(0);
    setForm({ category: '', title: '', description: '', condition: 'new', city: '', price: '', negotiation: true, delivery: false });
    addToast('تم نشر الإعلان بنجاح!', 'success');
  };

  const handleClose = (open: boolean) => { if (!open) { closePublishModal(); setStep(0); } };

  return (
    <Dialog open={isPublishModalOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>نشر إعلان جديد</DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center gap-1 mb-6">
          {steps.map((s, i) => (
            <div key={s} className="flex-1 flex items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i <= step ? 'bg-sultan text-royal' : 'bg-secondary text-muted-foreground'}`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-[10px] hidden sm:block ${i <= step ? 'text-foreground' : 'text-muted-foreground'}`}>{s}</span>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${i < step ? 'bg-sultan' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
              <label className="text-sm font-medium">اختر الفئة</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.filter(c => !['c-marketplace','c-zawaj','c-social','c-news','c-charity','c-auctions'].includes(c.id)).map(c => (
                  <button key={c.id} onClick={() => setForm({ ...form, category: c.id })}
                    className={`p-3 rounded-lg border text-start text-sm transition-all ${form.category === c.id ? 'border-sultan bg-sultan/10 text-sultan' : 'border-border hover:border-sultan/30'}`}>
                    {c.nameAr}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div><label className="text-sm font-medium">العنوان</label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="مثال: آيفون 15 برو ماكس 256GB" className="mt-1" /></div>
              <div><label className="text-sm font-medium">الوصف</label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="اكتب وصفا تفصيليا..." rows={4} className="mt-1" /></div>
              <div><label className="text-sm font-medium">الحالة</label>
                <div className="flex gap-2 mt-1">
                  {[['new','جديد'],['likeNew','كالجديد'],['used','مستعمل']].map(([v,l]) => (
                    <button key={v} onClick={() => setForm({ ...form, condition: v })}
                      className={`px-4 py-2 rounded-lg text-sm border ${form.condition === v ? 'border-sultan bg-sultan/10 text-sultan' : 'border-border'}`}>{l}</button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div><label className="text-sm font-medium">المدينة</label>
                <Select value={form.city} onValueChange={v => setForm({ ...form, city: v })}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="اختر المدينة" /></SelectTrigger>
                  <SelectContent>{cities.map(c => <SelectItem key={c.id} value={c.nameAr}>{c.nameAr}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><label className="text-sm font-medium">السعر (درهم)</label><Input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0" className="mt-1" /></div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={form.negotiation} onChange={e => setForm({ ...form, negotiation: e.target.checked })} className="accent-sultan" /> قابل للتفاوض</label>
                <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={form.delivery} onChange={e => setForm({ ...form, delivery: e.target.checked })} className="accent-sultan" /> توصيل متاح</label>
              </div>
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
                <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">اسحب الصور هنا أو انقر للرفع</p>
                <p className="text-xs text-muted-foreground mt-1">حتى 10 صور · WebP/JPEG</p>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h3 className="font-semibold">معاينة الإعلان</h3>
              <div className="rounded-xl bg-secondary/30 border border-border/50 overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-sultan/30 to-sultan/10 flex items-center justify-center">
                  <Camera className="h-10 w-10 text-sultan/40" />
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-sultan font-bold text-lg">{form.price ? parseInt(form.price).toLocaleString() : '0'} <span className="text-xs font-normal text-muted-foreground">درهم</span></p>
                  <p className="font-semibold">{form.title || 'عنوان الإعلان'}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{form.description || 'وصف الإعلان'}</p>
                  <div className="flex gap-2 pt-2">
                    <Badge variant="secondary">{categories.find(c => c.id === form.category)?.nameAr || 'فئة'}</Badge>
                    <Badge variant="secondary">{form.city || 'مدينة'}</Badge>
                    <Badge variant="secondary">{form.condition === 'new' ? 'جديد' : form.condition === 'used' ? 'مستعمل' : 'كالجديد'}</Badge>
                    {form.negotiation && <Badge variant="outline">قابل للتفاوض</Badge>}
                  </div>
                </div>
              </div>
              <Badge className="bg-sultan/10 text-sultan border-0">DEM0</Badge>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mt-6">
          {step > 0 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="flex items-center gap-1"><ArrowRight className="h-4 w-4" /> السابق</Button>
          ) : <div />}
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canNext} className="bg-sultan text-royal hover:bg-sultan/90 flex items-center gap-1">التالي <ArrowLeft className="h-4 w-4" /></Button>
          ) : (
            <Button onClick={handlePublish} className="bg-sultan text-royal hover:bg-sultan/90 flex items-center gap-1"><Check className="h-4 w-4" /> نشر الإعلان</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}