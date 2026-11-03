import { Image } from './compat';
import { InfoDialog } from './InfoDialog';
import { reportData, type Technology } from './data/reportData';

interface TrackingArchitectureProps {
  properlyConfigured?: Technology[];
  withIssues?: { name: string; icon: string; href: string }[];
  serverSideBenefits?: string[];
  businessImpact?: string[];
}

export function TrackingArchitecture(props: TrackingArchitectureProps) {
  const properlyConfigured =
    props.properlyConfigured ?? reportData.trackingArchitecture.properlyConfigured;
  const clientSideWithIssues = props.withIssues ?? reportData.trackingArchitecture.withIssues;
  const serverSideBenefits =
    props.serverSideBenefits ?? reportData.trackingArchitecture.serverSideBenefits;
  const businessImpact = props.businessImpact ?? reportData.trackingArchitecture.businessImpact;

  return (
    <section className="flex flex-col gap-lg rounded-lg bg-primary p-lg-responsive border border-tertiary shadow-xs">
      {/* Top Header */}
      <div className="flex items-center gap-xs">
        <p className="heading-4 text-paragraph">Tracking architecture</p>
        <InfoDialog
          title="Tracking architecture"
          description={
            <div className="flex flex-col gap-4">
              <div>
                <p className="font-semibold text-heading mb-1">Properly configured</p>
                <p>
                  Platforms that are set up according to best practices and should be tracking
                  accurately.
                </p>
              </div>
              <div>
                <p className="font-semibold text-heading mb-1">With issues</p>
                <p>
                  Platforms with configuration issues that may affect your tracking accuracy. Click
                  on a platform to view the recommendation.
                </p>
              </div>
            </div>
          }
          dataTestId="tracking-architecture-button-info"
        />
      </div>

      {/* Grid: Properly configured & With issues */}
      <div className="grid gap-lg xl:grid-cols-2">
        {/* Properly configured */}
        <div className="flex flex-col gap-sm">
          <p className="heading-5 text-heading font-medium">Properly configured</p>
          <div
            className="flex flex-wrap items-center gap-x-2xs gap-y-xs"
            data-testid="tracking-architecture-list-properly-configured"
          >
            {properlyConfigured.map((tech) => (
              <span
                key={tech.name}
                className="flex min-w-0 items-center gap-xs rounded-full bg-[#f8f6f4] px-sm py-xs text-[15px] text-paragraph border border-[#dbd7cc]/40"
              >
                {tech.iconSrc && (
                  <Image
                    src={tech.iconSrc}
                    alt={tech.name}
                    width={20}
                    height={20}
                    className="size-[20px] shrink-0 object-contain"
                  />
                )}
                <span className="min-w-0 truncate">{tech.name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Architecture Diagram Card */}
      <div className="flex flex-col gap-sm">
        <p className="heading-5 text-heading font-medium">With issues</p>
        <div className="rounded-lg bg-[#f8f6f4] px-md py-8 border border-[#dbd7cc]/40">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
            {/* Left: Client-side trackers */}
            <div className="flex flex-1 flex-col items-center gap-4">
              <p className="caption-md text-center text-heading font-medium">
                Client-side trackers
              </p>
              <div
                className="flex flex-1 flex-col items-center justify-center gap-xs w-full max-w-[260px]"
                data-testid="tracking-architecture-list-client-side"
              >
                {clientSideWithIssues.map((tracker) => (
                  <a
                    key={tracker.name}
                    href={tracker.href}
                    className="flex w-full items-center justify-center gap-xs rounded-full bg-white px-sm py-xs text-[15px] text-paragraph border border-[#f1416c] hover:bg-[#feecf0] transition-colors shadow-2xs"
                  >
                    <Image
                      src={tracker.icon}
                      alt={tracker.name}
                      width={20}
                      height={20}
                      className="size-[20px] shrink-0 object-contain"
                    />
                    <span className="min-w-0 truncate font-medium">{tracker.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Middle: Transition Arrow & Server-side pills */}
            <div className="flex flex-1 flex-col items-center gap-4 text-center">
              <div className="flex items-center gap-2 text-[#ff6d34]">
                <span className="h-0.5 w-8 bg-[#ff6d34]"></span>
                <span className="caption-md font-semibold text-[#ff6d34]">
                  Move to server-side tracking
                </span>
                <svg className="size-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <div className="flex flex-col gap-2 w-full max-w-[260px]">
                {serverSideBenefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-[14px] font-medium text-paragraph border border-[#29a07c] shadow-2xs"
                  >
                    <svg
                      className="size-4 text-[#29a07c] shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Business Impact */}
            <div className="flex flex-1 flex-col gap-4">
              <p className="caption-md text-heading font-medium">Business impact</p>
              <ul className="flex flex-col gap-3">
                {businessImpact.map((impact) => (
                  <li key={impact} className="flex items-start gap-2.5 text-[15px] text-[#4b4c4b]">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#d7f4e6] text-[#1a8164] mt-0.5">
                      <svg
                        className="size-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </span>
                    <span>{impact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
