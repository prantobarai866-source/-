import React, { useState } from 'react';
import { Sparkles, Info, X, ExternalLink, HelpCircle, BookOpen, Award } from 'lucide-react';

export const EducationalAdBanner: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-300/60 dark:border-amber-800/60 p-4 transition-all shadow-xs">
      {/* Top Banner Bar */}
      <div className="flex items-center justify-between text-[11px] font-bold text-amber-800 dark:text-amber-300 pb-2 border-b border-amber-200/50 dark:border-amber-900/50">
        <span className="flex items-center gap-1.5 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          এডমিশন পার্টনার ও স্পন্সরড বিজ্ঞপ্তি (Educational Sponsor / Ad)
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-300 hover:underline cursor-pointer"
          >
            <HelpCircle className="w-3 h-3" />
            <span>এড কেন আসে না?</span>
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
            title="লুকান"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Educational Ad Content */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black shrink-0 shadow-sm">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              এইচএসসি ২৬ ব্যাচ বিশ্ববিদ্যালয় ভর্তি প্রশ্নব্যাংক ও স্পেশাল মডেল টেস্ট
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
              বুয়েট, মেডিকেল ও ঢাবির বিগত ২০ বছরের অধ্যায়ভিত্তিক প্রশ্ন ও সমাধান সংগ্রহ করুন।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-200/60 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 font-semibold font-mono">
            স্পন্সরড
          </span>
          <button
            type="button"
            onClick={() => setShowInfo(true)}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow-xs"
          >
            বিস্তারিত দেখুন
          </button>
        </div>
      </div>

      {/* Explanatory Dropdown for "ওয়েব পেইজে এড আসে না কেন" */}
      {showInfo && (
        <div className="mt-3 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 text-xs text-slate-700 dark:text-slate-300 space-y-2">
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-amber-600">
            <Info className="w-4 h-4" />
            ওয়েব পেইজে গুগল এড (Google AdSense) না আসার কারণসমূহ:
          </div>
          <ul className="space-y-1 pl-4 list-disc text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            <li>
              <strong>১. পাবলিশার আইডি (Publisher ID):</strong> গুগল এডসেন্স এর বাণিজ্যিক এড দেখানোর জন্য অনুমোদিত <code>ca-pub-XXXXXXXXXX</code> আইডি এবং ডোমেইন ভেরিফিকেশন প্রয়োজন হয়।
            </li>
            <li>
              <strong>২. ডেভেলপার ও প্রিভিউ এনভায়রনমেন্ট:</strong> ডেভেলপমেন্ট সার্ভার বা ক্লাউড রান প্রিভিউ ইউআরএলে এডসেন্স স্বয়ংক্রিয়ভাবে আসল বাণিজ্যিক বিজ্ঞাপন ডিসপ্লে করে না।
            </li>
            <li>
              <strong>৩. ব্রাউজার এড-ব্লকার:</strong> আপনার ব্রাউজারে AdBlock, uBlock Origin বা Brave Shields চালু থাকলে তা বিজ্ঞাপন স্ক্রিপ্ট ব্লক করে দিতে পারে।
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
