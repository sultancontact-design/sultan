'use client';
import { useSultanStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Coins } from 'lucide-react';
import { useState } from 'react';

export default function SupportModal() {
  const { isSupportModalOpen, closeSupportModal, supportTarget, addToast, currentProfile, deductCoins } = useSultanStore();
  const [amount, setAmount] = useState(100);
  const [message, setMessage] = useState('');
  const [customAmount, setCustomAmount] = useState('');

  const presets = [50, 100, 500, 1000, 5000, 10000];
  const activeAmount = customAmount ? parseInt(customAmount) || 0 : amount;
  const fee = Math.round(activeAmount * 0.05);
  const total = activeAmount + fee;

  const handleSupport = () => {
    const finalAmount = customAmount ? parseInt(customAmount) : amount;
    if (!finalAmount || finalAmount <= 0) return;
    const finalFee = Math.round(finalAmount * 0.05);
    const finalTotal = finalAmount + finalFee;
    deductCoins(finalTotal);
    closeSupportModal();
    addToast(`تم دعم ${supportTarget?.title || 'المستخدم'} بـ ${finalAmount.toLocaleString()} SC`, 'success');
    const newBalance = (currentProfile?.coinsBalance ?? 0) - finalTotal;
    addToast(`رصيدك الجديد: ${Math.max(0, newBalance).toLocaleString()} SC`, 'info');
    setMessage(''); setCustomAmount(''); setAmount(100);
  };

  return (
    <Dialog open={isSupportModalOpen} onOpenChange={closeSupportModal}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-sultan" />
            ادعم {supportTarget?.title || 'هذا المحتوى'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">اختر مبلغ الدعم من عملات سلطان (SC)</p>
          <div className="grid grid-cols-3 gap-2">
            {presets.map(p => (
              <button key={p} onClick={() => { setAmount(p); setCustomAmount(''); }}
                className={`py-2 rounded-lg text-sm font-medium border transition-all ${amount === p && !customAmount ? 'border-sultan bg-sultan/10 text-sultan' : 'border-border hover:border-sultan/30'}`}
              >
                {p.toLocaleString()}
              </button>
            ))}
          </div>
          <Input placeholder="مبلغ مخصص" type="number" value={customAmount} onChange={(e) => { setCustomAmount(e.target.value); if (e.target.value) setAmount(0); }} />
          <Textarea placeholder="رسالة اختيارية..." value={message} onChange={(e) => setMessage(e.target.value)} rows={2} />
          <div className="text-xs text-muted-foreground space-y-1 bg-secondary/30 rounded-lg p-3">
            <div className="flex justify-between"><span>المبلغ</span><span>{activeAmount.toLocaleString()} SC</span></div>
            <div className="flex justify-between"><span>الرسوم (5%)</span><span>{fee.toLocaleString()} SC</span></div>
            <div className="flex justify-between font-semibold text-foreground pt-1 border-t border-border/50"><span>الإجمالي</span><span>{total.toLocaleString()} SC</span></div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={closeSupportModal}>إلغاء</Button>
          <Button className="bg-sultan text-royal hover:bg-sultan/90" onClick={handleSupport}>تأكيد الدعم</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}