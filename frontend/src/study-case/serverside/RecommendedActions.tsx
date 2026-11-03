'use client';

import { useState } from 'react';
import { Image } from './compat';
import { reportData, type Recommendation } from './data/reportData';

interface RecommendedActionsProps {
  summary?: string;
  summaryExpanded?: string;
  items?: Recommendation[];
}

export function RecommendedActions(props: RecommendedActionsProps) {
  const summary = props.summary ?? reportData.recommendations.summary;
  const summaryExpanded = props.summaryExpanded ?? reportData.recommendations.summaryExpanded;
  const items = props.items ?? reportData.recommendations.items;

  const [showFullSummary, setShowFullSummary] = useState(false);
  const [openCardId, setOpenCardId] = useState<string | null>('rec-cookie-keeper');

  const toggleCard = (id: string) => {
    setOpenCardId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      className="flex flex-col gap-lg rounded-lg bg-primary px-md py-lg lg:px-lg xl:grid xl:grid-cols-[minmax(0,0.3fr)_minmax(0,1fr)] border border-tertiary shadow-xs"
      data-testid="recommended-actions"
    >
      {/* Left Sidebar / Heading */}
      <div>
        <div className="hidden xl:flex xl:flex-col xl:gap-md sticky top-6">
          <p className="heading-4 text-heading">Recommended actions</p>
          <span className="heading-0 text-heading font-medium">{items.length}</span>
        </div>
        <div className="flex items-center gap-xs xl:hidden pb-2">
          <span className="heading-4 text-heading font-semibold">{items.length}</span>
          <p className="heading-4 text-heading">Recommended actions</p>
        </div>
      </div>

      {/* Right Column: Summary + Cards */}
      <div className="flex flex-col gap-lg">
        {/* Summary Card */}
        <div className="flex flex-col gap-sm rounded-lg bg-[#f8f6f4] p-md border border-[#dbd7cc]/40">
          <p className="text-[15px] leading-relaxed text-[#4b4c4b]">{summary}</p>
          {showFullSummary && (
            <p className="text-[15px] leading-relaxed text-[#4b4c4b] animate-in fade-in duration-200">
              {summaryExpanded}
            </p>
          )}
          <button
            type="button"
            onClick={() => setShowFullSummary(!showFullSummary)}
            data-testid="recommended-actions-summary-show-more"
            className="text-[14px] font-mono font-medium text-[#0d0d0d] underline hover:no-underline self-start cursor-pointer mt-1"
          >
            {showFullSummary ? 'Show less' : 'Show more'}
          </button>
        </div>

        {/* Recommendation Cards */}
        <div className="flex flex-col gap-4">
          {items.map((rec) => {
            const isOpen = openCardId === rec.id;

            return (
              <article
                key={rec.id}
                id={rec.id}
                className={`flex flex-col rounded-lg border transition-all ${
                  isOpen
                    ? 'border-[#0d0d0d] bg-[#f8f6f4] shadow-sm'
                    : 'border-tertiary bg-white hover:bg-[#faf9f8]'
                }`}
                data-testid="recommendation-card"
                data-state={isOpen ? 'open' : 'closed'}
              >
                {/* Accordion Trigger Header */}
                <button
                  type="button"
                  onClick={() => toggleCard(rec.id)}
                  data-testid="recommendation-card-toggle"
                  className="flex w-full cursor-pointer select-none flex-wrap items-start justify-between gap-sm p-5 text-left"
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <span className="heading-4 text-heading leading-snug font-medium">
                      {rec.title}
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {rec.categories.map((cat) => (
                        <span
                          key={cat}
                          data-slot="badge"
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm caption-sm text-heading bg-[#f3f1ed] border border-ghost"
                        >
                          {cat}
                        </span>
                      ))}
                      {rec.isCritical && (
                        <span
                          data-slot="badge"
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm caption-sm text-white bg-[#ff6d34] font-medium"
                        >
                          Critical
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-baseline gap-1">
                    <span className="heading-2 text-heading font-semibold">
                      +{rec.scorePercent}
                    </span>
                    <span className="text-[14px] text-paragraph-secondary font-mono">to score</span>
                  </div>
                </button>

                {/* Expanded Details Body */}
                {isOpen && (
                  <div className="flex flex-col gap-6 px-5 pb-6 pt-1 border-t border-[#dbd7cc]/40 animate-in fade-in duration-150">
                    <p className="text-[15px] leading-relaxed text-[#4b4c4b]">{rec.description}</p>

                    {/* PageSpeed special view */}
                    {rec.pageSpeed && (
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <p className="font-semibold text-heading text-[16px]">
                            Core Web Vitals Impact
                          </p>
                          <a
                            href={rec.pageSpeed.pageSpeedUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[14px] text-blue-600 underline font-mono flex items-center gap-1"
                          >
                            <span>View on PageSpeed Insights</span>
                            <svg className="size-3.5" viewBox="0 0 20 20" fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M5.22 14.78a.75.75 0 0 0 1.06 0l7.22-7.22v5.69a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0 0 1.5h5.69l-7.22 7.22a.75.75 0 0 0 0 1.06Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </a>
                        </div>

                        {/* Metrics Bar */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                          <div className="p-3 rounded-lg bg-white border border-[#e0e3e6]">
                            <p className="caption-sm text-[#858a8f]">INP</p>
                            <p className="heading-4 text-[#ffae20] font-semibold">
                              {rec.pageSpeed.inpMs} ms
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-white border border-[#e0e3e6]">
                            <p className="caption-sm text-[#858a8f]">LCP</p>
                            <p className="heading-4 text-[#29a07c] font-semibold">
                              {rec.pageSpeed.lcpSeconds} s
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-white border border-[#e0e3e6]">
                            <p className="caption-sm text-[#858a8f]">CLS</p>
                            <p className="heading-4 text-[#29a07c] font-semibold">
                              {rec.pageSpeed.clsScore}
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-white border border-[#e0e3e6]">
                            <p className="caption-sm text-[#858a8f]">FCP</p>
                            <p className="heading-4 text-[#29a07c] font-semibold">
                              {rec.pageSpeed.fcpSeconds} s
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-white border border-[#e0e3e6]">
                            <p className="caption-sm text-[#858a8f]">TTFB</p>
                            <p className="heading-4 text-[#29a07c] font-semibold">
                              {rec.pageSpeed.ttfbSeconds} s
                            </p>
                          </div>
                        </div>

                        {/* Script breakdown table */}
                        {rec.scripts && (
                          <div className="mt-2 overflow-x-auto">
                            <p className="font-semibold text-heading text-[15px] mb-2">
                              Tracking Scripts Detected ({rec.scripts.length})
                            </p>
                            <table className="w-full text-left text-[14px] bg-white rounded-lg border border-[#e0e3e6] overflow-hidden">
                              <thead className="bg-[#f8f6f4] border-b border-[#e0e3e6] text-[#4b4c4b]">
                                <tr>
                                  <th className="p-3 font-medium">Script</th>
                                  <th className="p-3 font-medium">Provider</th>
                                  <th className="p-3 font-medium">Size</th>
                                  <th className="p-3 font-medium">Blocking Time</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#e0e3e6]">
                                {rec.scripts.map((s) => (
                                  <tr key={s.name + s.order} className="hover:bg-[#faf9f8]">
                                    <td className="p-3 flex items-center gap-2 font-mono">
                                      <Image
                                        src={s.icon}
                                        alt={s.provider}
                                        width={16}
                                        height={16}
                                        className="size-4 object-contain"
                                      />
                                      <span>{s.name}</span>
                                    </td>
                                    <td className="p-3">{s.provider}</td>
                                    <td className="p-3 font-mono">{s.transferSize} KB</td>
                                    <td className="p-3 font-mono text-[#f1416c]">
                                      {s.blockingTime} ms
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}

                    {/* How-to Video & Blog links */}
                    {(rec.howToVideo || rec.guideTitle) && (
                      <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        {rec.howToVideo && (
                          <a
                            href={rec.howToVideo}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg bg-white border border-[#dbd7cc] hover:border-[#0d0d0d] transition-colors flex-1"
                          >
                            <span className="flex size-10 items-center justify-center rounded-full bg-[#ffe6d4] text-[#ff6d34] shrink-0">
                              <svg className="size-5 fill-current" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </span>
                            <div className="flex flex-col">
                              <span className="caption-sm text-[#ff6d34] font-medium">
                                Video tutorial
                              </span>
                              <span className="text-[14px] text-heading font-medium line-clamp-1">
                                {rec.howToTitle || 'Watch video walkthrough'}
                              </span>
                            </div>
                          </a>
                        )}

                        {rec.guideTitle && (
                          <a
                            href={`https://www.google.com/search?q=${encodeURIComponent(rec.guideTitle)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg bg-white border border-[#dbd7cc] hover:border-[#0d0d0d] transition-colors flex-1"
                          >
                            <span className="flex size-10 items-center justify-center rounded-full bg-[#e6e8f9] text-[#6255ad] shrink-0">
                              <svg
                                className="size-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                                />
                              </svg>
                            </span>
                            <div className="flex flex-col">
                              <span className="caption-sm text-[#6255ad] font-medium">
                                Topic Guide
                              </span>
                              <span className="text-[14px] text-heading font-medium line-clamp-1">
                                {rec.guideTitle}
                              </span>
                            </div>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
