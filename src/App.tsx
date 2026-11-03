/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { StudentProfile } from './types/admission';
import { evaluateStudentEligibility } from './utils/evaluator';
import { StudentForm } from './components/StudentForm';
import { ResultsSummary } from './components/ResultsSummary';
import { UniversityCard } from './components/UniversityCard';
import { ShareModal } from './components/ShareModal';
import { PrintReport } from './components/PrintReport';
import { AdmissionGuideModal } from './components/AdmissionGuideModal';
import { ThreeCanvas } from './components/ThreeCanvas';
import { AdvertisementBanner } from './components/AdvertisementBanner';
import { useToast } from './context/ToastContext';
import {
  GraduationCap,
  Moon,
  Sun,
  Share2,
  Printer,
  Sparkles,
  CheckCircle2,
  SearchX,
  Bookmark,
  Check,
} from 'lucide-react';

const INITIAL_PROFILE: StudentProfile = {
  studentName: '',
  sscGpa: 5.0,
  hscGpa: 5.0,
  sscPassingYear: 2024,
  hscPassingYear: 2026,
  group: 'science',
  isTribalQuota: false,
  subjects: {
    physics: { gradeLetter: 'A+', gradePoint: 5.0 },
    chemistry: { gradeLetter: 'A+', gradePoint: 5.0 },
    math: { gradeLetter: 'A+', gradePoint: 5.0 },
    biology: { gradeLetter: 'A+', gradePoint: 5.0 },
    english: { gradeLetter: 'A+', gradePoint: 5.0 },
    bangla: { gradeLetter: 'A+', gradePoint: 5.0 },
    accounting: { gradeLetter: 'A+', gradePoint: 5.0 },
    economics: { gradeLetter: 'A', gradePoint: 4.0 },
  },
};

export default function App() {
  // Theme state with localStorage
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bd_admission_dark_mode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Sync dark class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('bd_admission_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('bd_admission_dark_mode', 'false');
    }
  }, [isDarkMode]);

  // Student Profile state
  const [profile, setProfile] = useState<StudentProfile>(INITIAL_PROFILE);

  // Active Category Filter
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Status Filter: all | eligible | ineligible
  const [statusFilter, setStatusFilter] = useState<'all' | 'eligible' | 'ineligible'>('all');

  // Search Query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Show only tracked universities filter
  const [showTrackedOnly, setShowTrackedOnly] = useState<boolean>(false);

  // Tracked universities list with localStorage persistence
  const [trackedUnivIds, setTrackedUnivIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bd_admission_tracked_univs');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  const { notifyTrackList } = useToast();

  const handleToggleTrack = (universityId: string, universityNameBn: string) => {
    setTrackedUnivIds((prev) => {
      const isCurrentlyTracked = prev.includes(universityId);
      let updated: string[];
      if (isCurrentlyTracked) {
        updated = prev.filter((id) => id !== universityId);
        notifyTrackList(universityNameBn, false);
      } else {
        updated = [...prev, universityId];
        notifyTrackList(universityNameBn, true);
      }
      try {
        localStorage.setItem('bd_admission_tracked_univs', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save tracked universities:', err);
      }
      return updated;
    });
  };

  // Modals state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPrintReportOpen, setIsPrintReportOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Compute evaluation
  const evaluationResults = useMemo(() => {
    return evaluateStudentEligibility(profile);
  }, [profile]);

  // Filter evaluation results by category, search query, status & tracked filter
  const filteredResults = useMemo(() => {
    return evaluationResults.filter((item) => {
      // Tracked filter
      if (showTrackedOnly && !trackedUnivIds.includes(item.university.id)) {
        return false;
      }

      // Category filter
      if (activeCategory !== 'all' && item.university.category !== activeCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchUnivName =
          item.university.nameBn.toLowerCase().includes(query) ||
          item.university.nameEn.toLowerCase().includes(query) ||
          item.university.shortName.toLowerCase().includes(query) ||
          item.university.locationBn.toLowerCase().includes(query);

        const matchUnit = item.unitsResult.some(
          (u) =>
            u.unitCode.toLowerCase().includes(query) ||
            u.unitNameBn.toLowerCase().includes(query)
        );

        if (!matchUnivName && !matchUnit) {
          return false;
        }
      }

      // Status filter
      if (statusFilter === 'eligible' && !item.isEligibleAnyUnit) {
        return false;
      }
      if (statusFilter === 'ineligible' && item.eligibleUnitCount === item.totalUnitCount) {
        return false;
      }

      return true;
    });
  }, [evaluationResults, activeCategory, searchQuery, statusFilter, showTrackedOnly, trackedUnivIds]);

  const handleReset = () => {
    setProfile(INITIAL_PROFILE);
    setActiveCategory('all');
    setStatusFilter('all');
    setSearchQuery('');
    setShowTrackedOnly(false);
  };

  const eligibleCount = evaluationResults.filter((r) => r.isEligibleAnyUnit).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200 relative">
      {/* Global University Campus Architectural Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.08] dark:opacity-[0.12] filter saturate-110"
          style={{
            backgroundImage: `url('/campus_bg.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/95 via-slate-50/85 to-slate-100/95 dark:from-slate-950/95 dark:via-slate-950/85 dark:to-slate-950/98" />
      </div>

      {/* Top Floating App Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Student Profile Avatar & Brand Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-200 dark:border-indigo-900 shadow-sm shrink-0 bg-slate-100 dark:bg-slate-800">
              <img
                src="/assets/aistudio/1793625516789_e44048bc.jpg"
                alt="শিক্ষার্থী প্রোফাইল"
                className="w-full h-full object-cover object-top scale-150 -translate-y-1"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                ভার্সিটি ভর্তি
              </span>
              <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-tight">
                যোগ্যতা যাচাইকারী
              </span>
            </div>
          </div>

          {/* Action buttons: Tracked, Print, Share, Theme Toggle */}
          <div className="flex items-center gap-2">
            {/* Tracked Universities Button */}
            {trackedUnivIds.length > 0 && (
              <button
                onClick={() => setShowTrackedOnly(!showTrackedOnly)}
                type="button"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs border ${
                  showTrackedOnly
                    ? 'bg-amber-500 text-white border-amber-500 shadow-amber-500/20'
                    : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700 hover:bg-amber-100'
                }`}
                title="আমার পছন্দের ভার্সিটি তালিকা ফিল্টার করুন"
              >
                <Bookmark className={`w-4 h-4 ${showTrackedOnly ? 'fill-current text-white' : 'text-amber-500 fill-current'}`} />
                <span className="hidden sm:inline">পছন্দের তালিকা</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${showTrackedOnly ? 'bg-white text-amber-600' : 'bg-amber-500 text-white'}`}>
                  {trackedUnivIds.length}
                </span>
              </button>
            )}

            {/* Print / PDF Button */}
            <button
              onClick={() => setIsPrintReportOpen(true)}
              type="button"
              className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700/80 transition shadow-xs"
              title="পিডিএফ বা প্রিন্ট সামারি রিপোর্ট"
            >
              <Printer className="w-5 h-5" />
            </button>

            {/* Facebook / Social Share Button */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              type="button"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-white bg-[#1877F2] hover:bg-[#0d6eed] shadow-sm shadow-blue-500/20 transition"
              title="ফেসবুক ও সোশ্যাল মিডিয়ায় শেয়ার করুন"
            >
              <Share2 className="w-4 h-4" />
              <span>শেয়ার</span>
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              type="button"
              className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition shadow-xs"
              aria-label={isDarkMode ? 'লাইট মোড চালু করুন' : 'ডার্ক মোড চালু করুন'}
              title={isDarkMode ? 'লাইট মোড' : 'ডার্ক মোড'}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner with Dhaka University Curzon Hall & Campus Landscape Background */}
      <section className="relative overflow-hidden pt-8 pb-28 sm:pb-32 border-b border-slate-200/60 dark:border-slate-800/80">
        {/* Full Colorful University Campus Background (Curzon Hall, Library, Lawn) */}
        <div
          className="absolute inset-0 bg-cover bg-bottom sm:bg-center bg-no-repeat opacity-90 dark:opacity-40 transition-opacity"
          style={{
            backgroundImage: `url('/campus_bg.jpg')`,
          }}
          aria-hidden="true"
        />

        {/* Soft atmospheric gradient so campus buildings shine through */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/92 via-white/80 to-transparent dark:from-slate-950/95 dark:via-slate-950/85 dark:to-slate-950/60" />

        {/* Bottom lawn fade into page background */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-slate-50/60 dark:via-slate-950/60 to-transparent pointer-events-none" />

        {/* Three.js Interactive Particle Constellation overlay */}
        <ThreeCanvas isDarkMode={isDarkMode} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-slate-900 dark:text-white">
          <div className="text-center">
            {/* Top Lavender Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ede9fe]/90 dark:bg-indigo-950/80 text-[#4338ca] dark:text-indigo-200 text-xs sm:text-sm font-bold mb-3 border border-[#ddd6fe] dark:border-indigo-800 shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
              এইচএসসি ২০২৬ (২৬ ব্যাচ) ও ২য় বার পরীক্ষার্থীদের হালনাগাদ সার্কুলার
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              ২৬ ব্যাচ: কোন কোন বিশ্ববিদ্যালয়ে আপনি পরীক্ষা দিতে পারবেন?
            </h1>

            {/* Paragraph Text with Red Highlight */}
            <p className="mt-3 text-xs sm:text-sm md:text-base text-slate-800 dark:text-slate-200 leading-relaxed max-w-2xl mx-auto font-medium">
              আপনার এসএসসি ও এইচএসসি জিপিএ এবং বিষয়ভিত্তিক গ্রেড দিয়ে জেনে নিন বুয়েট, ঢাবি, মেডিকেল, গুচ্ছ ও অন্যান্য ভার্সিটির যোগ্যতা। 
              কোনো ইউনিটে পরীক্ষা দিতে না পারলে তার <span className="text-[#dc2626] dark:text-rose-400 font-bold">সুনির্দিষ্ট কারণ ও নম্বর ঘাটতি</span> স্পষ্টভাবে দেখানো হয়েছে।
            </p>

            {/* University Feature Badges Matching User Request */}
            <div className="mt-5 flex flex-col items-center gap-2.5 max-w-xl mx-auto">
              {/* Row 1 */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 w-full">
                <span className="flex-1 max-w-[240px] px-4 py-2 rounded-full bg-white/95 dark:bg-slate-900/90 shadow-sm border border-slate-200/90 dark:border-slate-700/80 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 stroke-[2.5]" />
                  <span>বুয়েট ও CKRUET</span>
                </span>
                <span className="flex-1 max-w-[240px] px-4 py-2 rounded-full bg-white/95 dark:bg-slate-900/90 shadow-sm border border-slate-200/90 dark:border-slate-700/80 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 stroke-[2.5]" />
                  <span>মেডিকেল ও ডেন্টাল</span>
                </span>
              </div>

              {/* Row 2 */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 w-full">
                <span className="flex-1 max-w-[240px] px-4 py-2 rounded-full bg-white/95 dark:bg-slate-900/90 shadow-sm border border-slate-200/90 dark:border-slate-700/80 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 stroke-[2.5]" />
                  <span>ঢাবি, রাবি, জাবি, চবি</span>
                </span>
                <span className="flex-1 max-w-[240px] px-4 py-2 rounded-full bg-white/95 dark:bg-slate-900/90 shadow-sm border border-slate-200/90 dark:border-slate-700/80 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 stroke-[2.5]" />
                  <span>২৪ জিএসটি ও কৃষি গুচ্ছ</span>
                </span>
              </div>

              {/* Row 3 */}
              <div className="flex items-center justify-center w-full">
                <span className="px-5 py-2 rounded-full bg-white/95 dark:bg-slate-900/90 shadow-sm border border-slate-200/90 dark:border-slate-700/80 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 stroke-[2.5]" />
                  <span>জাতীয় ও প্রাইভেট ভার্সিটি</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-8 relative z-20 -mt-10 sm:-mt-12">
        {/* Step 1: GPA & Subject Input Form */}
        <section aria-label="Student Information Form">
          <StudentForm
            profile={profile}
            onChange={(updated) => setProfile(updated)}
            onReset={handleReset}
          />
        </section>

        {/* Sponsored Educational Ad Banner */}
        <section aria-label="বিজ্ঞাপন ব্যানার" className="w-full">
          <AdvertisementBanner variant="leaderboard" />
        </section>

        {/* Step 2: Evaluation Analytics & Category Controls */}
        <section aria-label="Eligibility Summary & Filter Controls">
          <ResultsSummary
            results={evaluationResults}
            activeCategory={activeCategory}
            onCategoryChange={(cat) => setActiveCategory(cat)}
            statusFilter={statusFilter}
            onStatusFilterChange={(st) => setStatusFilter(st)}
            searchQuery={searchQuery}
            onSearchChange={(q) => setSearchQuery(q)}
          />
        </section>

        {/* In-feed Educational Partner Ad Banner */}
        <AdvertisementBanner variant="compact" />

        {/* Step 3: University Evaluation Cards Grid */}
        <section aria-label="Universities Evaluation List" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 gap-2">
            <div className="flex items-center gap-2">
              <span>
                প্রদর্শিত হচ্ছে: <strong className="text-slate-800 dark:text-white font-mono">{filteredResults.length}</strong>টি বিশ্ববিদ্যালয়ের মূল্যায়ন
              </span>
              {showTrackedOnly && (
                <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold border border-amber-300 dark:border-amber-800">
                  ★ শুধুমাত্র পছন্দের তালিকা
                </span>
              )}
            </div>
            {(searchQuery || showTrackedOnly || activeCategory !== 'all' || statusFilter !== 'all') && (
              <button
                type="button"
                onClick={handleReset}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold self-start sm:self-auto"
              >
                সব ফিল্টার রিসেট করুন
              </button>
            )}
          </div>

          {filteredResults.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
              <SearchX className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800 dark:text-white">
                কোনো ফলাফল পাওয়া যায়নি
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                {showTrackedOnly
                  ? 'আপনার পছন্দের তালিকায় এখনো কোনো বিশ্ববিদ্যালয় যুক্ত করেননি। নিচে যেকোনো বিশ্ববিদ্যালয়ের কার্ডে "ট্র্যাক" বাটনে ক্লিক করে তালিকায় যোগ করুন।'
                  : 'আপনার প্রদত্ত অনুসন্ধান বা ফিল্টারের সাথে মিলে এমন কোনো বিশ্ববিদ্যালয় বা ইউনিট খুঁজে পাওয়া যায়নি। ক্যাটাগরি বা সার্চ কিওয়ার্ড পরিবর্তন করুন।'}
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-500 transition"
              >
                সব ফিল্টার রিসেট করুন
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredResults.map((evalResult) => (
                <UniversityCard
                  key={evalResult.university.id}
                  evaluation={evalResult}
                  statusFilter={statusFilter}
                  isTracked={trackedUnivIds.includes(evalResult.university.id)}
                  onToggleTrack={handleToggleTrack}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                ভার্সিটি এডমিশন এলিজিবিলিটি চেকার (BD University Admission Eligibility Engine)
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                বাংলাদেশ শিক্ষা মন্ত্রণালয় ও পাবলিক বিশ্ববিদ্যালয়গুলোর সর্বশেষ অফিশিয়াল ভর্তি নির্দেশিকা ভিত্তিক
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              ভর্তি নির্দেশিকা
            </button>
            <button
              onClick={() => setIsPrintReportOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              পিডিএফ রিপোর্ট
            </button>
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              ফেসবুক শেয়ার
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        profile={profile}
        results={evaluationResults}
      />

      <PrintReport
        isOpen={isPrintReportOpen}
        onClose={() => setIsPrintReportOpen(false)}
        profile={profile}
        results={evaluationResults}
      />

      <AdmissionGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}
