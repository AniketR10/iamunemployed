'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Filter, Search } from 'lucide-react';

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
            {filteredCompanies.map((company, index) => {
              const folderBgColor = folderColors[index % folderColors.length];

              return (
                <Link 
                  key={company.name} 
                  href={`/archives/${encodeURIComponent(company.name)}`}
                  className="group block relative cursor-pointer"
                >
                  <div className={`relative z-10 transition-all duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]`}>
                    
                    <div className="flex items-end relative z-10">
                      <div className={`${folderBgColor} h-7 w-5/12 border-2 border-gray-900 border-b-0 rounded-t-lg`}></div>
                      <div className="w-7/12 border-b-2 border-gray-900"></div>
                    </div>
                    
                    <div className={`${folderBgColor} border-x-2 border-b-2 border-gray-900 rounded-b-xl p-5 min-h-42.5 flex flex-col justify-between -mt-px relative z-0`}>
                      
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-xl font-black tracking-tight uppercase truncate text-gray-900">
                          {company.name}
                        </h3>
                        <span className="bg-white border-2 border-gray-900 px-2 py-0.5 text-xs font-black rounded text-gray-900 shrink-0">
                          {company.count} POST{company.count !== 1 ? 'S' : ''}
                        </span>
                      </div>
                      
                      <div className="mt-6 flex items-center gap-1 text-xs font-bold text-gray-800 uppercase group-hover:text-gray-900 transition-colors">
                        Open Folder <ArrowRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                      </div>

                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="p-10 bg-white border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center w-full">
            <p className="text-xl font-black uppercase text-gray-900">
              {companiesList.length === 0 ? "The Archive is currently empty! Come back later" : "No companies match your search."}
            </p>
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