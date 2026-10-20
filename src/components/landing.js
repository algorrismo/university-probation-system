import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

function GrowthArtwork() {
  return (
    <svg
      viewBox="0 0 480 520"
      fill="none"
      aria-hidden="true"
      className="h-[260px] w-auto max-w-full sm:h-[340px] md:h-auto md:w-full"
    >
      <defs>
        <clipPath id="arch-window">
          <path d="M100 442V230a140 140 0 0 1 280 0v212Z" />
        </clipPath>
      </defs>

      <path d="M82 443V230a158 158 0 0 1 316 0v213" stroke="#C8BFB1" strokeWidth="1" />
      <path d="M100 442V230a140 140 0 0 1 280 0v212Z" fill="#E7DED0" />

      <g clipPath="url(#arch-window)">
        <path d="M100 320 380 170v272H100Z" fill="#DDD1BC" />
        <circle cx="292" cy="224" r="63" fill="#B7583F" />
        <path d="M100 363c77-53 173-58 280-4v83H100Z" fill="#88917B" />
        <path d="M100 422c63-108 151-103 280-2v44H100Z" fill="#58674E" />
        <path d="M210 474c-27-82-11-153 70-224" stroke="#F7F3EB" strokeWidth="30" />
        <path d="M210 474c-27-82-11-153 70-224" stroke="#B8AA92" strokeWidth="0.8" />
      </g>

      <path d="M60 443h360" stroke="#BFB5A6" strokeWidth="1" />
      <path d="M342 66v24m-12-12h24" stroke="#B7583F" strokeWidth="1" />
      <circle cx="73" cy="317" r="3" fill="#B7583F" />
      <path d="M183 478h114" stroke="#D9D0C1" strokeWidth="1" />
    </svg>
  );
}

export default function Landing() {
  return (
    <div className="flex min-h-svh flex-col bg-[#F7F4ED] text-[#373C32] selection:bg-[#E2D6C5]">
      <header className="mx-auto flex w-full max-w-[1320px] items-center px-7 py-7 sm:px-12 sm:py-9">
        <span className="flex items-center gap-2.5 font-serif text-[25px] tracking-tight">
          <span aria-hidden="true" className="size-2 rounded-full bg-[#B7583F]" />
          academia
        </span>
      </header>

      <main className="mx-auto grid w-full max-w-[1120px] flex-1 content-center items-center gap-3 px-7 pb-12 sm:px-12 md:grid-cols-[1.1fr_1fr] md:gap-12 md:py-10">
        <div className="order-2 text-center md:order-1 md:text-left">
          <h1 className="font-serif text-[clamp(3.5rem,7vw,6.5rem)] leading-[1.03] font-normal tracking-[-0.055em]">
            A little room<br />
            <em className="font-normal text-[#8D4938]">to grow.</em>
          </h1>
          <p className="mt-6 text-[13px] leading-relaxed text-[#747466] sm:text-sm">
            A simple space for student progress.
          </p>
          <Link
            href="/admin/dashboard"
            className="group mt-8 inline-flex min-h-12 items-center justify-center gap-8 rounded-full bg-[#373F32] py-3.5 pr-5 pl-6 text-xs font-medium text-[#F7F4ED] transition-colors hover:bg-[#505A47] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8D4938] motion-reduce:transition-none sm:mt-10"
          >
            View dashboard
            <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" />
          </Link>
        </div>

        <div className="order-1 flex items-center justify-center md:order-2">
          <GrowthArtwork />
        </div>
      </main>

      <footer className="mx-auto w-full max-w-[1320px] px-7 pb-6 text-center text-[9px] tracking-[0.12em] text-[#878477] sm:px-12 sm:pb-8 md:text-left">
        UNIVERSITY PROBATION SYSTEM
      </footer>
    </div>
  );
}
