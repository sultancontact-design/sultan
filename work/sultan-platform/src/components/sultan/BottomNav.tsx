'use client';
import { useSultanStore } from '@/lib/store';
import { Home, Store, Plus, MessageCircle, User } from 'lucide-react';

export default function BottomNav() {
  const { currentView, navigate, messageCount, openPublishModal } = useSultanStore();

  const items = [
    { key: 'home', icon: Home, label: 'الرئيسية' },
    { key: 'marketplace', icon: Store, label: 'السوق' },
    { key: 'publish', icon: Plus, label: 'نشر' },
    { key: 'messages', icon: MessageCircle, label: 'الرسائل' },
    { key: 'profile', icon: User, label: 'الملف' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 glass border-t border-border/50 md:hidden safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => {
          const isActive = item.key === 'publish' ? false : currentView === item.key;
          const isPublish = item.key === 'publish';
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => isPublish ? openPublishModal() : navigate(item.key)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
                isPublish
                  ? 'bg-gradient-to-t from-sultan to-sultan/80 text-royal -mt-4 shadow-lg shadow-sultan/25'
                  : isActive
                  ? 'text-sultan'
                  : 'text-muted-foreground'
              }`}
            >
              {isPublish ? (
                <div className="w-10 h-10 rounded-full sultan-gradient flex items-center justify-center shadow-lg shadow-sultan/20">
                  <Icon className="h-5 w-5 text-royal" />
                </div>
              ) : (
                <Icon className={`h-5 w-5 ${isActive ? 'text-sultan' : ''}`} />
              )}
              <span className={`text-[10px] ${isPublish ? 'text-royal font-semibold -mt-0.5' : isActive ? 'text-sultan font-medium' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
