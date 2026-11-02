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
import { UpcomingDeadlines } from './components/UpcomingDeadlines';
import { EducationalAdBanner } from './components/EducationalAdBanner';
import {
  GraduationCap,
  Moon,
  Sun,
  Share2,
  Printer,
  HelpCircle,
  Sparkles,
  Building,
  CheckCircle2,
  ShieldCheck,
  SearchX,
  Calendar,
  Clock,
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

  // Modals state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPrintReportOpen, setIsPrintReportOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Active view tab
  const [activeTab, setActiveTab] = useState<'all' | 'eligibility' | 'deadlines'>('all');

  // Compute evaluation
  const evaluationResults = useMemo(() => {
    return evaluateStudentEligibility(profile);
  }, [profile]);

  // Filter evaluation results by category & search query
  const filteredResults = useMemo(() => {
    return evaluationResults.filter((item) => {
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
  }, [evaluationResults, activeCategory, searchQuery, statusFilter]);

  const handleReset = () => {
    setProfile(INITIAL_PROFILE);
    setActiveCategory('all');
    setStatusFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Top Floating App Bar */}
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Logo & Brand Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
                  ভার্সিটি ভর্তি যোগ্যতা যাচাইকারী
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  সঠিক ও বিশ্বস্ত
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                বুয়েট, ঢাবি, মেডিকেল, গুচ্ছ ও অন্যান্য বিশ্ববিদ্যালয়ের সর্বশেষ নিয়মানুযায়ী
              </p>
            </div>
          </div>

          {/* Action buttons: Facebook Share, PDF Print, Guide, Dark mode toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Deadlines Quick Toggle Button */}
            <button
              onClick={() => setActiveTab(activeTab === 'deadlines' ? 'all' : 'deadlines')}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition border ${
                activeTab === 'deadlines'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700/80'
              }`}
              title="ভর্তি পরীক্ষার সময়সূচী ও ডেডলাইন"
            >
              <Calendar className="w-4 h-4 text-emerald-500" />
              <span className="hidden sm:inline">সময়সূচী</span>
            </button>

            {/* Guide Button */}
            <button
              onClick={() => setIsGuideModalOpen(true)}
              type="button"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 transition"
              title="ভর্তি নির্দেশিকা ও নিয়মাবলী"
            >
              <HelpCircle className="w-4 h-4 text-indigo-500" />
              <span>নির্দেশিকা</span>
            </button>

            {/* Print / PDF Button */}
            <button
              onClick={() => setIsPrintReportOpen(true)}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200/80 dark:border-indigo-800/60 transition shadow-sm"
              title="পিডিএফ বা প্রিন্ট সামারি রিপোর্ট"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">পিডিএফ সামারি</span>
            </button>

            {/* Facebook / Social Share Button */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              type="button"
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl text-white bg-[#1877F2] hover:bg-[#0d6eed] shadow-sm shadow-blue-500/20 transition"
              title="ফেসবুক ও সোশ্যাল মিডিয়ায় শেয়ার করুন"
            >
              <Share2 className="w-4 h-4" />
              <span>শেয়ার</span>
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              type="button"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
              aria-label={isDarkMode ? 'লাইট মোড চালু করুন' : 'ডার্ক মোড চালু করুন'}
              title={isDarkMode ? 'লাইট মোড' : 'ডার্ক মোড'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner with Three.js particle canvas */}
      <section className="relative bg-gradient-to-b from-indigo-50/70 via-slate-50 to-white dark:from-slate-900/90 dark:via-slate-950 dark:to-slate-950 pt-8 pb-10 border-b border-slate-200/60 dark:border-slate-800/80 overflow-hidden">
        {/* Three.js Interactive Particle Constellation */}
        <ThreeCanvas isDarkMode={isDarkMode} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-100/90 dark:bg-indigo-950/90 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-3 border border-indigo-200 dark:border-indigo-800 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
              এইচএসসি ২০২৬ (২৬ ব্যাচ) ও ২য় বার পরীক্ষার্থীদের হালনাগাদ সার্কুলার
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              ২৬ ব্যাচ: কোন কোন বিশ্ববিদ্যালয়ে আপনি পরীক্ষা দিতে পারবেন?
            </h1>

            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              এইচএসসি ২০২৬ সালে যারা পরীক্ষা দিয়েছে/দিচ্ছে তাদের জন্য বুয়েট, ঢাবি, মেডিকেল, গুচ্ছ ও অন্যান্য ভার্সিটির শর্তাবলী। 
              কোনো ইউনিটে পরীক্ষা দিতে না পারলে তার <span className="text-rose-600 dark:text-rose-400 font-bold">সুনির্দিষ্ট কারণ ও নম্বর ঘাটতি</span> লাল রঙে স্পষ্টভাবে প্রদর্শিত হবে।
            </p>

            {/* Quick Feature Badges */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-900/80 shadow-xs border border-slate-200/80 dark:border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                বুয়েট ও CKRUET
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-900/80 shadow-xs border border-slate-200/80 dark:border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                মেডিকেল ও ডেন্টাল
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-900/80 shadow-xs border border-slate-200/80 dark:border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ঢাবি, রাবি, জাবি, চবি
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-900/80 shadow-xs border border-slate-200/80 dark:border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ২৪ জিএসটি ও কৃষি গুচ্ছ
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-900/80 shadow-xs border border-slate-200/80 dark:border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                জাতীয় ও প্রাইভেট ভার্সিটি
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Educational Sponsor / Ad Banner with explanation */}
        <EducationalAdBanner />

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center justify-center">
          <div className="inline-flex p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-300/60 dark:border-slate-700/60 text-xs font-bold gap-1 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl transition ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              সবগুলো ফিচার
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('eligibility')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition ${
                activeTab === 'eligibility'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              যোগ্যতা যাচাই ({evaluationResults.filter((r) => r.isEligibleAnyUnit).length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('deadlines')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition ${
                activeTab === 'deadlines'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              ভর্তি ডেডলাইন ২০২৬
            </button>
          </div>
        </div>

        {/* Step 1: Input Form */}
        <section aria-label="Student Information Form">
          <StudentForm
            profile={profile}
            onChange={(updated) => setProfile(updated)}
            onReset={handleReset}
          />
        </section>

        {/* Upcoming Deadlines Section (Shown when activeTab is 'deadlines' or 'all') */}
        {(activeTab === 'deadlines' || activeTab === 'all') && (
          <section aria-label="Upcoming Deadlines Section">
            <UpcomingDeadlines evaluationResults={evaluationResults} />
          </section>
        )}

        {/* Step 2 & 3: Eligibility Analytics & University Cards (Shown when activeTab is 'eligibility' or 'all') */}
        {(activeTab === 'eligibility' || activeTab === 'all') && (
          <>
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

            {/* Step 3: University Evaluation Cards Grid */}
            <section aria-label="Universities Evaluation List" className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                <span>
                  প্রদর্শিত হচ্ছে: <strong className="text-slate-800 dark:text-white">{filteredResults.length}</strong>টি বিশ্ববিদ্যালয়ের মূল্যায়ন
                </span>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    ফিল্টার মুছুন
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
                    আপনার প্রদত্ত অনুসন্ধান বা ফিল্টারের সাথে মিলে এমন কোনো বিশ্ববিদ্যালয় বা ইউনিট খুঁজে পাওয়া যায়নি। ক্যাটাগরি বা সার্চ কিওয়ার্ড পরিবর্তন করুন।
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
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
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
                বাংলাদেশ শিক্ষা মন্ত্রণালয় ও পাবলিক বিশ্ববিদ্যালয়গুলোর সর্বশেষ অফিশিয়াল ভর্তি নির্দেশিকা ভিত্তিক
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
