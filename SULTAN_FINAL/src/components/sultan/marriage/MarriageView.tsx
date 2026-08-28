'use client';
import { useSultanStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Shield, MapPin, GraduationCap, Heart, ArrowRight, AlertTriangle, Flag, Search, Eye, EyeOff, Clock, CheckCircle2, UserCheck } from 'lucide-react';

const demoProfiles = [
  { id: 'm-1', name: 'أحمد الفاسي', age: 28, city: 'فاس', education: 'ماستر هندسة', about: 'شاب مؤمن، هادئ الطبع، يسعى لبناء أسرة مستقرة على أسس صحيحة', prayer: 'الصلوات الخمس', verified: true, gender: 'male' },
  { id: 'm-2', name: 'فاطمة الزهراء', age: 25, city: 'الدار البيضاء', education: 'بكالوريوس طب', about: 'فتاة ملتزمة، تحب القراءة والطبخ، تبحث عن شريك يخاف الله', prayer: 'الصلوات الخمس', verified: true, gender: 'female' },
  { id: 'm-3', name: 'يوسف الرباطي', age: 32, city: 'الرباط', education: 'دكتوراه قانون', about: 'محامي، أحب العلم والمعرفة، أبحث عن شريكة متفهمة', prayer: 'الصلوات الخمس + السنن', verified: true, gender: 'male' },
  { id: 'm-4', name: 'مريم المراكشية', age: 27, city: 'مراكش', education: 'إجازة تجارة', about: 'موظفة في قطاع البنوك، هادئة ومرتبة، تبحث عن استقرار', prayer: 'الصلوات الخمس', verified: false, gender: 'female' },
  { id: 'm-5', name: 'عبد الرحمن البيضاوي', age: 30, city: 'الدار البيضاء', education: 'مهندس برمجيات', about: 'أعمل في مجال التكنولوجيا، أحب الرياضة والسفر، ملتزم دينيا', prayer: 'الصلوات الخمس + قيام الليل', verified: true, gender: 'male' },
  { id: 'm-6', name: 'سارة التطوانية', age: 26, city: 'طنجة', education: 'ماستر إعلام', about: 'صحفية، أحب الكتابة والمشاركة الاجتماعية، أبحث عن شريك متوازن', prayer: 'الصلوات الخمس', verified: false, gender: 'female' },
];

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

export default function MarriageView() {
  const { goBack, addToast } = useSultanStore();
  const [filterCity, setFilterCity] = useState('all');
  const [filterEdu, setFilterEdu] = useState('all');
  const [ageRange, setAgeRange] = useState<[number, number]>([20, 45]);
  const [showPhotos, setShowPhotos] = useState(true);

  const filtered = useMemo(() => {
    return demoProfiles.filter(p => {
      if (filterCity !== 'all' && p.city !== filterCity) return false;
      if (filterEdu !== 'all' && !p.education.includes(filterEdu)) return false;
      if (p.age < ageRange[0] || p.age > ageRange[1]) return false;
      return true;
    });
  }, [filterCity, filterEdu, ageRange]);

  const getCompatibility = (p: typeof demoProfiles[0]) => {
    const base = p.verified ? 75 : 55;
    const prayerBonus = p.prayer.includes('قيام') ? 15 : p.prayer.includes('سنن') ? 10 : 5;
    return Math.min(base + prayerBonus, 98);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 py-4">
        <button onClick={() => goBack()} className="p-2 rounded-lg hover:bg-secondary transition-colors"><ArrowRight className="h-5 w-5" /></button>
        <h1 className="text-xl font-bold">الزواج والتعارف</h1>
        <Badge variant="outline" className="border-sultan/30 text-sultan text-xs flex items-center gap-1"><Heart className="h-3 w-3" />بخطاب</Badge>
      </div>

      {/* Privacy Notice */}
      <motion.div {...fadeUp} className="rounded-xl bg-sultan/5 border border-sultan/20 p-4 mb-6 flex items-start gap-3">
        <Shield className="h-5 w-5 text-sultan mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold text-sm text-sultan">تنبيه الخصوصية</p>
          <p className="text-xs text-muted-foreground mt-1">هذا القسم مخصص للزواج الشرعي فقط. جميع البيانات محمية ومشفرة. يتم التحقق من الهوية لكل حساب. بيانات تجريبية [DEMO]</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div {...fadeUp} className="flex flex-wrap gap-3 mb-6">
        <Select value={filterCity} onValueChange={setFilterCity}>
          <SelectTrigger className="w-36 h-9 text-xs"><SelectValue placeholder="المدينة" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل المدن</SelectItem>
            <SelectItem value="فاس">فاس</SelectItem><SelectItem value="الدار البيضاء">الدار البيضاء</SelectItem>
            <SelectItem value="الرباط">الرباط</SelectItem><SelectItem value="مراكش">مراكش</SelectItem><SelectItem value="طنجة">طنجة</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterEdu} onValueChange={setFilterEdu}>
          <SelectTrigger className="w-36 h-9 text-xs"><SelectValue placeholder="المستوى التعليمي" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">الكل</SelectItem>
            <SelectItem value="بكالوريوس">بكالوريوس</SelectItem><SelectItem value="إجازة">إجازة</SelectItem>
            <SelectItem value="ماستر">ماستر</SelectItem><SelectItem value="دكتوراه">دكتوراه</SelectItem>
          </SelectContent>
        </Select>
        <button onClick={() => setShowPhotos(!showPhotos)} className="flex items-center gap-1.5 px-3 h-9 rounded-lg border border-border/50 text-xs text-muted-foreground hover:border-sultan/30 transition-colors">
          {showPhotos ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          {showPhotos ? 'إخفاء الصور' : 'إظهار الصور'}
        </button>
      </motion.div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((profile, i) => {
          const compat = getCompatibility(profile);
          return (
            <motion.div key={profile.id} {...fadeUp} transition={{ delay: i * 0.06 }}
              className="rounded-xl bg-card border border-border/50 overflow-hidden hover:border-sultan/30 transition-all group">
              {/* Avatar placeholder */}
              {showPhotos ? (
                <div className={`h-28 bg-gradient-to-br ${profile.gender === 'male' ? 'from-blue-900/40 to-slate-800/60' : 'from-pink-900/30 to-rose-800/40'} flex items-center justify-center relative`}>
                  <span className="text-4xl font-bold text-white/20">{profile.name.charAt(0)}</span>
                  {profile.verified && <Badge className="absolute top-2 end-2 bg-green-500/20 text-green-400 border-0 text-[10px] flex items-center gap-1"><UserCheck className="h-3 w-3" />موثق</Badge>}
                  <Badge className="absolute bottom-2 start-2 bg-black/60 text-white text-[9px] backdrop-blur-sm">DEMO</Badge>
                </div>
              ) : (
                <div className="h-28 bg-secondary/30 flex items-center justify-center"><EyeOff className="h-8 w-8 text-muted-foreground/30" /></div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-sm group-hover:text-sultan transition-colors">{profile.name}</h3>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{profile.age} سنة</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{profile.city}</span>
                </div>
                <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                  <GraduationCap className="h-3 w-3" />{profile.education}
                </div>
                <p className="text-xs text-muted-foreground/80 mt-2 line-clamp-2">{profile.about}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-sultan/80">
                  <CheckCircle2 className="h-3 w-3" />{profile.prayer}
                </div>

                {/* Compatibility */}
                <div className="mt-3 pt-3 border-t border-border/30">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">نسبة التوافق</span>
                    <span className={`font-bold ${compat >= 85 ? 'text-green-400' : 'text-sultan'}`}>{compat}%</span>
                  </div>
                  <Progress value={compat} className="h-1.5" />
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="flex-1 h-8 text-xs bg-sultan/10 text-sultan hover:bg-sultan/20" onClick={() => addToast('تم إرسال طلب التواصل [DEMO]', 'info')}>
                    تواصل
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 text-xs text-destructive hover:bg-destructive/10" onClick={() => addToast('تم الإبلاغ. سيتم مراجعة الحساب [DEMO]', 'info')}>
                    <Flag className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">لا توجد نتائج مطابقة للفلاتر المحددة</p>
        </div>
      )}
    </div>
  );
}