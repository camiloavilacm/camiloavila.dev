'use client';

import { useEffect, useState } from 'react';
import { InfoDialog } from './InfoDialog';
import { reportData, type Subscore } from './data/reportData';

interface OverallScoreProps {
  score?: number;
  trackersCount?: number;
  rating?: string;
  subscores?: {
    analytics: Subscore;
    advertising: Subscore;
    cookieDurability: Subscore;
    seo: Subscore;
  };
}

export function OverallScore(props: OverallScoreProps) {
  const score = props.score ?? reportData.score.overall;
  const trackersCount = props.trackersCount ?? reportData.score.trackersDetected;
  const rating = props.rating ?? reportData.score.rating;
  const subscores = props.subscores ?? reportData.score.subscores;

  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(interval);
      } else {
        setDisplayScore(current);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [score]);

  // Circle circumference with r=61 is 2 * PI * 61 ~= 383.27
  const circumference = 383.27;
  const strokeDashoffset = circumference - (circumference * displayScore) / 100;

  return (
    <div className="relative flex flex-col justify-between gap-lg overflow-hidden rounded-lg bg-primary p-lg-responsive border border-tertiary shadow-xs">
      {/* Top Header */}
      <div className="relative flex flex-wrap items-center justify-between gap-md">
        <div className="flex items-center gap-xs">
          <p className="heading-4 text-paragraph">Overall score</p>
          <InfoDialog
            title="Overall score"
            description={`Overall score shows how healthy your website’s tracking setup is, from 0 to 100.\n\nThe higher the score, the more reliably your data reaches your marketing platforms.\n\nWe scan your website for issues related to tracking, ad platforms, cookies, and page performance. Each issue affects your score based on how much it can impact data quality and measurement accuracy.`}
            dataTestId="overall-score-button-info"
          />
        </div>

        <span
          data-slot="badge"
          className="inline-flex items-center gap-2xs px-2xs py-3xs rounded-sm caption-sm whitespace-nowrap text-heading bg-neutral-100 border border-ghost"
        >
          {trackersCount} <span className="lg:hidden">trackers</span>
          <span className="hidden lg:inline">trackers detected</span>
        </span>
      </div>

      {/* Score and Gauge section */}
      <div className="relative flex flex-1 items-end justify-between border-tertiary border-b pb-md">
        <div className="flex items-baseline gap-3xs">
          <span className="heading-0 text-paragraph">{displayScore}</span>
          <span className="paragraph-lg-regular text-paragraph-secondary">/100</span>
        </div>

        <div className="relative size-[120px] shrink-0 xl:size-[140px]">
          <svg viewBox="0 0 140 140" className="size-full -rotate-90" aria-hidden="true">
            <circle
              cx="70"
              cy="70"
              r="61"
              fill="none"
              strokeWidth="4"
              strokeDasharray="2 6"
              className="stroke-[#c4bcac]"
            />
            <circle
              cx="70"
              cy="70"
              r="61"
              fill="none"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="stroke-[#f1416c] transition-all duration-75 ease-out"
            />
          </svg>
          <span className="paragraph-lg-semibold absolute inset-0 flex items-center justify-center text-heading font-medium">
            {rating}
          </span>
        </div>
      </div>

      {/* Subscores Grid */}
      <div className="grid grid-cols-1 overflow-hidden rounded-lg bg-primary lg:grid-cols-2 border border-ghost">
        {/* Analytics */}
        <div className="border-ghost border-b lg:border-b-0 lg:border-r p-md">
          <div className="flex h-full min-h-[105px] flex-col justify-between gap-sm">
            <div className="flex flex-wrap items-start justify-between gap-md">
              <p className="heading-5 text-paragraph">{subscores.analytics.name}</p>
              <span className="inline-flex items-center gap-2xs px-2xs py-3xs rounded-sm caption-sm text-heading bg-neutral-100 border border-ghost">
                {subscores.analytics.issuesCount} issues identified
              </span>
            </div>
            <div className="flex flex-col gap-sm">
              <p className="paragraph-md-regular text-paragraph font-medium">
                {subscores.analytics.rating}
              </p>
              <div className="flex gap-2xs">
                <span className="h-2 flex-1 rounded-l-full bg-[#f1416c]"></span>
                <span className="h-2 flex-1 bg-neutral-200"></span>
                <span className="h-2 flex-1 bg-neutral-200"></span>
                <span className="h-2 flex-1 rounded-r-full bg-neutral-200"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Advertising */}
        <div className="border-ghost border-b lg:border-b-0 p-md">
          <div className="flex h-full min-h-[105px] flex-col justify-between gap-sm">
            <div className="flex flex-wrap items-start justify-between gap-md">
              <p className="heading-5 text-paragraph">{subscores.advertising.name}</p>
              <span className="inline-flex items-center gap-2xs px-2xs py-3xs rounded-sm caption-sm text-heading bg-neutral-100 border border-ghost">
                {subscores.advertising.issuesCount} issues identified
              </span>
            </div>
            <div className="flex flex-col gap-sm">
              <p className="paragraph-md-regular text-paragraph font-medium">
                {subscores.advertising.rating}
              </p>
              <div className="flex gap-2xs">
                <span className="h-2 flex-1 rounded-l-full bg-[#f1416c]"></span>
                <span className="h-2 flex-1 bg-neutral-200"></span>
                <span className="h-2 flex-1 bg-neutral-200"></span>
                <span className="h-2 flex-1 rounded-r-full bg-neutral-200"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Cookie durability */}
        <div className="border-ghost border-b lg:border-b-0 lg:border-t lg:border-r p-md">
          <div className="flex h-full min-h-[105px] flex-col justify-between gap-sm">
            <div className="flex flex-wrap items-start justify-between gap-md">
              <p className="heading-5 text-paragraph">{subscores.cookieDurability.name}</p>
              <span className="inline-flex items-center gap-2xs px-2xs py-3xs rounded-sm caption-sm text-heading bg-neutral-100 border border-ghost">
                {subscores.cookieDurability.issuesCount} issues identified
              </span>
            </div>
            <div className="flex flex-col gap-sm">
              <p className="paragraph-md-regular text-paragraph font-medium">
                {subscores.cookieDurability.rating}
              </p>
              <div className="flex gap-2xs">
                <span className="h-2 flex-1 rounded-l-full bg-[#f1416c]"></span>
                <span className="h-2 flex-1 bg-neutral-200"></span>
                <span className="h-2 flex-1 bg-neutral-200"></span>
                <span className="h-2 flex-1 rounded-r-full bg-neutral-200"></span>
              </div>
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="lg:border-t border-ghost p-md">
          <div className="flex h-full min-h-[105px] flex-col justify-between gap-sm">
            <div className="flex flex-wrap items-start justify-between gap-md">
              <p className="heading-5 text-paragraph">{subscores.seo.name}</p>
              <span className="inline-flex items-center gap-2xs px-2xs py-3xs rounded-sm caption-sm text-heading bg-neutral-100 border border-ghost">
                {subscores.seo.issuesCount} issues identified
              </span>
            </div>
            <div className="flex flex-col gap-sm">
              <p className="paragraph-md-regular text-paragraph font-medium">
                {subscores.seo.rating}
              </p>
              <div className="flex gap-2xs">
                <span className="h-2 flex-1 rounded-l-full bg-[#ffc64a]"></span>
                <span className="h-2 flex-1 bg-[#ffc64a]"></span>
                <span className="h-2 flex-1 bg-neutral-200"></span>
                <span className="h-2 flex-1 rounded-r-full bg-neutral-200"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
