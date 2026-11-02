import React, { useState, useMemo } from 'react';
import { AdmissionDeadline, DeadlineStatus } from '../types/deadline';
import { ADMISSION_DEADLINES } from '../data/deadlines';
import { UniversityEvaluationResult } from '../types/admission';
import {
  Calendar,
  Clock,
  ExternalLink,
  Filter,
  Search,
  CheckCircle2,
  AlertCircle,
  Bell,
  Sparkles,
  BookmarkPlus,
  Flame,
  DollarSign,
  Building,
} from 'lucide-react';

interface UpcomingDeadlinesProps {
  evaluationResults: UniversityEvaluationResult[];
}

export const UpcomingDeadlines: React.FC<UpcomingDeadlinesProps> = ({ evaluationResults }) => {
  const [filterEligibleOnly, setFilterEligibleOnly] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | DeadlineStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Map university eligibility
  const eligibleUnivIdMap = useMemo(() => {
    const map = new Map<string, boolean>();
    evaluationResults.forEach((res) => {
      map.set(res.university.id, res.isEligibleAnyUnit);
    });
    return map;
  }, [evaluationResults]);

  // Filter deadlines
  const filteredDeadlines = useMemo(() => {
    return ADMISSION_DEADLINES.filter((item) => {
      // Eligible only filter
      if (filterEligibleOnly) {
        const isEligible = eligibleUnivIdMap.get(item.universityId);
        if (!isEligible) return false;
      }

      // Status filter
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName =
          item.universityNameBn.toLowerCase().includes(q) ||
          item.shortName.toLowerCase().includes(q) ||
          item.unitCode.toLowerCase().includes(q);
        if (!matchesName) return false;
      }

      return true;
    });
  }, [filterEligibleOnly, statusFilter, searchQuery, eligibleUnivIdMap]);

  // Helper for Google Calendar URL
  const generateGoogleCalendarUrl = (item: AdmissionDeadline) => {
    const title = encodeURIComponent(`${item.shortName} ভর্তি পরীক্ষার আবেদন শেষ`);
    const details = encodeURIComponent(
      `${item.universityNameBn} (${item.unitCode}) ভর্তি পরীক্ষার আবেদন শেষ তারিখ। আবেদন লিংক: ${item.applyUrl}`
    );
    // Use applicationEndDate format YYYYMMDD
    const endDateClean = item.applicationEndDate.replace(/-/g, '');
    const dates = `${endDateClean}T090000Z/${endDateClean}T180000Z`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dates}`;
  };

  // Helper to format Bengali dates
  const formatBengaliDate = (isoDate: string) => {
    try {
      const [year, month, day] = isoDate.split('-');
      const monthsBn = [
        'জানুয়ারি',
        'ফেব্রুয়ারি',
        'মার্চ',
        'এপ্রিল',
        'মে',
        'জুন',
        'জুলাই',
        'আগস্ট',
        'সেপ্টেম্বর',
        'অক্টোবর',
        'নভেম্বর',
        'ডিসেম্বর',
      ];
      const mIdx = parseInt(month, 10) - 1;
      return `${day} ${monthsBn[mIdx] || month} ${year}`;
    } catch {
      return isoDate;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/90 dark:border-slate-800 p-5 md:p-7 transition-all">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2 border border-emerald-200 dark:border-emerald-800">
            <Clock className="w-3.5 h-3.5 text-emerald-600 animate-spin" style={{ animationDuration: '8s' }} />
            লাইভ এডমিশন ট্র্যাকার ২০২৬
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            আসন্ন ভর্তি পরীক্ষার সময়সূচী ও আবেদন ডেডলাইন
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            আবেদন শুরুর তারিখ, শেষ সময়সীমা, পরীক্ষার তারিখ ও সরাসরি আবেদনের অফিশিয়াল পোর্টাল লিংক
          </p>
        </div>

        {/* Quick Filter: Eligible Only Toggle */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setFilterEligibleOnly(!filterEligibleOnly)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs border ${
              filterEligibleOnly
                ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-500/20'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${filterEligibleOnly ? 'text-white' : 'text-emerald-600'}`} />
            <span>শুধুমাত্র আমার যোগ্য ভার্সিটি ({evaluationResults.filter((r) => r.isEligibleAnyUnit).length})</span>
          </button>
        </div>
      </div>

      {/* Search and Status Filters */}
      <div className="mt-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ভার্সিটি বা পরীক্ষার নাম খুঁজুন (যেমন: মেডিকেল, বুয়েট, ঢাবি)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs md:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
          />
        </div>

        {/* Status Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto self-start md:self-auto text-xs font-semibold">
          {[
            { id: 'all', label: 'সকল সময়সূচী' },
            { id: 'open', label: 'আবেদন চলছে (Open)' },
            { id: 'upcoming', label: 'শীঘ্রই শুরু (Upcoming)' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Deadlines Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDeadlines.map((dl) => {
          const isEligible = eligibleUnivIdMap.get(dl.universityId);
          const isOpen = dl.status === 'open';

          return (
            <div
              key={dl.id}
              className={`p-4 md:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                isOpen
                  ? 'bg-gradient-to-br from-emerald-50/40 via-white to-slate-50 dark:from-emerald-950/15 dark:via-slate-900 dark:to-slate-900 border-emerald-300 dark:border-emerald-800/80 shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                {/* Top Row: Short Name, Status badge & Eligibility chip */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {dl.shortName}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isOpen
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-500 animate-ping' : 'bg-blue-500'}`} />
                      {isOpen ? 'আবেদন চলছে' : 'শীঘ্রই শুরু'}
                    </span>
                  </div>

                  {/* Candidate Eligibility Status for this university */}
                  {isEligible !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                        isEligible
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      {isEligible ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>আপনি যোগ্য</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                          <span>শর্ত অপূর্ণ</span>
                        </>
                      )}
                    </span>
                  )}
                </div>

                {/* University Name & Unit */}
                <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {dl.universityNameBn}
                </h4>
                <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                  {dl.unitCode}
                </div>

                {/* Dates Table Breakdown */}
                <div className="mt-3.5 space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      আবেদনের সময়সীমা:
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {formatBengaliDate(dl.applicationStartDate)} — {formatBengaliDate(dl.applicationEndDate)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                      ভর্তি পরীক্ষার তারিখ:
                    </span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      {dl.examDate.includes('-') ? formatBengaliDate(dl.examDate) : dl.examDate}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                      আবেদন ফি:
                    </span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {dl.applicationFee}
                    </span>
                  </div>
                </div>

                {dl.importantNoticeBn && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2.5 pl-1 italic">
                    ★ {dl.importantNoticeBn}
                  </p>
                )}
              </div>

              {/* Action Buttons: Apply & Google Calendar */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <a
                  href={dl.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  <span>অনলাইনে আবেদন করুন</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={generateGoogleCalendarUrl(dl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="গুগল ক্যালেন্ডারে রিমাইন্ডার সেট করুন"
                  className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition border border-slate-200 dark:border-slate-700"
                >
                  <BookmarkPlus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDeadlines.length === 0 && (
        <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
          প্রদত্ত ফিল্টারের সাথে মিলে এমন কোনো ডেডলাইন পাওয়া যায়নি।
        </div>
      )}
    </div>
  );
};
