import React, { useState } from 'react';
import { ExternalLink, Info, Sparkles, X, BookOpen, GraduationCap, Award, Flame } from 'lucide-react';

interface AdItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  badge: string;
  badgeBg: string;
  sponsorName: string;
  themeColor: string;
  iconType: 'medical' | 'engineering' | 'varsity';
}

const ADS_LIST: AdItem[] = [
  {
    id: 'ad-varsity-model-test',
    tag: 'স্পেশাল এডমিশন ব্যাচ',
    title: 'ঢাবি ও রাবি ফাইনাল মডেল টেস্ট ২০২৬ — ফ্রি লাইভ মেধা যাচাই!',
    description: 'ঢাকা বিশ্ববিদ্যালয় ও বিভাগীয় ভার্সিটির অনুরূপ স্ট্যান্ডার্ড প্রশ্নে জাতীয় মেধা তালিকা প্রকাশ ও নেগেটিভ মার্কিং প্র্যাকটিস।',
    ctaText: 'ফ্রি এক্সাম দিন',
    ctaUrl: 'https://admission.eis.du.ac.bd',
    badge: 'বিজ্ঞাপন • Sponsored',
    badgeBg: 'bg-indigo-600',
    sponsorName: 'এডমিশন প্রি-টেস্ট একাডেমি',
    themeColor: 'from-indigo-600 via-blue-600 to-indigo-800',
    iconType: 'varsity',
  },
  {
    id: 'ad-medical-qb',
    tag: 'মেডিকেল স্পেশাল',
    title: 'মেডিকেল ও ডেন্টাল ২০ বছরের অধ্যায়ভিত্তিক প্রশ্নব্যাংক ও ট্রিকস',
    description: '৪ ডিসেম্বর মেডিকেল পরীক্ষার আগে বিগত বছরের প্রশ্ন সমাধান ও হাই-ইল্ড বায়োলজি শর্টকাট নোটস সংগ্রহ করুন।',
    ctaText: 'বইয়ের প্রিভিউ দেখুন',
    ctaUrl: 'http://dgme.teletalk.com.bd',
    badge: 'বিজ্ঞাপন • Ad',
    badgeBg: 'bg-emerald-600',
    sponsorName: 'মেডিকেল এসপায়ারার্স ক্লাব',
    themeColor: 'from-emerald-600 via-teal-600 to-emerald-800',
    iconType: 'medical',
  },
  {
    id: 'ad-buet-written',
    tag: 'বুয়েট সরাসরি লিখিত',
    title: 'বুয়েট ১৬ জানুয়ারি লিখিত পরীক্ষার মাস্টারক্লাস ও ফরমূলা চিটশিট',
    description: 'পদার্থ, রসায়ন ও গণিতের উচ্চতর লিখিত ম্যাথ সমাধানের স্পেশাল হ্যান্ডনোট এবং অফিশিয়াল প্রশ্নের বিশ্লেষণ।',
    ctaText: 'চিটশিট ডাউনলোড',
    ctaUrl: 'https://ugadmission.buet.ac.bd',
    badge: 'বিজ্ঞাপন • Sponsored',
    badgeBg: 'bg-rose-600',
    sponsorName: 'ইঞ্জিনিয়ার্স একাডেমি বিডি',
    themeColor: 'from-rose-600 via-pink-600 to-rose-800',
    iconType: 'engineering',
  },
];

interface AdvertisementBannerProps {
  variant?: 'leaderboard' | 'native' | 'compact';
  className?: string;
}

export const AdvertisementBanner: React.FC<AdvertisementBannerProps> = ({
  variant = 'leaderboard',
  className = '',
}) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  if (!isVisible) return null;

  const currentAd = ADS_LIST[currentAdIndex];

  const handleNextAd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentAdIndex((prev) => (prev + 1) % ADS_LIST.length);
  };

  const getIcon = () => {
    switch (currentAd.iconType) {
      case 'medical':
        return <Award className="w-5 h-5 text-emerald-200" />;
      case 'engineering':
        return <Flame className="w-5 h-5 text-rose-200 animate-pulse" />;
      case 'varsity':
      default:
        return <GraduationCap className="w-5 h-5 text-indigo-200" />;
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 shadow-sm ${className}`}>
        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
          <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            বিজ্ঞাপন • Ad
          </span>
          <button
            onClick={() => setIsVisible(false)}
            className="hover:text-slate-600 dark:hover:text-slate-200"
            title="বিজ্ঞাপন লুকান"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
        <a
          href={currentAd.ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-3 group"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center shrink-0">
              {getIcon()}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-white line-clamp-1 group-hover:text-indigo-600 transition">
                {currentAd.title}
              </p>
              <p className="text-[11px] text-slate-500 line-clamp-1">{currentAd.sponsorName}</p>
            </div>
          </div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition shrink-0 flex items-center gap-1">
            <span>{currentAd.ctaText}</span>
            <ExternalLink className="w-3 h-3" />
          </span>
        </a>
      </div>
    );
  }

  return (
    <div className={`w-full relative overflow-hidden rounded-2xl md:rounded-3xl shadow-md border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all ${className}`}>
      {/* Top Banner Tag Bar */}
      <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-b border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold text-[10px] tracking-wide uppercase flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            বিজ্ঞাপন • Sponsored Ad
          </span>
          <span className="hidden sm:inline font-medium">প্রস্তুতি সহায়ক স্পন্সর পার্টনার</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleNextAd}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold underline text-[10px]"
          >
            পরবর্তী বিজ্ঞাপন ❯
          </button>
          <button
            type="button"
            onClick={() => setShowInfo(!showInfo)}
            className="hover:text-slate-700 dark:hover:text-slate-200 p-0.5"
            title="বিজ্ঞাপন সম্পর্কিত তথ্য"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="hover:text-rose-500 p-0.5"
            title="বিজ্ঞাপন বন্ধ করুন"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {showInfo && (
        <div className="bg-amber-50 dark:bg-amber-950/40 p-2.5 text-xs text-amber-900 dark:text-amber-200 border-b border-amber-200 dark:border-amber-900 flex items-center justify-between">
          <span>
            এই বিজ্ঞাপনটি শিক্ষার্থীদের প্রয়োজনীয় এডমিশন সহায়তা ও মডেল টেস্ট সংক্রান্ত তথ্যের জন্য প্রদর্শিত হচ্ছে।
          </span>
          <button
            onClick={() => setShowInfo(false)}
            className="text-xs font-bold underline ml-2"
          >
            ঠিক আছে
          </button>
        </div>
      )}

      {/* Main Ad Banner Body */}
      <div className={`p-4 sm:p-5 bg-gradient-to-r ${currentAd.themeColor} text-white flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden`}>
        {/* Decorative elements */}
        <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -top-12 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
            {getIcon()}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-white/25 text-white font-bold text-[10px] uppercase tracking-wider backdrop-blur-xs">
                {currentAd.tag}
              </span>
              <span className="text-[11px] text-white/80 font-medium">
                বাই {currentAd.sponsorName}
              </span>
            </div>
            <h4 className="text-sm sm:text-base md:text-lg font-black text-white leading-tight">
              {currentAd.title}
            </h4>
            <p className="text-xs text-white/90 mt-1 max-w-2xl font-normal leading-relaxed">
              {currentAd.description}
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="relative z-10 shrink-0 self-start md:self-auto">
          <a
            href={currentAd.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <span>{currentAd.ctaText}</span>
            <ExternalLink className="w-4 h-4 text-slate-700" />
          </a>
        </div>
      </div>
    </div>
  );
};
