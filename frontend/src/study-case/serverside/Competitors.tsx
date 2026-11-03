import { Image } from './compat';
import { InfoDialog } from './InfoDialog';
import { reportData, type CompetitorItem } from './data/reportData';

interface CompetitorsProps {
  competitors?: CompetitorItem[];
}

export function Competitors(props: CompetitorsProps) {
  const competitors = props.competitors ?? reportData.competitors;

  const rows = [
    { label: 'Tracking score', type: 'score' },
    { label: 'Server-side tracking', type: 'serverSide' },
    { label: 'Analytics', type: 'category', key: 'analytics' },
    { label: 'Advertising', type: 'category', key: 'advertising' },
    { label: 'Cookie durability', type: 'category', key: 'cookieDurability' },
  ];

  return (
    <section className="flex flex-col gap-lg rounded-lg bg-primary p-lg-responsive border border-tertiary shadow-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-xs">
        <p className="heading-4 text-paragraph">Your score vs. competitors</p>
        <InfoDialog
          title="Your score vs. competitors"
          description={`Your score vs. competitors shows how your tracking setup compares to similar websites in your industry.\n\nWe identify websites that compete with yours in paid ads and organic search, then scan their tracking setups using the same method as your website.\n\nYou can compare your overall score, server-side tracking adoption, analytics setup, cookie durability, and advertising integrations.`}
          dataTestId="competitors-button-info"
        />
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto pb-2">
        <div className="flex w-max min-w-full flex-col">
          {/* Header Row */}
          <div className="flex border-b border-tertiary pb-3">
            <div className="flex min-h-[50px] flex-1 px-sm min-w-[230px] items-center text-sm font-medium text-slate-500">
              Feature / Site
            </div>
            {competitors.map((site) => (
              <div
                key={site.key}
                className={`flex min-h-[50px] flex-1 px-sm min-w-[170px] items-center justify-center gap-2 ${
                  site.isYourSite ? 'bg-[#f8f6f4] rounded-t-lg font-medium' : ''
                }`}
              >
                <div className="size-5 shrink-0 relative overflow-hidden rounded-full border border-neutral-300">
                  <Image
                    src={site.faviconUrl}
                    alt={site.name}
                    width={20}
                    height={20}
                    className="size-full object-cover"
                  />
                </div>
                <span className="text-[14px] text-heading font-medium truncate max-w-[130px]">
                  {site.name}
                </span>
              </div>
            ))}
          </div>

          {/* Rows */}
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex border-b border-tertiary/70 py-4 items-center"
              data-testid="competitors-table-row"
            >
              <div className="flex flex-1 px-sm min-w-[230px] items-center">
                <span className="text-[14px] text-heading font-medium">{row.label}</span>
              </div>

              {competitors.map((site) => (
                <div
                  key={site.key}
                  className={`flex flex-1 px-sm min-w-[170px] flex-col items-center justify-center py-1 ${
                    site.isYourSite ? 'bg-[#f8f6f4]' : ''
                  }`}
                >
                  {row.type === 'score' && (
                    <span className="heading-4 text-heading font-semibold">
                      {site.trackingScore ?? '—'}
                    </span>
                  )}

                  {row.type === 'serverSide' &&
                    (site.usesServerSide ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[13px] font-medium text-[#135242] bg-[#d7f4e6] border border-[#80d5b5]">
                        <svg className="size-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[13px] font-medium text-[#85243b] bg-[#feecf0] border border-[#f9a8bb]">
                        <svg className="size-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        No
                      </span>
                    ))}

                  {row.type === 'category' && (
                    <span className="text-[14px] font-medium text-[#0d0d0d]">
                      {site.categories[row.key as keyof typeof site.categories] ?? '—'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* Bottom rounded cap for your site column */}
          <div className="flex">
            <div className="flex min-w-[230px]"></div>
            {competitors.map((site) => (
              <div
                key={site.key}
                className={`min-w-[170px] h-3 ${site.isYourSite ? 'rounded-b-lg bg-[#f8f6f4]' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
