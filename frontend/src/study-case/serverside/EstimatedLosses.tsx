'use client';

import { useState } from 'react';
import { Image } from './compat';
import { InfoDialog } from './InfoDialog';
import { reportData } from './data/reportData';

interface EstimatedLossesProps {
  defaultAdSpend?: number;
  defaultVisitors?: number;
  adSpendPresets?: number[];
  visitorsPresets?: number[];
  shopifyBanner?: {
    badges: string[];
    title: string;
    buttonText: string;
    appUrl: string;
  };
}

export function EstimatedLosses(props: EstimatedLossesProps) {
  const config = reportData.estimatedLosses;
  const initialAdSpend = props.defaultAdSpend ?? config.defaultAdSpend;
  const initialVisitors = props.defaultVisitors ?? config.defaultVisitors;
  const adSpendPresets = props.adSpendPresets ?? config.adSpendPresets;
  const visitorsPresets = props.visitorsPresets ?? config.visitorsPresets;
  const shopifyBanner = props.shopifyBanner ?? config.shopifyBanner;

  const [adSpend, setAdSpend] = useState<number>(initialAdSpend);
  const [visitors, setVisitors] = useState<number>(initialVisitors);
  const [adSpendInput, setAdSpendInput] = useState<string>(`$${initialAdSpend.toLocaleString()}`);
  const [visitorsInput, setVisitorsInput] = useState<string>(initialVisitors.toLocaleString());

  const handleAdSpendPreset = (val: number) => {
    setAdSpend(val);
    setAdSpendInput(`$${val.toLocaleString()}`);
  };

  const handleVisitorsPreset = (val: number) => {
    setVisitors(val);
    setVisitorsInput(val.toLocaleString());
  };

  const handleAdSpendChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const num = parseInt(raw, 10) || 0;
    setAdSpend(num);
    setAdSpendInput(raw ? `$${num.toLocaleString()}` : '');
  };

  const handleVisitorsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const num = parseInt(raw, 10) || 0;
    setVisitors(num);
    setVisitorsInput(raw ? num.toLocaleString() : '');
  };

  // Calculations
  const adLossLow = Math.round(adSpend * 0.18);
  const adLossHigh = Math.round(adSpend * 0.21);
  const visitLossLow = Math.round(visitors * 0.13);
  const visitLossHigh = Math.round(visitors * 0.16);

  return (
    <section className="flex flex-col gap-md xl:grid xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] xl:items-stretch">
      {/* Left: Calculator & Purple Summary */}
      <div className="flex flex-col gap-md rounded-lg bg-primary p-sm lg:grid lg:grid-cols-2 border border-tertiary shadow-xs">
        {/* Column 1: Controls */}
        <div className="flex flex-col gap-lg py-sm pl-sm">
          <div className="flex flex-wrap items-center gap-xs">
            <p className="heading-4 text-paragraph">Estimated tracking losses</p>
            <InfoDialog
              title="Estimated tracking losses"
              description={`Estimated tracking losses show how much website data may be missing because of browser restrictions, ad blockers, and cookie limitations.\n\nBased on your traffic, ad spend, and tracking setup, we estimate how many user interactions may not be captured and how this could affect your advertising visibility.\n\nAdvertising budget impact shows the part of your ad spend that may be harder to measure accurately due to missing attribution and event loss.`}
              dataTestId="estimated-losses-button-info"
            />
          </div>

          <div className="flex flex-col gap-lg">
            {/* Monthly ad spend */}
            <div className="flex flex-col gap-xs">
              <label
                className="label-sm-medium inline-flex items-center gap-2xs text-heading"
                htmlFor="estimated-losses-ad-spend"
              >
                <span>Your monthly ad spend</span>
              </label>
              <input
                type="text"
                className="flex w-full items-center border border-[#dbd7cc] truncate outline-none transition-colors text-paragraph bg-white h-12 py-2 px-4 rounded-lg font-mono text-[16px] focus:border-[#0d0d0d]"
                inputMode="numeric"
                id="estimated-losses-ad-spend"
                data-testid="estimated-losses-ad-spend-input"
                value={adSpendInput}
                onChange={handleAdSpendChange}
              />
              <div
                className="flex flex-wrap gap-2 pt-1"
                data-testid="estimated-losses-ad-spend-presets"
              >
                {adSpendPresets.map((val) => (
                  <button
                    key={val}
                    type="button"
                    aria-pressed={adSpend === val}
                    onClick={() => handleAdSpendPreset(val)}
                    data-testid="estimated-losses-ad-spend-preset"
                    className={`text-[13px] font-mono px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      adSpend === val
                        ? 'bg-[#0d0d0d] text-white font-medium'
                        : 'bg-[#f8f6f4] text-[#4b4c4b] hover:bg-[#eae8e2]'
                    }`}
                  >
                    ${val.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Monthly unique visitors */}
            <div className="flex flex-col gap-xs">
              <label
                className="label-sm-medium inline-flex items-center gap-2xs text-heading"
                htmlFor="estimated-losses-visitors"
              >
                <span>Your monthly unique visitors</span>
              </label>
              <input
                type="text"
                className="flex w-full items-center border border-[#dbd7cc] truncate outline-none transition-colors text-paragraph bg-white h-12 py-2 px-4 rounded-lg font-mono text-[16px] focus:border-[#0d0d0d]"
                inputMode="numeric"
                id="estimated-losses-visitors"
                data-testid="estimated-losses-visitors-input"
                value={visitorsInput}
                onChange={handleVisitorsChange}
              />
              <div
                className="flex flex-wrap gap-2 pt-1"
                data-testid="estimated-losses-visitors-presets"
              >
                {visitorsPresets.map((val) => (
                  <button
                    key={val}
                    type="button"
                    aria-pressed={visitors === val}
                    onClick={() => handleVisitorsPreset(val)}
                    data-testid="estimated-losses-visitors-preset"
                    className={`text-[13px] font-mono px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      visitors === val
                        ? 'bg-[#0d0d0d] text-white font-medium'
                        : 'bg-[#f8f6f4] text-[#4b4c4b] hover:bg-[#eae8e2]'
                    }`}
                  >
                    {val.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Purple Summary Box */}
        <div className="visuals-medium-purple relative flex flex-col justify-between gap-lg-responsive overflow-hidden rounded-lg p-lg-responsive text-[#0d0d0d]">
          <div className="flex flex-col gap-1">
            <span className="caption-sm text-[#0d0d0d]/80 font-medium">
              Estimated advertising budget impact
            </span>
            <div
              className="flex items-baseline gap-1"
              data-testid="estimated-losses-adv-budget-value"
            >
              <span className="heading-3 text-heading font-semibold">
                ${adLossLow.toLocaleString()} - ${adLossHigh.toLocaleString()}
              </span>
              <span className="text-[14px] text-[#0d0d0d]/70">/month</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="caption-sm text-[#0d0d0d]/80 font-medium">
              Estimated untracked visits
            </span>
            <div
              className="flex items-baseline gap-1"
              data-testid="estimated-losses-untracked-visits-value"
            >
              <span className="heading-3 text-heading font-semibold">
                {visitLossLow.toLocaleString()} - {visitLossHigh.toLocaleString()}
              </span>
              <span className="text-[14px] text-[#0d0d0d]/70">/month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Shopify Promo Card */}
      <div className="relative flex flex-col justify-between gap-md overflow-hidden rounded-lg bg-primary p-md lg:p-lg border border-tertiary shadow-xs">
        <div className="flex flex-col gap-md">
          {/* Feature Badges */}
          <div className="flex flex-wrap gap-xs">
            {shopifyBanner.badges.map((b) => (
              <span
                key={b}
                className="inline-flex items-center px-2.5 py-1 rounded-sm text-[12px] font-mono text-heading bg-[#f8f6f4] border border-[#dbd7cc]"
              >
                {b}
              </span>
            ))}
          </div>

          <h3 className="heading-4 text-heading leading-snug">{shopifyBanner.title}</h3>
        </div>

        <div className="pt-4">
          <a
            href={shopifyBanner.appUrl}
            target="_blank"
            rel="noreferrer"
            data-testid="estimated-losses-cms-open-app"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0d0d0d] text-white px-5 py-3 text-[14px] font-mono font-medium hover:bg-[#1e1f1e] transition-colors w-full sm:w-auto"
          >
            <Image
              src="/sites/tracking-checker/icons/Shopify.png"
              alt="Shopify logo"
              width={20}
              height={20}
              className="size-5 object-contain"
            />
            <span>{shopifyBanner.buttonText}</span>
            <svg className="size-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.22 14.78a.75.75 0 0 0 1.06 0l7.22-7.22v5.69a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0 0 1.5h5.69l-7.22 7.22a.75.75 0 0 0 0 1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
