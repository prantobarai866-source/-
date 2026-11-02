import React, { useState } from 'react';
import { StudentProfile, UniversityEvaluationResult } from '../types/admission';
import {
  Share2,
  X,
  Facebook,
  MessageCircle,
  Copy,
  Check,
  Send,
  Sparkles,
  Award,
  GraduationCap,
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  results: UniversityEvaluationResult[];
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, profile, results }) => {
  if (!isOpen) return null;

  const totalEligible = results.reduce((acc, r) => acc + r.eligibleUnitCount, 0);
  const totalUnits = results.reduce((acc, r) => acc + r.totalUnitCount, 0);
  const topEligibleNames = results
    .filter((r) => r.isEligibleAnyUnit)
    .map((r) => r.university.shortName)
    .slice(0, 5)
    .join(', ');

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://aistudio.google.com';

  const defaultMessage = `🎓 এইচএসসি ২৬ ব্যাচ এডমিশন যোগ্যতা যাচাই ফলাফল:
📊 এসএসসি জিপিএ: ${profile.sscGpa.toFixed(2)} | এইচএসসি জিপিএ: ${profile.hscGpa.toFixed(2)} (মোট: ${(profile.sscGpa + profile.hscGpa).toFixed(2)})
✅ আমি মোট ${totalEligible}টি বিশ্ববিদ্যালয় ইউনিটে পরীক্ষা দিতে পারব! (${topEligibleNames}${results.filter((r) => r.isEligibleAnyUnit).length > 5 ? ' ইত্যাদি' : ''})
🎯 ২৬ ব্যাচের সকল ভার্সিটি ও ইউনিটের যোগ্যতা এবং কারণ যাচাই করতে ক্লিক করুন:
${currentUrl}`;

  const [customMessage, setCustomMessage] = useState(defaultMessage);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(customMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleFacebookShare = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(customMessage)}`;
    window.open(fbUrl, '_blank', 'width=600,height=500');
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(customMessage)}`;
    window.open(waUrl, '_blank');
  };

  const handleMessengerShare = () => {
    const msgUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(currentUrl)}&app_id=291494419107518&redirect_uri=${encodeURIComponent(currentUrl)}`;
    window.open(msgUrl, '_blank', 'width=600,height=500');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              ফেসবুক ও সোশ্যাল মিডিয়ায় শেয়ার করুন
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              আপনার যোগ্যতা বন্ধুদের সাথে শেয়ার করুন অথবা তাদের যাচাই করার সুযোগ দিন
            </p>
          </div>
        </div>

        {/* Live Social Preview Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950 to-slate-900 text-white border border-indigo-800/40 shadow-inner mb-4">
          <div className="flex items-center justify-between text-xs text-indigo-300 pb-2 border-b border-indigo-800/60">
            <span className="flex items-center gap-1 font-semibold">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              ভর্তি যোগ্যতা কার্ড
            </span>
            <span className="text-[11px] font-mono bg-indigo-500/20 px-2 py-0.5 rounded text-indigo-200">
              এইচএসসি ২৬ ব্যাচ
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-300">শিক্ষার্থী: {profile.studentName || 'এইচএসসি পরীক্ষার্থী'}</div>
              <div className="text-lg font-extrabold text-white mt-0.5">
                {totalEligible} টি ইউনিটে আবেদন যোগ্য
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">সর্বমোট জিপিএ</div>
              <div className="text-base font-extrabold text-emerald-400 font-mono">
                {(profile.sscGpa + profile.hscGpa).toFixed(2)} / ১০.০০
              </div>
            </div>
          </div>

          {topEligibleNames && (
            <div className="mt-2 text-xs text-indigo-200">
              শীর্ষ যোগ্য প্রতিষ্ঠান: <span className="text-emerald-300 font-semibold">{topEligibleNames}</span>
            </div>
          )}
        </div>

        {/* Custom Message Editor */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
            <span>কাস্টম মেসেজ (প্রয়োজনে পরিবর্তন করুন):</span>
            <button
              type="button"
              onClick={() => setCustomMessage(defaultMessage)}
              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              রিসেট মেসেজ
            </button>
          </label>
          <textarea
            rows={4}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 font-sans"
          />
        </div>

        {/* Share Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {/* Facebook Direct Share */}
          <button
            type="button"
            onClick={handleFacebookShare}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#1877F2] hover:bg-[#0c6be8] text-white font-bold text-xs shadow-md transition"
          >
            <Facebook className="w-4 h-4 fill-current" />
            ফেসবুক শেয়ার
          </button>

          {/* WhatsApp Direct Share */}
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#1eb857] text-white font-bold text-xs shadow-md transition"
          >
            <MessageCircle className="w-4 h-4" />
            হোয়াটসঅ্যাপ
          </button>

          {/* Copy Message / Link */}
          <button
            type="button"
            onClick={handleCopy}
            className={`col-span-2 sm:col-span-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs transition border ${
              copied
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white border-slate-200 dark:border-slate-700'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-white" />
                কপি হয়েছে!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                কপি করুন
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
