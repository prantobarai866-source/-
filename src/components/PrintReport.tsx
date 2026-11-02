import React from 'react';
import { StudentProfile, UniversityEvaluationResult } from '../types/admission';
import { getGroupLabelBn } from '../utils/evaluator';
import { Printer, X, Download, GraduationCap, CheckCircle2, XCircle } from 'lucide-react';

interface PrintReportProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  results: UniversityEvaluationResult[];
}

export const PrintReport: React.FC<PrintReportProps> = ({
  isOpen,
  onClose,
  profile,
  results,
}) => {
  if (!isOpen) return null;

  const totalEligible = results.reduce((acc, r) => acc + r.eligibleUnitCount, 0);
  const totalIneligible = results.reduce(
    (acc, r) => acc + (r.totalUnitCount - r.eligibleUnitCount),
    0
  );
  const currentDate = new Date().toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-3xl max-w-4xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Controls Bar (Hidden during print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-sm">
              অভিভাবক ও শিক্ষকদের জন্য এডমিশন এলিজিবিলিটি সামারি রিপোর্ট
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              <Printer className="w-4 h-4" />
              প্রিন্ট বা পিডিএফ সেভ করুন
            </button>
            <button
              onClick={onClose}
              type="button"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div className="p-6 md:p-10 overflow-y-auto print:p-0 print:overflow-visible text-slate-900 bg-white" id="printable-area">
          {/* Institutional Header */}
          <div className="border-b-2 border-indigo-600 pb-5 mb-6 text-center">
            <div className="inline-block px-3 py-1 rounded bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
              বাংলাদেশ বিশ্ববিদ্যালয় ভর্তি পরীক্ষা মূল্যায়ন বিবরণী
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              বিশ্ববিদ্যালয় ভর্তি যোগ্যতা ও প্রাতিষ্ঠানিক সামারি রিপোর্ট
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              বুয়েট, ঢাবি, মেডিকেল, সিকেআরইউইটি, রাবি, জাবি, চবি, জিএসটি ও কৃষি গুচ্ছ নিয়মানুযায়ী প্রস্তুতকৃত
            </p>
            <div className="text-[11px] text-slate-500 mt-2 font-mono">
              রিপোর্ট তৈরির তারিখ: {currentDate}
            </div>
          </div>

          {/* Student Profile Card */}
          <div className="bg-slate-50 rounded-2xl p-4 md:p-5 border border-slate-200 mb-6">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-2 mb-3">
              ১. শিক্ষার্থীর একাডেমিক প্রোফাইল ও ফলাফল
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">শিক্ষার্থীর নাম:</span>
                <span className="font-bold text-slate-900 text-sm">
                  {profile.studentName || 'নাম উল্লেখ নেই'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">এইচএসসি বিভাগ:</span>
                <span className="font-bold text-slate-900 text-sm">
                  {getGroupLabelBn(profile.group)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">এসএসসি ফলাফল:</span>
                <span className="font-bold text-emerald-700 text-sm font-mono">
                  জিপিএ {profile.sscGpa.toFixed(2)} ({profile.sscPassingYear})
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">এইচএসসি ফলাফল:</span>
                <span className="font-bold text-indigo-700 text-sm font-mono">
                  জিপিএ {profile.hscGpa.toFixed(2)} ({profile.hscPassingYear})
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div>
                <span className="text-slate-600 font-medium">সর্বমোট সম্মিলিত জিপিএ: </span>
                <span className="font-extrabold text-indigo-900 font-mono text-sm">
                  {(profile.sscGpa + profile.hscGpa).toFixed(2)} / ১০.০০
                </span>
              </div>
              <div>
                <span className="text-slate-600 font-medium">পরীক্ষার্থীর ধরন: </span>
                <span className="font-bold text-slate-900">
                  {profile.hscPassingYear === 2026
                    ? '১ম বার পরীক্ষার্থী (এইচএসসি ২৬ ব্যাচ)'
                    : profile.hscPassingYear === 2025
                    ? '২য় বার পরীক্ষার্থী (এইচএসসি ২৫ ব্যাচ)'
                    : 'গ্যাপ ইয়ার'}
                </span>
              </div>
              {profile.isTribalQuota && (
                <div className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
                  ★ উপজাতি / পার্বত্য জেলা কোটা প্রযোজ্য
                </div>
              )}
            </div>

            {/* Subject Grade Details */}
            <div className="mt-3 pt-3 border-t border-slate-200/80">
              <span className="text-slate-500 text-[11px] block mb-1.5 font-semibold">
                এইচএসসি বিষয়ভিত্তিক গ্রেড পয়েন্ট:
              </span>
              <div className="flex flex-wrap gap-2">
                {profile.group === 'science' && (
                  <>
                    <GradeBadge name="পদার্থ" grade={profile.subjects.physics.gradeLetter} />
                    <GradeBadge name="রসায়ন" grade={profile.subjects.chemistry.gradeLetter} />
                    <GradeBadge name="উচ্চতর গণিত" grade={profile.subjects.math.gradeLetter} />
                    <GradeBadge name="জীববিজ্ঞান" grade={profile.subjects.biology.gradeLetter} />
                    <GradeBadge name="ইংরেজি" grade={profile.subjects.english.gradeLetter} />
                    <GradeBadge name="বাংলা" grade={profile.subjects.bangla.gradeLetter} />
                  </>
                )}
                {profile.group === 'commerce' && (
                  <>
                    <GradeBadge name="হিসাববিজ্ঞান" grade={profile.subjects.accounting?.gradeLetter || 'A+'} />
                    <GradeBadge name="অর্থনীতি" grade={profile.subjects.economics?.gradeLetter || 'A'} />
                    <GradeBadge name="ইংরেজি" grade={profile.subjects.english.gradeLetter} />
                    <GradeBadge name="বাংলা" grade={profile.subjects.bangla.gradeLetter} />
                  </>
                )}
                {profile.group === 'humanities' && (
                  <>
                    <GradeBadge name="অর্থনীতি/পৌরনীতি" grade={profile.subjects.economics?.gradeLetter || 'A'} />
                    <GradeBadge name="ইংরেজি" grade={profile.subjects.english.gradeLetter} />
                    <GradeBadge name="বাংলা" grade={profile.subjects.bangla.gradeLetter} />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Summary Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6 text-center">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="text-xs text-emerald-800 font-semibold">আবেদনযোগ্য ইউনিট</div>
              <div className="text-2xl font-black text-emerald-700 font-mono mt-0.5">
                {totalEligible}
              </div>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
              <div className="text-xs text-rose-800 font-semibold">শর্ত অপূরণীয় ইউনিট</div>
              <div className="text-2xl font-black text-rose-700 font-mono mt-0.5">
                {totalIneligible}
              </div>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200">
              <div className="text-xs text-indigo-800 font-semibold">মোট যাচাইকৃত প্রতিষ্ঠান</div>
              <div className="text-2xl font-black text-indigo-700 font-mono mt-0.5">
                {results.length}
              </div>
            </div>
          </div>

          {/* Section 3: Eligible Universities List */}
          <div className="mb-6">
            <h2 className="text-sm font-bold text-emerald-800 flex items-center gap-1.5 border-b border-emerald-200 pb-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ২. যেসকল বিশ্ববিদ্যালয় ও ইউনিটে শিক্ষার্থী পরীক্ষা দেওয়ার শতভাগ যোগ্য ({totalEligible}টি)
            </h2>
            <div className="space-y-2 text-xs">
              {results
                .filter((r) => r.isEligibleAnyUnit)
                .map((r) => (
                  <div key={r.university.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/60">
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>{r.university.nameBn}</span>
                      <span className="text-[11px] text-indigo-700 font-mono bg-indigo-50 px-2 py-0.5 rounded">
                        {r.university.categoryNameBn}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {r.unitsResult
                        .filter((u) => u.isEligible)
                        .map((u) => (
                          <span
                            key={u.unitId}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-medium text-[11px]"
                          >
                            ✓ {u.unitCode}: {u.unitNameBn}
                          </span>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Section 4: Ineligible Universities & Exact Reasons */}
          <div className="mb-6">
            <h2 className="text-sm font-bold text-rose-800 flex items-center gap-1.5 border-b border-rose-200 pb-2 mb-3">
              <XCircle className="w-4 h-4 text-rose-600" />
              ৩. যেসকল ইউনিটে শিক্ষার্থী পরীক্ষা দিতে পারবে না এবং তার সুনির্দিষ্ট কারণ ({totalIneligible}টি)
            </h2>
            <div className="space-y-2.5 text-xs">
              {results
                .filter((r) => r.unitsResult.some((u) => !u.isEligible))
                .map((r) => (
                  <div key={r.university.id} className="p-2.5 rounded-lg border border-rose-200 bg-rose-50/40">
                    <div className="font-bold text-slate-900">{r.university.nameBn}</div>
                    <div className="mt-1.5 space-y-1.5">
                      {r.unitsResult
                        .filter((u) => !u.isEligible)
                        .map((u) => (
                          <div key={u.unitId} className="pl-2 border-l-2 border-rose-400">
                            <span className="font-bold text-rose-900">
                              {u.unitCode} ({u.unitNameBn}):
                            </span>
                            <ul className="text-rose-700 mt-0.5 list-disc list-inside">
                              {u.failureReasons.map((reason, idx) => (
                                <li key={idx} className="font-medium text-[11px]">
                                  {reason}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Disclaimer & Signature Footer */}
          <div className="mt-8 pt-4 border-t border-slate-300 text-[10px] text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p>
                * এটি সর্বশেষ বিশ্ববিদ্যালয় ভর্তি বিজ্ঞপ্তি অনুযায়ী অ্যালগরিদমিক পদ্ধতিতে স্বয়ংক্রিয়ভাবে প্রস্তুতকৃত সামারি।
              </p>
              <p>
                চূড়ান্ত আবেদনের পূর্বে সংশ্লিষ্ট বিশ্ববিদ্যালয়ের অফিশিয়াল ওয়েবসাইট ও সার্কুলার যাচাই করে নেওয়ার অনুরোধ করা হচ্ছে।
              </p>
            </div>
            <div className="text-right sm:self-end">
              <div className="w-36 border-b border-slate-400 mb-1"></div>
              <span>অভিভাবক / শিক্ষকের স্বাক্ষর</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GradeBadge: React.FC<{ name: string; grade: string }> = ({ name, grade }) => (
  <span className="px-2 py-0.5 rounded bg-white border border-slate-300 text-[11px] font-mono font-bold text-slate-800">
    {name}: <span className="text-indigo-600">{grade}</span>
  </span>
);
