import React, { useState } from 'react';
import { AcademicGroup, GradeLetter, StudentProfile } from '../types/admission';
import { GRADE_POINTS } from '../utils/evaluator';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  Calendar,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface StudentFormProps {
  profile: StudentProfile;
  onChange: (updated: StudentProfile) => void;
  onReset: () => void;
}

const PRESETS: {
  title: string;
  badge: string;
  profile: Partial<StudentProfile>;
}[] = [
  {
    title: '২৬ ব্যাচ গোল্ডেন A+ (১ম বার)',
    badge: 'বুয়েট • ঢাবি • মেডিকেল যোগ্য',
    profile: {
      studentName: 'রাকিব হাসান',
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
      },
    },
  },
  {
    title: '২৬ ব্যাচ বিজ্ঞান জিপিএ ৪.৮৩',
    badge: 'মেডিকেল • রাবি • জাবি • গুচ্ছ',
    profile: {
      studentName: 'সাদিয়া জাহান',
      sscGpa: 4.89,
      hscGpa: 4.83,
      sscPassingYear: 2024,
      hscPassingYear: 2026,
      group: 'science',
      isTribalQuota: false,
      subjects: {
        physics: { gradeLetter: 'A', gradePoint: 4.0 },
        chemistry: { gradeLetter: 'A', gradePoint: 4.0 },
        math: { gradeLetter: 'A', gradePoint: 4.0 },
        biology: { gradeLetter: 'A+', gradePoint: 5.0 },
        english: { gradeLetter: 'A-', gradePoint: 3.5 },
        bangla: { gradeLetter: 'A', gradePoint: 4.0 },
      },
    },
  },
  {
    title: '২৫ ব্যাচ ২য় বার (HSC 2025)',
    badge: 'মেডিকেল • রাবি • জাবি • গুচ্ছ (৫ কর্তন)',
    profile: {
      studentName: 'ফারহান আহমেদ',
      sscGpa: 4.80,
      hscGpa: 4.75,
      sscPassingYear: 2023,
      hscPassingYear: 2025,
      group: 'science',
      isTribalQuota: false,
      subjects: {
        physics: { gradeLetter: 'A', gradePoint: 4.0 },
        chemistry: { gradeLetter: 'A', gradePoint: 4.0 },
        math: { gradeLetter: 'A', gradePoint: 4.0 },
        biology: { gradeLetter: 'A+', gradePoint: 5.0 },
        english: { gradeLetter: 'A', gradePoint: 4.0 },
        bangla: { gradeLetter: 'A', gradePoint: 4.0 },
      },
    },
  },
  {
    title: '২৬ ব্যাচ বাণিজ্য শাখা (HSC 2026)',
    badge: 'ঢাবি গ • জাবি • রাবি • গুচ্ছ',
    profile: {
      studentName: 'আরিফুল ইসলাম',
      sscGpa: 4.50,
      hscGpa: 4.67,
      sscPassingYear: 2024,
      hscPassingYear: 2026,
      group: 'commerce',
      isTribalQuota: false,
      subjects: {
        physics: { gradeLetter: 'B', gradePoint: 3.0 },
        chemistry: { gradeLetter: 'B', gradePoint: 3.0 },
        math: { gradeLetter: 'A', gradePoint: 4.0 },
        biology: { gradeLetter: 'B', gradePoint: 3.0 },
        english: { gradeLetter: 'A', gradePoint: 4.0 },
        bangla: { gradeLetter: 'A+', gradePoint: 5.0 },
        accounting: { gradeLetter: 'A+', gradePoint: 5.0 },
        economics: { gradeLetter: 'A', gradePoint: 4.0 },
      },
    },
  },
  {
    title: '২৬ ব্যাচ মানবিক শাখা (HSC 2026)',
    badge: 'ঢাবি খ • রাবি • জাবি • গুচ্ছ',
    profile: {
      studentName: 'তানজিলা আক্তার',
      sscGpa: 4.17,
      hscGpa: 4.25,
      sscPassingYear: 2024,
      hscPassingYear: 2026,
      group: 'humanities',
      isTribalQuota: false,
      subjects: {
        physics: { gradeLetter: 'B', gradePoint: 3.0 },
        chemistry: { gradeLetter: 'B', gradePoint: 3.0 },
        math: { gradeLetter: 'B', gradePoint: 3.0 },
        biology: { gradeLetter: 'B', gradePoint: 3.0 },
        english: { gradeLetter: 'A-', gradePoint: 3.5 },
        bangla: { gradeLetter: 'A', gradePoint: 4.0 },
        economics: { gradeLetter: 'A', gradePoint: 4.0 },
      },
    },
  },
];

const GRADE_OPTIONS: GradeLetter[] = ['A+', 'A', 'A-', 'B', 'C', 'D', 'F'];

export const StudentForm: React.FC<StudentFormProps> = ({ profile, onChange, onReset }) => {
  const [showSubjectPanel, setShowSubjectPanel] = useState(true);

  const handleGroupChange = (newGroup: AcademicGroup) => {
    onChange({
      ...profile,
      group: newGroup,
    });
  };

  const handleSubjectGradeChange = (
    subjectKey: keyof StudentProfile['subjects'],
    gradeLetter: GradeLetter
  ) => {
    const point = GRADE_POINTS[gradeLetter];
    onChange({
      ...profile,
      subjects: {
        ...profile.subjects,
        [subjectKey]: {
          gradeLetter,
          gradePoint: point,
        },
      },
    });
  };

  const handleQuickGradeSet = (letter: GradeLetter) => {
    const point = GRADE_POINTS[letter];
    const newSubjects = { ...profile.subjects };
    (Object.keys(newSubjects) as (keyof StudentProfile['subjects'])[]).forEach((key) => {
      newSubjects[key] = {
        gradeLetter: letter,
        gradePoint: point,
      };
    });
    onChange({
      ...profile,
      subjects: newSubjects,
    });
  };

  const applyPreset = (preset: (typeof PRESETS)[0]) => {
    onChange({
      ...profile,
      ...preset.profile,
    } as StudentProfile);
  };

  const totalGpa = Number((profile.sscGpa + profile.hscGpa).toFixed(2));
  const isFirstTimer = profile.hscPassingYear === 2026;
  const isSecondTimer = profile.hscPassingYear === 2025;
  const isGapYear = profile.hscPassingYear < 2025;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-5 md:p-7 transition-all">
      {/* 26 Batch Announcement Header */}
      <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border border-indigo-200/80 dark:border-indigo-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs sm:text-sm font-bold text-indigo-900 dark:text-indigo-200">
            এইচএসসি ২০২৬ ব্যাচ (২৬ ব্যাচ) স্পেশাল এডমিশন মোড সক্রিয়
          </span>
        </div>
        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
          HSC 2026 Batch
        </span>
      </div>

      {/* Header & Quick Presets */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            শিক্ষার্থীর তথ্য ও পরীক্ষার ফলাফল ইনপুট
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            আপনার এসএসসি ও এইচএসসি ফলাফল এবং বিষয়ভিত্তিক গ্রেড নির্বাচন করুন
          </p>
        </div>

        {/* Reset Button */}
        <button
          onClick={onReset}
          type="button"
          className="self-start md:self-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          রিসেট
        </button>
      </div>

      {/* Instant Presets for Easy 1-Click Testing */}
      <div className="mt-4 pt-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          ২৬ ব্যাচ ও ২য় বারের ডেমো রেজাল্ট দিয়ে দ্রুত টেস্ট করুন:
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(preset)}
              className="text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition group"
            >
              <div className="font-semibold text-xs text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                {preset.title}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {preset.badge}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        {/* Student Name */}
        <div className="md:col-span-1">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            শিক্ষার্থীর নাম (অপশনাল)
          </label>
          <input
            type="text"
            value={profile.studentName}
            onChange={(e) => onChange({ ...profile, studentName: e.target.value })}
            placeholder="আপনার নাম লিখুন..."
            className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-800 dark:text-white"
          />
        </div>

        {/* Academic Group */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            এইচএসসি বিভাগ / শাখা
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'science', label: 'বিজ্ঞান (Science)', desc: 'ইঞ্জিনিয়ারিং, মেডিকেল, সাধারণ' },
              { id: 'commerce', label: 'ব্যবসায় শিক্ষা (Commerce)', desc: 'বিবিএ, বাণিজ্য, আইন' },
              { id: 'humanities', label: 'মানবিক (Humanities)', desc: 'কলা, সামাজিক বিজ্ঞান, আইন' },
            ].map((grp) => {
              const isSelected = profile.group === grp.id;
              return (
                <button
                  key={grp.id}
                  type="button"
                  onClick={() => handleGroupChange(grp.id as AcademicGroup)}
                  className={`px-3 py-2.5 rounded-xl border text-left transition flex flex-col justify-center ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 shadow-sm font-semibold'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs md:text-sm font-semibold truncate">{grp.label}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block truncate mt-0.5">
                    {grp.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SSC & HSC GPA + Passing Year Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {/* SSC GPA */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              এসএসসি জিপিএ (SSC GPA)
            </span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
              সর্বোচ্চ ৫.০০
            </span>
          </div>
          <input
            type="number"
            min="2.00"
            max="5.00"
            step="0.01"
            value={profile.sscGpa || ''}
            onChange={(e) => {
              const val = Math.min(5.0, Math.max(0, parseFloat(e.target.value) || 0));
              onChange({ ...profile, sscGpa: val });
            }}
            placeholder="5.00"
            className="w-full text-lg font-bold font-mono px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-white"
          />
          <div className="flex gap-1.5 mt-2">
            {[5.0, 4.8, 4.5, 4.0].map((presetVal) => (
              <button
                key={presetVal}
                type="button"
                onClick={() => onChange({ ...profile, sscGpa: presetVal })}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-100 hover:text-emerald-700 transition"
              >
                {presetVal.toFixed(2)}
              </button>
            ))}
          </div>
        </div>

        {/* SSC Passing Year */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              এসএসসি পাসের সাল
            </span>
          </div>
          <select
            value={profile.sscPassingYear}
            onChange={(e) => onChange({ ...profile, sscPassingYear: parseInt(e.target.value) })}
            className="w-full text-base font-semibold px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
          >
            <option value={2024}>২০২৪ (নিয়মিত এইচএসসি ২৬ ব্যাচ)</option>
            <option value={2023}>২০২৩ (এইচএসসি ২৬ অথবা ২৫ ব্যাচ)</option>
            <option value={2022}>২০২২ (এইচএসসি ২৫ ব্যাচ)</option>
            <option value={2021}>২০২১ বা পূর্ববর্তী</option>
          </select>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 truncate">
            {profile.sscPassingYear === 2024 ? '✅ এইচএসসি ২৬ ব্যাচের নিয়মিত ব্যাচ' : 'পূর্ববর্তী শিক্ষাবর্ষ'}
          </div>
        </div>

        {/* HSC GPA */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              এইচএসসি জিপিএ (HSC GPA)
            </span>
            <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-1.5 py-0.5 rounded">
              সর্বোচ্চ ৫.০০
            </span>
          </div>
          <input
            type="number"
            min="2.00"
            max="5.00"
            step="0.01"
            value={profile.hscGpa || ''}
            onChange={(e) => {
              const val = Math.min(5.0, Math.max(0, parseFloat(e.target.value) || 0));
              onChange({ ...profile, hscGpa: val });
            }}
            placeholder="5.00"
            className="w-full text-lg font-bold font-mono px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 dark:text-white"
          />
          <div className="flex gap-1.5 mt-2">
            {[5.0, 4.83, 4.5, 4.0].map((presetVal) => (
              <button
                key={presetVal}
                type="button"
                onClick={() => onChange({ ...profile, hscGpa: presetVal })}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-purple-100 hover:text-purple-700 transition"
              >
                {presetVal.toFixed(2)}
              </button>
            ))}
          </div>
        </div>

        {/* HSC Passing Year (First Timer vs Second Timer status) */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              এইচএসসি পাসের সাল
            </span>
          </div>
          <select
            value={profile.hscPassingYear}
            onChange={(e) => onChange({ ...profile, hscPassingYear: parseInt(e.target.value) })}
            className="w-full text-base font-semibold px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
          >
            <option value={2026}>২০২৬ (১ম বার / ২৬ ব্যাচ - First Timer)</option>
            <option value={2025}>২০২৫ (২য় বার / ২৫ ব্যাচ - Second Timer)</option>
            <option value={2024}>২০২৪ (৩য় বার / গ্যাপ ইয়ার)</option>
            <option value={2023}>২০২৩ বা পূর্ববর্তী</option>
          </select>

          {/* Real-time Status Badge */}
          <div className="mt-2">
            {isFirstTimer && (
              <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                ১ম বার পরীক্ষার্থী (২৬ ব্যাচ - সকল ভার্সিটিতে সুযোগ)
              </div>
            )}
            {isSecondTimer && (
              <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/50 px-2 py-0.5 rounded-full">
                <AlertCircle className="w-3 h-3 text-amber-600" />
                ২য় বার পরীক্ষার্থী (২৫ ব্যাচ - ঢাবি/বুয়েট ব্যতীত সুযোগ)
              </div>
            )}
            {isGapYear && (
              <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 dark:text-rose-300 bg-rose-100/70 dark:bg-rose-950/50 px-2 py-0.5 rounded-full">
                <AlertCircle className="w-3 h-3 text-rose-600" />
                গ্যাপ ইয়ার (জাতীয় ও প্রাইভেট বিশ্ববিদ্যালয় উন্মুক্ত)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Aggregate GPA Summary Pill & Quota Check */}
      <div className="mt-4 p-3.5 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
            ∑
          </div>
          <div>
            <div className="text-xs text-indigo-950 dark:text-indigo-200">
              এসএসসি ও এইচএসসি সর্বমোট জিপিএ (SSC + HSC Combined)
            </div>
            <div className="text-base font-extrabold text-indigo-700 dark:text-indigo-300 font-mono">
              {totalGpa.toFixed(2)} / ১০.০০
            </div>
          </div>
        </div>

        {/* Quota Checkbox */}
        <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800">
          <input
            type="checkbox"
            checked={profile.isTribalQuota}
            onChange={(e) => onChange({ ...profile, isTribalQuota: e.target.checked })}
            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
          />
          <span>পার্বত্য জেলা / উপজাতি কোটা (বিশেষ জিপিএ শিথিলতা)</span>
        </label>
      </div>

      {/* Section 2: Subject-wise Grades (Crucial for BUET, Medical, Engineering, Agri) */}
      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowSubjectPanel(!showSubjectPanel)}
            className="flex items-center gap-2 text-sm md:text-base font-bold text-slate-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            বিষয়ভিত্তিক গ্রেড ও জিপিএ নির্বাচন (বুয়েট, মেডিকেল ও ইঞ্জিনিয়ারিং শর্ত)
            {showSubjectPanel ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Quick grade fill buttons */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 mr-1">এক ক্লিকে সেট করুন:</span>
            <button
              type="button"
              onClick={() => handleQuickGradeSet('A+')}
              className="px-2 py-1 text-xs font-bold rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 transition"
            >
              সব A+ (5.0)
            </button>
            <button
              type="button"
              onClick={() => handleQuickGradeSet('A')}
              className="px-2 py-1 text-xs font-bold rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-200 transition"
            >
              সব A (4.0)
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          বুয়েট ও চুয়েট-কুয়েট-রুয়েটে গণিত, পদার্থ ও রসায়নে A+ এবং মেডিকেলে জীববিজ্ঞানে ন্যূনতম গ্রেড A (GP 4.00) প্রযোজ্য।
        </p>

        {showSubjectPanel && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {profile.group === 'science' && (
              <>
                {/* Physics */}
                <SubjectGradePicker
                  title="পদার্থবিজ্ঞান (Physics)"
                  badge="বুয়েট ও CKRUET শর্ত"
                  requiredLetter="A+"
                  value={profile.subjects.physics.gradeLetter}
                  onChange={(letter) => handleSubjectGradeChange('physics', letter)}
                />

                {/* Chemistry */}
                <SubjectGradePicker
                  title="রসায়ন (Chemistry)"
                  badge="বুয়েট ও মেডিকেল শর্ত"
                  requiredLetter="A+"
                  value={profile.subjects.chemistry.gradeLetter}
                  onChange={(letter) => handleSubjectGradeChange('chemistry', letter)}
                />

                {/* Higher Math */}
                <SubjectGradePicker
                  title="উচ্চতর গণিত (Higher Math)"
                  badge="বুয়েট ও ইঞ্জিনিয়ারিং শর্ত"
                  requiredLetter="A+"
                  value={profile.subjects.math.gradeLetter}
                  onChange={(letter) => handleSubjectGradeChange('math', letter)}
                />

                {/* Biology */}
                <SubjectGradePicker
                  title="জীববিজ্ঞান (Biology)"
                  badge="মেডিকেল (A) ও কৃষি গুচ্ছ"
                  requiredLetter="A (4.0)"
                  value={profile.subjects.biology.gradeLetter}
                  onChange={(letter) => handleSubjectGradeChange('biology', letter)}
                />

                {/* English */}
                <SubjectGradePicker
                  title="ইংরেজি (English)"
                  badge="বুয়েট (A) ও আইবিএ"
                  requiredLetter="A (4.0)"
                  value={profile.subjects.english.gradeLetter}
                  onChange={(letter) => handleSubjectGradeChange('english', letter)}
                />

                {/* Bangla */}
                <SubjectGradePicker
                  title="বাংলা (Bangla)"
                  badge="বুয়েট শর্ত"
                  requiredLetter="A (4.0)"
                  value={profile.subjects.bangla.gradeLetter}
                  onChange={(letter) => handleSubjectGradeChange('bangla', letter)}
                />
              </>
            )}

            {profile.group === 'commerce' && (
              <>
                <SubjectGradePicker
                  title="হিসাববিজ্ঞান (Accounting)"
                  badge="বিবিএ / গ ইউনিট"
                  requiredLetter="A"
                  value={profile.subjects.accounting?.gradeLetter || 'A+'}
                  onChange={(letter) => handleSubjectGradeChange('accounting', letter)}
                />
                <SubjectGradePicker
                  title="ব্যবসায় সংগঠন / অর্থনীতি"
                  badge="বাণিজ্য অনুষদ"
                  requiredLetter="A-"
                  value={profile.subjects.economics?.gradeLetter || 'A'}
                  onChange={(letter) => handleSubjectGradeChange('economics', letter)}
                />
                <SubjectGradePicker
                  title="ইংরেজি (English)"
                  badge="ঢাবি, জাবি ও আইবিএ"
                  requiredLetter="A-"
                  value={profile.subjects.english.gradeLetter}
                  onChange={(letter) => handleSubjectGradeChange('english', letter)}
                />
                <SubjectGradePicker
                  title="বাংলা (Bangla)"
                  badge="সাধারণ আবশ্যিক"
                  requiredLetter="B"
                  value={profile.subjects.bangla.gradeLetter}
                  onChange={(letter) => handleSubjectGradeChange('bangla', letter)}
                />
              </>
            )}

            {profile.group === 'humanities' && (
              <>
                <SubjectGradePicker
                  title="ইংরেজি (English)"
                  badge="ঢাবি খ ও আইন বিভাগ"
                  requiredLetter="A-"
                  value={profile.subjects.english.gradeLetter}
                  onChange={(letter) => handleSubjectGradeChange('english', letter)}
                />
                <SubjectGradePicker
                  title="বাংলা (Bangla)"
                  badge="কলা ও মানববিদ্যা"
                  requiredLetter="A"
                  value={profile.subjects.bangla.gradeLetter}
                  onChange={(letter) => handleSubjectGradeChange('bangla', letter)}
                />
                <SubjectGradePicker
                  title="অর্থনীতি / পৌরনীতি"
                  badge="সমাজবিজ্ঞান ও আইন"
                  requiredLetter="B"
                  value={profile.subjects.economics?.gradeLetter || 'A'}
                  onChange={(letter) => handleSubjectGradeChange('economics', letter)}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface SubjectGradePickerProps {
  title: string;
  badge: string;
  requiredLetter?: string;
  value: GradeLetter;
  onChange: (letter: GradeLetter) => void;
}

const SubjectGradePicker: React.FC<SubjectGradePickerProps> = ({
  title,
  badge,
  requiredLetter,
  value,
  onChange,
}) => {
  return (
    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between">
      <div className="flex items-start justify-between gap-1 mb-2">
        <div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
            {title}
          </div>
          <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
            {badge}
          </div>
        </div>
        {requiredLetter && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-900/50 font-mono">
            ন্যূনতম: {requiredLetter}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 overflow-x-auto py-0.5">
        {GRADE_OPTIONS.map((g) => {
          const isSelected = value === g;
          return (
            <button
              key={g}
              type="button"
              onClick={() => onChange(g)}
              className={`flex-1 min-w-[28px] py-1 text-xs font-bold font-mono rounded transition ${
                isSelected
                  ? g === 'A+'
                    ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-500'
                    : g === 'A' || g === 'A-'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {g}
            </button>
          );
        })}
      </div>
    </div>
  );
};
