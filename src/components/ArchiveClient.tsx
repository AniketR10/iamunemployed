'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Filter, Search } from 'lucide-react';
import AuthGuard from './AuthGuard';

export default function ArchiveClient({ companiesList }: { companiesList: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCompanies = companiesList.filter((company) => 
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const folderColors = [
    'bg-[#FFC700]', 
    'bg-[#FF5A5F]', 
    'bg-[#769CFF]', 
    'bg-[#00E59B]', 
    'bg-[#FF90E8]',
  ];

  return (
    <div className="flex flex-col-reverse lg:grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-10">
      
      <div className="lg:col-span-8 xl:col-span-9 w-full">
        {filteredCompanies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredCompanies.map((company, index) => {
              const tagBgColor = folderColors[index % folderColors.length];

              return (
                <AuthGuard key={company.name}>
                  <Link 
                    href={`/archives/${encodeURIComponent(company.name)}`}
                    prefetch={false} 
                    className="block group relative h-full"
                  >
                    <div className="h-full min-h-45 flex flex-col bg-white border-2 border-gray-900 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-[2px_2px_0px_0px_#FF5A5F] rounded-sm">
                      
                      <div className="flex flex-col justify-between items-start mb-16 gap-3">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-tight uppercase wrap-break-words">
                          {company.name}
                        </h2>
                        <span className={`shrink-0 ml-2 px-2 py-1 text-[10px] sm:text-xs font-black border-2 border-gray-900 uppercase tracking-widest shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${tagBgColor} text-gray-900`}>
                          {company.count} POST{company.count !== 1 ? 'S' : ''}
                        </span>
                      </div>

                      <div className="mt-auto">
                        <div className="pt-4 border-t-2 border-gray-900 flex justify-end">
                          <span className="font-black text-sm text-gray-900 group-hover:text-[#FF5A5F] group-hover:underline decoration-2 underline-offset-2 flex items-center gap-1 transition-colors">
                            OPEN FOLDER <span className="text-xl leading-none">→</span>
                          </span>
                        </div>
                      </div>

                    </div>
                  </Link>
                </AuthGuard>
              );
            })}
          </div>
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 border-2 border-gray-900 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center w-full">
            <p className="text-4xl mb-4">🤷‍♂️</p>
            <p className="text-xl font-black text-gray-900 uppercase text-center">
              {companiesList.length === 0 ? "The Archive is currently empty!" : "No companies match your search."}
            </p>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                className="mt-4 text-sm font-bold underline text-[#FF5A5F] cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      <div className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-20">
        <div className="p-5 border-2 border-gray-900 rounded-xl bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          
          <div className="flex items-center gap-2 mb-5 pb-3 border-b-2 border-gray-900">
            <Filter size={20} strokeWidth={2.5} />
            <h3 className="font-black text-xl uppercase tracking-tight">Filters</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-gray-900 uppercase mb-2">
                Search By Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Amazon"
                  className="w-full bg-[#F8F3E7] border-2 border-gray-900 text-gray-900 text-sm font-bold py-2 pl-10 pr-3 rounded focus:outline-none"
                />
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" strokeWidth={3} />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-black text-gray-900 uppercase mb-2">
                Or Select Company
              </label>
              <select
                value={companiesList.some(c => c.name.toLowerCase() === searchQuery.toLowerCase()) ? searchQuery : ''}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8F3E7] border-2 border-gray-900 text-gray-900 text-sm font-bold py-2 px-3 rounded focus:outline-none cursor-pointer"
              >
                <option value="">-- All Companies --</option>
                {companiesList.map(c => (
                  <option key={c.name} value={c.name}>{c.name} ({c.count})</option>
                ))}
              </select>
            </div>

            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="w-full mt-2 bg-[#FF5A5F] text-white border-2 border-gray-900 py-2 rounded font-black uppercase tracking-wide shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Clear Filter
              </button>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}