'use client';
import { useState } from 'react';
import { AGENT_DEFINITIONS, type AgentDefinition } from '@/lib/ai/core/agent-registry';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown, Code2, CheckCircle2, ShieldCheck, Server, Microscope, BarChart3,
  Package, TrendingUp, Share2, FileText, Briefcase, BookOpen,
  Play, Pause, RotateCcw, Zap, Users, Activity, Clock, Cpu, AlertTriangle
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Crown, Code2, CheckCircle2, ShieldCheck, Server, Microscope, BarChart3,
  Package, TrendingUp, Share2, FileText, Briefcase, BookOpen,
};

const permissionLabels: Record<string, string> = {
  read: 'قراءة', write: 'كتابة', execute: 'تنفيذ', deploy: 'نشر', delete: 'حذف',
  database: 'قاعدة بيانات', github: 'GitHub', cloudflare: 'Cloudflare',
  social: 'تواصل اجتماعي', finance: 'مالية', user_data: 'بيانات المستخدمين', secrets: 'أسرار',
};

const permColors: Record<string, string> = {
  allowed: 'bg-green-500/20 text-green-400 border-green-500/30',
  denied: 'bg-red-500/20 text-red-400 border-red-500/30',
  approval_required: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

const statusColors: Record<string, string> = {
  idle: 'bg-muted text-muted-foreground',
  running: 'bg-blue-500/20 text-blue-400',
  error: 'bg-red-500/20 text-red-400',
  paused: 'bg-yellow-500/20 text-yellow-400',
};

const categoryLabels: Record<string, string> = {
  core: 'أساسي', engineering: 'هندسة', quality: 'جودة', security: 'أمن', devops: 'عمليات',
  research: 'بحث', data: 'بيانات', product: 'منتج', growth: 'نمو', social: 'تواصل',
  content: 'محتوى', business: 'أعمال', knowledge: 'معرفة',
};

export default function AIEmployeesPanel() {
  const [agents, setAgents] = useState(AGENT_DEFINITIONS.map(a => ({ ...a, status: 'idle' as const, isActive: a.isAlwaysOn })));
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [taskInput, setTaskInput] = useState('');
  const [showTaskForm, setShowTaskForm] = useState<string | null>(null);

  const activeCount = agents.filter(a => a.isActive).length;
  const runningCount = agents.filter(a => a.status === 'running').length;
  const idleCount = agents.filter(a => a.status === 'idle').length;

  const handleToggle = (id: string) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive, status: !a.isActive ? 'idle' : 'idle' } : a));
  };

  const handleExecute = (agentId: string) => {
    if (!taskInput.trim()) return;
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, status: 'running' as const } : a));
    setTimeout(() => {
      setAgents(prev => prev.map(a => a.id === agentId ? { ...a, status: 'idle' as const } : a));
      setShowTaskForm(null);
      setTaskInput('');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'إجمالي الوكلاء', value: agents.length, icon: Users, color: 'text-sultan', bg: 'bg-sultan/10' },
          { label: 'نشط', value: activeCount, icon: Activity, color: 'text-green-400', bg: 'bg-green-400/10' },
          { label: 'قيد التشغيل', value: runningCount, icon: Play, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'خامل', value: idleCount, icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted/50' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence>
          {agents.map((agent, i) => {
            const Icon = iconMap[agent.icon] || Cpu;
            const isSelected = selectedAgent === agent.id;
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card className={`border-border/50 transition-all ${isSelected ? 'border-sultan/50 sultan-glow' : 'hover:border-sultan/20'} ${!agent.isActive ? 'opacity-50' : ''}`}>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-sultan/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-sultan" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-bold">{agent.nameAr}</CardTitle>
                          <p className="text-[11px] text-muted-foreground">{agent.name}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={`text-[10px] ${statusColors[agent.status]}`}>
                        {agent.status === 'running' ? 'قيد التشغيل' : agent.status === 'error' ? 'خطأ' : 'خامل'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-3">
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{agent.descriptionAr}</p>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-[9px]">{categoryLabels[agent.category] || agent.category}</Badge>
                      {agent.capabilities.slice(0, 3).map(c => (
                        <Badge key={c} variant="secondary" className="text-[9px]">{c}</Badge>
                      ))}
                      {agent.capabilities.length > 3 && (
                        <Badge variant="secondary" className="text-[9px]">+{agent.capabilities.length - 3}</Badge>
                      )}
                    </div>

                    {/* Permissions Grid */}
                    <div className="grid grid-cols-4 gap-1">
                      {Object.entries(agent.permissions).slice(0, 8).map(([key, level]) => (
                        <div key={key} className={`text-center p-1 rounded text-[8px] border ${permColors[level as string] || ''}`}>
                          <div className="font-medium truncate">{permissionLabels[key]?.slice(0, 5) || key}</div>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        size="sm"
                        className="flex-1 h-8 text-xs"
                        variant={agent.isActive ? 'default' : 'outline'}
                        onClick={() => handleToggle(agent.id)}
                        disabled={agent.isAlwaysOn}
                      >
                        {agent.isActive ? (agent.status === 'running' ? <Pause className="h-3 w-3 me-1" /> : <Activity className="h-3 w-3 me-1" />) : <Play className="h-3 w-3 me-1" />}
                        {agent.isActive ? (agent.status === 'running' ? 'إيقاف' : 'نشط') : 'تفعيل'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs border-sultan/30 text-sultan hover:bg-sultan/10"
                        onClick={() => setShowTaskForm(showTaskForm === agent.id ? null : agent.id)}
                        disabled={!agent.isActive}
                      >
                        <Zap className="h-3 w-3 me-1" /> مهمة
                      </Button>
                    </div>

                    <AnimatePresence>
                      {showTaskForm === agent.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="pt-2 border-t border-border/50 space-y-2">
                            <Textarea
                              placeholder={`أدخل مهمة لـ ${agent.nameAr}...`}
                              value={taskInput}
                              onChange={(e) => setTaskInput(e.target.value)}
                              className="min-h-[60px] text-xs"
                              dir="rtl"
                            />
                            <div className="flex gap-2">
                              <Button size="sm" className="flex-1 h-7 text-[11px]" onClick={() => handleExecute(agent.id)} disabled={!taskInput.trim()}>
                                تنفيذ المهمة
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 text-[11px]" onClick={() => setShowTaskForm(null)}>
                                إلغاء
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}