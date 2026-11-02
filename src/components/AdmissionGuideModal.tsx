import React from 'react';
import { HelpCircle, X, CheckCircle2, AlertTriangle, BookOpen } from 'lucide-react';

interface AdmissionGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdmissionGuideModal: React.FC<AdmissionGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative my-auto">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              ভর্তি পরীক্ষার গুরুত্বপূর্ণ নিয়ম ও নির্দেশিকা
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              সেকেন্ড টাইম, নম্বর কর্তন ও জিপিএ হিসাব সংক্রান্ত সাধারণ জিজ্ঞাসা
            </p>
          </div>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 text-xs text-slate-700 dark:text-slate-300">
          {/* Question 1 */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">১</span>
              কোন কোন বিশ্ববিদ্যালয়ে ২য় বার (Second Time) পরীক্ষা দেওয়া যায়?
            </h4>
            <p className="mt-2 text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>সুযোগ আছে:</strong> রাজশাহী বিশ্ববিদ্যালয় (RU), জাহাঙ্গীরনগর বিশ্ববিদ্যালয় (JU), চট্টগ্রাম বিশ্ববিদ্যালয় (CU), ২৪টি জিএসটি গুচ্ছ (GST Cluster), ৮টি কৃষি বিশ্ববিদ্যালয় গুচ্ছ (Agri Cluster), মেডিকেল ও ডেন্টাল (MBBS & BDS), BUP, MIST, ঢাবি অধিভুক্ত ৭ কলেজ এবং জাতীয় বিশ্ববিদ্যালয়।
              <br />
              <strong>সুযোগ নেই:</strong> ঢাকা বিশ্ববিদ্যালয় (DU), বুয়েট (BUET), চুয়েট-কুয়েট-রুয়েট গুচ্ছ (CKRUET) এবং বুটেক্স (BUTEX)।
            </p>
          </div>

          {/* Question 2 */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">২</span>
              সেকেন্ড টাইমে নম্বর কর্তনের নিয়ম কী?
            </h4>
            <p className="mt-2 text-slate-600 dark:text-slate-300 leading-relaxed">
              • <strong>মেডিকেল ও ডেন্টাল:</strong> ২য় বার পরীক্ষার্থীদের মোট প্রাপ্ত নম্বর থেকে <strong>৫.০০ নম্বর</strong> কাটা হয় (পূর্ববর্তী সরকারি মেডিকেলে ভর্তি থাকলে ৭.৫০ নম্বর)।
              <br />
              • <strong>চট্টগ্রাম বিশ্ববিদ্যালয় (CU):</strong> ২য় বার পরীক্ষার্থীদের ক্ষেত্রে ভর্তি পরীক্ষার মোট প্রাপ্ত নম্বর থেকে <strong>৫.০০ নম্বর</strong> কর্তন করা হয়।
              <br />
              • <strong>রাজশাহী ও জাহাঙ্গীরনগর:</strong> সাধারণত কোনো অতিরিক্ত নম্বর কর্তন করা হয় না।
            </p>
          </div>

          {/* Question 3 */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">৩</span>
              ৪র্থ বিষয় (4th Subject) সহ কি জিপিএ গণনা করা হয়?
            </h4>
            <p className="mt-2 text-slate-600 dark:text-slate-300 leading-relaxed">
              হ্যাঁ, বাংলাদেশ শিক্ষা বোর্ড কর্তৃক প্রদত্ত মূল মার্কশিট/ট্রান্সক্রিপ্টের এসএসসি ও এইচএসসি মোট জিপিএ (৪র্থ বিষয় সহ) সকল বিশ্ববিদ্যালয়ের প্রাথমিক যোগ্যতা হিসেবে গৃহীত হয়। তবে বুয়েট বা বিশেষ টেক্সটাইল/ইঞ্জিনিয়ারিংয়ে প্রাক-বাছাইয়ে নির্দিষ্ট ৩ বা ৪টি বিষয়ের প্রাপ্ত মার্কস প্রাধান্য পায়।
            </p>
          </div>

          {/* Question 4 */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">৪</span>
              জিপিএ কম থাকলে কী কী বিকল্প সুযোগ রয়েছে?
            </h4>
            <p className="mt-2 text-slate-600 dark:text-slate-300 leading-relaxed">
              যদি পাবলিক বিশ্ববিদ্যালয়ের ন্যূনতম জিপিএ শর্ত পূরণ না হয়:
              <br />
              ১. <strong>জাতীয় বিশ্ববিদ্যালয় (NU):</strong> এসএসসি ও এইচএসসিতে ন্যূনতম ৩.০০ থাকলে দেশের শত শত সরকারি কলেজে সরাসরি অনার্সে মেধা তালিকায় ভর্তি হওয়া যায়।
              <br />
              ২. <strong>ডিগ্রি (পাস) ৩ বছর মেয়াদী:</strong> জিপিএ ২.০০ থাকলেই ডিগ্রি পাসে ভর্তি হয়ে পরবর্তীতে মাস্টার্স সম্পন্ন করা সম্ভব।
              <br />
              ৩. <strong>শীর্ষ বেসরকারি বিশ্ববিদ্যালয়:</strong> মোট জিপিএ ৬.০০ (প্রতিটিতে ২.৫০) থাকলে ইউজিসি অনুমোদিত যেকোনো প্রাইভেট বিশ্ববিদ্যালয়ে উচ্চশিক্ষা গ্রহণ করা যায়।
            </p>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-500 transition"
          >
            বুঝেছি, ধন্যবাদ
          </button>
        </div>
      </div>
    </div>
  );
};
