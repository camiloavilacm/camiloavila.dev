import React from 'react';
import './serverside.css';
import { Header } from './Header';
import { ReportHeader } from './ReportHeader';
import { OverallScore } from './OverallScore';
import { DetectedTechnologies } from './DetectedTechnologies';
import { TrackingArchitecture } from './TrackingArchitecture';
import { EstimatedLosses } from './EstimatedLosses';
import { Competitors } from './Competitors';
import { RecommendedActions } from './RecommendedActions';

export const ServerSideReportApp: React.FC = () => {
  return (
    <div className="serverside-root rounded-2xl overflow-hidden border border-[#E8DCCA] shadow-xs bg-[#FAF7F2]">
      <Header />
      <div className="CibPdq_wrapper">
        <div className="visuals-neutral relative flex grow flex-col items-center px-md py-lg-responsive lg:px-xl">
          <main className="flex w-full max-w-[1336px] flex-col gap-md lg:gap-lg pb-12">
            <ReportHeader />
            <section className="flex flex-col gap-md xl:grid xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] xl:items-stretch">
              <OverallScore />
              <DetectedTechnologies />
            </section>
            <TrackingArchitecture />
            <EstimatedLosses />
            <Competitors />
            <RecommendedActions />
          </main>
        </div>
      </div>
    </div>
  );
};
