import React from 'react';
import { UniversityCategory, UniversityEvaluationResult } from '../types/admission';
import {
  CheckCircle2,
  XCircle,
  Building2,
  Filter,
  Search,
  Check,
  AlertTriangle,
} from 'lucide-react';

interface ResultsSummaryProps {
  results: UniversityEvaluationResult[];
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  statusFilter: 'all' | 'eligible' | 'ineligible';
  onStatusFilterChange: (status: 'all' | 'eligible' | 'ineligible') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const CATEGORIES: { id: string; label: string; icon: string }[] = [
  { id: 'all', label: 'সকল বিশ্ববিদ্যালয়', icon: '🎓' },
  { id: 'general_public', label: 'শীর্ষ স্বায়ত্তশাসিত (ঢাবি, রাবি, জাবি, চবি)', icon: '🏛️' },
  { id: 'engineering', label: 'ইঞ্জিনিয়ারিং (বুয়েট, CKRUET, বুটেক্স, MIST)', icon: '⚙️' },
  { id: 'medical', label: 'মেডিকেল ও ডেন্টাল (MBBS & BDS)', icon: '🩺' },
  { id: 'gst_cluster', label: 'জিএসটি গুচ্ছ (২৪টি বিশ্ববিদ্যালয়)', icon: '🌐' },
  { id: 'agri_cluster', label: 'কৃষি গুচ্ছ (৮টি বিশ্ববিদ্যালয়)', icon: '🌾' },
  { id: 'specialized', label: 'বিশেষায়িত (BUP ও ৭ কলেজ)', icon: '🎖️' },
  { id: 'national', label: 'জাতীয় বিশ্ববিদ্যালয় (NU)', icon: '🏫' },
  { id: 'private', label: 'শীর্ষ বেসরকারি (NSU, BRAC, AUST)', icon: '🏢' },
];

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  results,
  activeCategory,
  onCategoryChange,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchChange,
}) => {
  // Aggregate stats
  let totalUnits = 0;
  let totalEligibleUnits = 0;
  let totalIneligibleUnits = 0;
  let eligibleUnivCount = 0;

  results.forEach((r) => {
    totalUnits += r.totalUnitCount;
    totalEligibleUnits += r.eligibleUnitCount;
    totalIneligibleUnits += r.totalUnitCount - r.eligibleUnitCount;
    if (r.isEligibleAnyUnit) eligibleUnivCount++;
  });

  const percentage = totalUnits > 0 ? Math.round((totalEligibleUnits / totalUnits) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Visual Analytics Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-5 md:p-6 shadow-xl border border-indigo-800/40 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-semibold mb-2">
              <Building2 className="w-3.5 h-3.5 text-indigo-300" />
              যোগ্যতা যাচাইকরণ ফলাফল রিপোর্ট
            </div>
            <h3 className="text-xl md:text-2xl font-extrabold tracking-tight">
              আপনি মোট <span className="text-emerald-400 underline decoration-emerald-500/50">{totalEligibleUnits}টি</span> বিশ্ববিদ্যালয় ইউনিটে পরীক্ষা দিতে পারবেন!
            </h3>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              মোট {results.length}টি প্রতিষ্ঠান ও {totalUnits}টি ইউনিটের মধ্যে আপনার প্রাপ্ত গ্রেড অনুযায়ী বিস্তারিত বিশ্লেষণ নিচে দেওয়া হলো।
            </p>
          </div>

          {/* Quick Counter Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-emerald-500/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400">পরীক্ষা দেওয়ার যোগ্য</div>
                <div className="text-lg font-bold text-emerald-400 font-mono">
                  {totalEligibleUnits} <span className="text-xs text-slate-400">টি ইউনিট</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-rose-500/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400">শর্ত ঘাটতি / অযোগ্য</div>
                <div className="text-lg font-bold text-rose-400 font-mono">
                  {totalIneligibleUnits} <span className="text-xs text-slate-400">টি ইউনিট</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-indigo-500/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-sm">
                {percentage}%
              </div>
              <div>
                <div className="text-[11px] text-slate-400">যোগ্যতার হার</div>
                <div className="text-lg font-bold text-indigo-300 font-mono">
                  {eligibleUnivCount} / {results.length} <span className="text-xs text-slate-400">ভার্সিটি</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-md border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ভার্সিটি বা ইউনিটের নাম দিয়ে খুঁজুন (যেমন: বুয়েট, ঢাবি, A Unit)..."
            className="w-full pl-9 pr-4 py-2 rounded-lg text-xs md:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
          />
        </div>

        {/* Status Filter Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold self-start md:self-auto">
          <button
            type="button"
            onClick={() => onStatusFilterChange('all')}
            className={`px-3 py-1.5 rounded-md transition ${
              statusFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            সবগুলো ({totalUnits})
          </button>
          <button
            type="button"
            onClick={() => onStatusFilterChange('eligible')}
            className={`px-3 py-1.5 rounded-md transition flex items-center gap-1 ${
              statusFilter === 'eligible'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'text-emerald-700 dark:text-emerald-400 hover:text-emerald-800'
            }`}
          >
            <Check className="w-3 h-3" />
            শুধুমাত্র যোগ্য ({totalEligibleUnits})
          </button>
          <button
            type="button"
            onClick={() => onStatusFilterChange('ineligible')}
            className={`px-3 py-1.5 rounded-md transition flex items-center gap-1 ${
              statusFilter === 'ineligible'
                ? 'bg-rose-600 text-white shadow-sm font-bold'
                : 'text-rose-600 dark:text-rose-400 hover:text-rose-700'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            অযোগ্য / কারণ ({totalIneligibleUnits})
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
