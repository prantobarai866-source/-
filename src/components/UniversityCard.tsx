import React, { useState } from 'react';
import { UniversityEvaluationResult } from '../types/admission';
import {
  CheckCircle2,
  XCircle,
  ExternalLink,
  MapPin,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info,
  Check,
  Flame,
  Users,
} from 'lucide-react';

interface UniversityCardProps {
  evaluation: UniversityEvaluationResult;
  statusFilter: 'all' | 'eligible' | 'ineligible';
}

export const UniversityCard: React.FC<UniversityCardProps> = ({ evaluation, statusFilter }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { university, unitsResult, isEligibleAnyUnit, eligibleUnitCount, totalUnitCount } =
    evaluation;

  // Filter units according to statusFilter
  const visibleUnits = unitsResult.filter((unit) => {
    if (statusFilter === 'eligible') return unit.isEligible;
    if (statusFilter === 'ineligible') return !unit.isEligible;
    return true;
  });

  if (visibleUnits.length === 0) {
    return null;
  }

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm border transition-all duration-200 overflow-hidden ${
        isEligibleAnyUnit
          ? 'border-slate-200/90 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600/60'
          : 'border-slate-200/90 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-900/60'
      }`}
    >
      {/* University Card Header */}
      <div className="p-4 md:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            {/* Institution Badge Avatar */}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-sm ${
                isEligibleAnyUnit
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white'
                  : 'bg-gradient-to-br from-slate-600 to-slate-800 text-slate-200'
              }`}
            >
              {university.shortName.slice(0, 4)}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">
                  {university.nameBn}
                </h4>
                {university.badgeText && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-500" />
                    {university.badgeText}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span className="font-mono text-slate-600 dark:text-slate-300 font-semibold">
                  {university.nameEn}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {university.locationBn}
                </span>
              </div>
            </div>
          </div>

          {/* Right Header Status & Official Site link */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Status Pill */}
            <div
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                isEligibleAnyUnit
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                  : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
              }`}
            >
              {isEligibleAnyUnit ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    {eligibleUnitCount} / {totalUnitCount} ইউনিটে যোগ্য
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>শর্ত অপূরণীয়</span>
                </>
              )}
            </div>

            {/* Official Website / Circular Link */}
            {university.admissionCircularUrl && (
              <a
                href={university.admissionCircularUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="অফিসিয়াল ভর্তি ওয়েবসাইট"
                className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {/* Collapse toggle */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={isExpanded ? 'লুকান' : 'বিস্তারিত দেখুন'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {university.descriptionBn && (
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 pl-1 leading-relaxed">
            {university.descriptionBn}
          </p>
        )}
      </div>

      {/* Units List */}
      {isExpanded && (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {visibleUnits.map((unit) => (
            <div
              key={unit.unitId}
              className={`p-4 md:p-5 transition-colors ${
                unit.isEligible
                  ? 'hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10'
                  : 'hover:bg-rose-50/30 dark:hover:bg-rose-950/10 bg-rose-50/10 dark:bg-rose-950/5'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                {/* Unit title & code */}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                      {unit.unitCode}
                    </span>
                    <h5 className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
                      {unit.unitNameBn}
                    </h5>
                  </div>

                  {/* Seat count & second time note */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {unit.notesBn && (
                      <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                        <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        {unit.notesBn}
                      </span>
                    )}
                  </div>
                </div>

                {/* Eligibility Result Badge */}
                <div className="shrink-0 self-start md:self-auto">
                  {unit.isEligible ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs border border-emerald-300 dark:border-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      আবেদন যোগ্য (Eligible)
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-bold text-xs border border-rose-300 dark:border-rose-800">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      আবেদন অযোগ্য (Ineligible)
                    </div>
                  )}
                </div>
              </div>

              {/* Second timer mark deduction banner */}
              {unit.markDeductionNote && (
                <div className="mt-3 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{unit.markDeductionNote}</span>
                </div>
              )}

              {/* CRITICAL REQUIREMENT 2: হিসাবের স্পষ্ট কারণ দর্শানো (লাল রঙে স্পষ্ট দেখাবে) */}
              {!unit.isEligible && unit.failureReasons.length > 0 && (
                <div className="mt-3 p-3.5 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 space-y-1.5">
                  <div className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    কেন আবেদন করা যাবে না (সুনির্দিষ্ট কারণ ও ঘাটতি):
                  </div>
                  <ul className="space-y-1 text-xs text-rose-700 dark:text-rose-300 font-medium">
                    {unit.failureReasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold text-sm leading-none mt-0.5">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* If eligible: Success highlights */}
              {unit.isEligible && unit.successHighlights.length > 0 && (
                <div className="mt-3 p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40">
                  <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    যে শর্তগুলো আপনি পূরণ করেছেন:
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                    {unit.successHighlights.map((hl, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-[11px] font-medium"
                      >
                        ✓ {hl}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
