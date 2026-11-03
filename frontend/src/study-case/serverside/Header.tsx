import { Link } from './compat';

export function Header() {
  return (
    <div className="visuals-neutral flex min-h-3xl items-center justify-between px-md py-sm lg:px-xl border-b border-[#dbd7cc]/40">
      <header className="mx-auto flex w-full max-w-[1336px] items-center justify-between">
        <div className="flex items-center gap-lg">
          <Link
            data-testid="main-logo"
            className="relative flex items-center gap-2.5 text-heading"
            href="/"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-[#ff6d34] text-white shadow-2xs">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                role="img"
                aria-label="Tracking Checker logo"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <span className="font-sans font-semibold text-[20px] tracking-tight text-heading">
              Tracking Checker
            </span>
          </Link>
        </div>
      </header>
    </div>
  );
}
