'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Crown,
  Send,
  X,
  Sparkles,
  Search,
  MapPin,
  Zap,
  Gift,
  Package,
} from 'lucide-react';
import { useSultanStore } from '@/lib/store';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  response: string;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text: 'مرحباً! أنا مساعدك الذكي في سلطان. يمكنني مساعدتك في البحث عن المنتجات والخدمات، تتبع طلباتك، استكشاف العروض، والإجابة على أسئلتك. كيف يمكنني مساعدتك اليوم؟',
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: 'البحث عن منتج',
    icon: <Search className="h-3.5 w-3.5" />,
    response: 'يمكنني مساعدتك في البحث! ما نوع المنتج أو الخدمة التي تبحث عنها؟',
  },
  {
    label: 'خدمات قريبة مني',
    icon: <MapPin className="h-3.5 w-3.5" />,
    response: 'أحتاج لمعرفة موقعك الحالي أو المدينة التي تبحث فيها. يمكنك مشاركة موقعك وسأعرض لك أفضل الخدمات القريبة منك.',
  },
  {
    label: 'كيف أبيع أسرع؟',
    icon: <Zap className="h-3.5 w-3.5" />,
    response:
      'للبيع بشكل أسرع، أنصحك بـ: ١. إضافة صور عالية الجودة لمنتجك. ٢. كتابة وصف تفصيلي وجذاب. ٣. تحديد سعر تنافسي. ٤. استخدام كلمات مفتاحية مناسبة. ٥. مشاركة الإعلان على وسائل التواصل الاجتماعي. هل تريد مساعدة في إنشاء إعلان جديد؟',
  },
  {
    label: 'مكافآتي',
    icon: <Gift className="h-3.5 w-3.5" />,
    response: '__COINS_PLACEHOLDER__',
  },
  {
    label: 'تتبع طلبي',
    icon: <Package className="h-3.5 w-3.5" />,
    response:
      'للتتبع طلبك، يرجى إدخال رقم الطلب أو مشاركته معي. سأقوم بعرض لك حالة الشحن والتوصيل المتوقعة فوراً.',
  },
];

function getSimulatedResponse(userText: string): string {
  const lower = userText.trim();
  if (lower.includes('سعر') || lower.includes('كم'))
    return 'للحصول على أفضل الأسعار، أنصحك بمقارنة الأسعار في قسم السوق والتحقق من العروض الحالية. يمكنك أيضاً تفعيل التنبيهات لينبهك عند انخفاض السعر.';
  if (lower.includes('شحن') || lower.includes('توصيل'))
    return 'نوفر خيارات شحن متعددة: توصيل سريع خلال 24 ساعة، توصيل عادي خلال 3-5 أيام، واستلام من النقطة المحددة. يمكنك اختيار ما يناسبك عند إتمام الطلب.';
  if (lower.includes('استرجاع') || lower.includes('إرجاع'))
    return 'سياسة الاسترجاع في سلطان تمنحك 14 يوماً لإرجاع المنتج. فقط تأكد من أن المنتج في حالته الأصلية. هل تريد بدء عملية استرجاع؟';
  if (lower.includes('مرحبا') || lower.includes('هلا') || lower.includes('سلام'))
    return 'أهلاً وسهلاً! 😊 كيف يمكنني مساعدتك اليوم؟ يمكنني البحث عن منتجات، تتبع طلباتك، أو الإجابة على أي استفسار.';
  if (lower.includes('شكرا') || lower.includes('شكراً'))
    return 'العفو! سعيد بأنني استطعت المساعدة. لا تتردد في السؤال عن أي شيء آخر. 🌟';
  return 'شكراً لرسالتك! أنا أتعلم وأتحسن باستمرار. سأحاول مساعدتك بشكل أفضل قريباً. في الوقت الحالي، يمكنك استخدام الأزرار السريعة بالأعلى للحصول على مساعدة فورية.';
}

export default function SultanAIConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isRTL, currentProfile } = useSultanStore();
  const balance = currentProfile?.coinsBalance ?? 0;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: text.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    const delay = 1000 + Math.random() * 1000;
    setTimeout(() => {
      setIsTyping(false);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: getSimulatedResponse(text),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, delay);
  };

  const handleQuickAction = (action: QuickAction) => {
    if (isTyping) return;
    const responseText = action.response === '__COINS_PLACEHOLDER__'
      ? `لديك حالياً ${balance} عملة سلطان! يمكنك استبدالها بخصومات حصرية أو استخدامها لدعم المحتوى المفضل لديك. تابع تسجيل دخولك يومياً للحصول على مكافآت إضافية. 🎁`
      : action.response;
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: 'user' as const, text: action.label },
    ]);
    setIsTyping(true);
    const delay = 1000 + Math.random() * 1000;
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: `ai-${Date.now()}`, role: 'assistant' as const, text: responseText },
      ]);
    }, delay);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="fixed bottom-20 left-6 z-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="relative w-14 h-14 rounded-full sultan-gradient sultan-glow flex items-center justify-center shadow-lg cursor-pointer"
          >
            <span className="absolute inset-0 rounded-full sultan-gradient animate-ping opacity-25" />
            <Crown className="h-6 w-6 text-royal relative z-10" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-[320px] max-w-[calc(100vw-3rem)] origin-bottom-left"
          >
            <Card className="overflow-hidden border-sultan/20 shadow-2xl">
              {/* Header */}
              <div className="relative sultan-gradient px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-royal/20 flex items-center justify-center">
                    <Crown className="h-5 w-5 text-royal" />
                  </div>
                  <div>
                    <h2 className="text-royal font-bold text-sm leading-tight">
                      مساعد سلطان الذكي
                    </h2>
                    <span className="text-royal/70 text-[11px] flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      متصل الآن
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 rounded-full hover:bg-royal/10 text-royal/70 hover:text-royal"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef}
                className="h-[340px] overflow-y-auto scrollbar-thin p-4 space-y-4 bg-background"
              >
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      msg.role === 'user' ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-sultan/10 text-foreground border border-sultan/20 rounded-bl-sm'
                          : 'bg-royal text-white rounded-br-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}

                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="flex justify-end"
                    >
                      <div className="bg-royal text-white rounded-2xl rounded-br-sm px-4 py-3 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-white/60 animate-bounce [animation-delay:0ms]" />
                        <span className="h-2 w-2 rounded-full bg-white/60 animate-bounce [animation-delay:150ms]" />
                        <span className="h-2 w-2 rounded-full bg-white/60 animate-bounce [animation-delay:300ms]" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick Actions */}
              <div className="px-3 py-2 border-t border-border/50 bg-card">
                <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleQuickAction(action)}
                      disabled={isTyping}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium border border-sultan/25 text-sultan hover:bg-sultan/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {action.icon}
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 border-t border-border/50 bg-card p-3"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="اكتب رسالتك..."
                  disabled={isTyping}
                  className="flex-1 h-10 bg-secondary/50 border-sultan/20 focus-visible:border-sultan rounded-full text-sm ps-4"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isTyping}
                  className="h-10 w-10 shrink-0 rounded-full sultan-gradient hover:opacity-90 text-royal disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
