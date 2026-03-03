import Link from 'next/link';
import React from 'react';

export default function ArchiveBook() {
  return (
    <div className="flex justify-center md:absolute top-0 right-4 lg:right-0 z-30 mb-12 md:mb-0">
      <Link
        href="/interviews/archive"
        className="group relative block w-64 transition-all duration-300 hover:-translate-y-2 md:rotate-2 md:hover:rotate-4 cursor-pointer"
      >
        <div className="absolute -right-1.5 top-2 h-[92%] w-3 bg-linear-to-b from-[#f5f1e6] to-[#e8e1d3] border border-gray-400 rounded-sm shadow-sm"></div>

        <div className="relative flex">

          <div className="w-14 bg-linear-to-b from-[#5a3e2b] to-[#3e2a1f] border border-[#2a1a12] rounded-l-md shadow-md flex items-center justify-center">
            <span className="-rotate-90 text-[11px] tracking-widest text-yellow-200 font-semibold">
            </span>
          </div>

          <div className="flex-1 bg-linear-to-br from-[#6b4a34] to-[#4b3224] border-t border-r border-b border-[#2a1a12] rounded-r-md p-6 shadow-xl transition-all duration-300 group-hover:shadow-2xl">
            
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_60%)] rounded-r-md pointer-events-none"></div>

            <div className="relative">
              <h3 className="text-lg font-bold font-serif text-yellow-100 tracking-wide mb-3">
                Interview Archive
              </h3>

              <p className="text-xs font-bold text-yellow-50/80 leading-relaxed">
                Didn't find your company?
              </p>

              <div className="mt-6 text-[11px] text-yellow-200 font-bold uppercase tracking-widest border-t border-yellow-200/30 pt-3">
                Open Archive →
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}