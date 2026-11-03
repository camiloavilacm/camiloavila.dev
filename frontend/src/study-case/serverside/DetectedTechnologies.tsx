'use client';

import { Image } from './compat';
import { InfoDialog } from './InfoDialog';
import { reportData, type Technology } from './data/reportData';

interface DetectedTechnologiesProps {
  technologies?: Technology[];
}

export function DetectedTechnologies(props: DetectedTechnologiesProps) {
  const technologies = props.technologies ?? reportData.detectedTechnologies;

  return (
    <div className="flex flex-col justify-between gap-md rounded-lg bg-primary p-md lg:p-lg border border-tertiary shadow-xs">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-md">
        <div className="flex items-center gap-xs">
          <p className="heading-4 text-paragraph">Detected technologies</p>
          <InfoDialog
            title="Detected technologies"
            description={`Detected technologies show which tools, platforms, and services were found on your website.\n\nThis includes analytics and advertising trackers, CDNs, CMSs, CRMs, front-end frameworks, e-commerce platforms, and other technologies that may affect tracking, attribution, data quality, and page performance.`}
            dataTestId="detected-technologies-button-info"
          />
        </div>

        <span className="caption-sm text-paragraph-secondary font-mono">
          {technologies.length} detected
        </span>
      </div>

      {/* All Technologies Pills Displayed by Default */}
      <div className="flex flex-wrap gap-2xs">
        {technologies.map((tech) => (
          <span
            key={tech.name}
            className="flex min-w-0 items-center gap-xs rounded-full bg-[#f8f6f4] px-sm py-xs text-[14px] text-paragraph border border-[#dbd7cc]/40 hover:bg-[#eae8e2] transition-colors"
          >
            {tech.iconSrc && (
              <Image
                src={tech.iconSrc}
                alt={tech.name}
                width={18}
                height={18}
                className="size-[18px] shrink-0 object-contain"
              />
            )}
            <span className="min-w-0 truncate font-medium">{tech.name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
