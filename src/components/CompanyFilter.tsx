"use client";

import { useState } from "react";
import { Company } from "../types/company";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

const tagColors = [
  { bg: '#FF5A5F', text: 'white' },
  { bg: '#00A86B', text: 'white' }, 
  { bg: '#FFC700', text: 'black' }, 
  { bg: '#2D7FF9', text: 'white' }, 
  { bg: '#9D4EDD', text: 'white' }, 
];

const getColor = (tech: string) => {
    const idx = tech.length % tagColors.length;
    return tagColors[idx];
};

const FILTERS = ['Worldwide', 'Americas', 'Europe', 'Asia Pacific', 'Africa'];
const TECH = ['All', 'JavaScript', 'Mobile', 'Devops','Cloud','ML/AI', 'Python', 'Go', 'Java', 'PHP', 'Ruby', 'Rust'];

export default function CompanyFilter({initialCompanies}: {initialCompanies: Company[]}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const activeRegion = searchParams.get('region') || 'Worldwide';
    const activeTech = searchParams.get('tech') || 'All';

    const handleFilter = (type: 'region' | 'tech', value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (type === 'region') {
            if (value === 'Worldwide') params.delete('region');
            else params.set('region', value);
        } 
        
        if (type === 'tech') {
            if (value === 'All') params.delete('tech');
            else params.set('tech', value);
        }

        router.push(`${pathname}?${params.toString()}`, {scroll: false});
    }

    const filteredCompanies = initialCompanies.filter((company) => {
        const companyRegion = (company.region || '').toLowerCase();
        const companyTechs = (company.technologies || []).map(t => t.toLowerCase());

        let matchesRegion = false;
        if (activeRegion === 'Worldwide') {
            matchesRegion = true;
        } else if (activeRegion === 'Americas') {
            matchesRegion = companyRegion.includes('america') || companyRegion.includes('usa') || companyRegion.includes('canada') || companyRegion.includes('latam') || companyRegion.includes('brazil') || companyRegion.includes('mexico') || companyRegion.includes('argentina'); 
        } else if (activeRegion === 'Europe') {
            matchesRegion = companyRegion.includes('europe') || companyRegion.includes('uk') || companyRegion.includes('united kingdom') || companyRegion.includes('germany') || companyRegion.includes('emea');
        } else if (activeRegion === 'Asia Pacific') {
            matchesRegion = companyRegion.includes('asia') || companyRegion.includes('pacific') || companyRegion.includes('australia') || companyRegion.includes('india') || companyRegion.includes('apac');
        } else if (activeRegion === 'Africa') {
            matchesRegion = companyRegion.includes('africa') || companyRegion.includes('nigeria') || companyRegion.includes('kenya') || companyRegion.includes('south africa') || companyRegion.includes('egypt') || companyRegion.includes('ghana') || companyRegion.includes('emea');
        }

        let matchesTech = false;
        if (activeTech === 'All') {
            matchesTech = true;
        } else if(activeTech === 'ML/AI') {
            const term = 'ML';
            matchesTech = companyTechs.includes(term.toLowerCase());
        }
        else {
            matchesTech = companyTechs.includes(activeTech.toLowerCase());
        }

        return matchesRegion && matchesTech;
    })

    return (
        <div>
      <div className="flex flex-wrap justify-center gap-4 mb-16 px-4">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilter('region', filter)}
            className={`
              px-6 py-3 font-black uppercase text-sm border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all
              ${activeRegion === filter 
                ? 'bg-[#FF5A5F] text-white translate-x-1 translate-y-1 shadow-none' 
                : 'bg-white text-gray-900 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
              }
            `}
          >
            {filter}
          </button>
        ))}
      </div>

            <div className="flex flex-wrap justify-center gap-2 mb-16 px-4 max-w-4xl mx-auto">
                {TECH.map((tech) => (
                <button
                    key={tech}
                    onClick={() => handleFilter('tech', tech)}
                    className={`
                    px-3 py-1.5 font-bold uppercase text-[10px] sm:text-xs border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all rounded-sm
                    ${activeTech === tech 
                        ? 'bg-[#FFC700] text-gray-900 translate-x-0.5 translate-y-0.5 shadow-none' 
                        : 'bg-gray-50 text-gray-600 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                    }
                    `}
                >
                    {tech}
                </button>
                ))}
            </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map((company) => (
            <Link 
              href={`/companies/${company.slug}`} 
              key={company.id}
              className="block group relative"
            >
              <div className="h-full flex flex-col bg-white border-2 border-gray-900 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-[2px_2px_0px_0px_#FF5A5F] rounded-sm">
                
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
                    {company.title}
                  </h2>
                  <span className={`shrink-0 ml-2 px-2 py-1 text-[10px] font-black border-2 border-gray-900 uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                    ${company.remote_policy === 'Remote-first' ? 'bg-[#00A86B] text-white' : 
                      company.remote_policy === 'Remote-friendly' ? 'bg-[#FF5A5F] text-white' : 
                      'bg-gray-200 text-gray-900'}`}>
                    {company.remote_policy.replace('-', ' ')}
                  </span>
                </div>

                {company.company_blurb && (
                  <p className="text-sm font-bold text-gray-700 mb-6 line-clamp-3 border-l-4 border-gray-900 pl-3 group-hover:border-[#FF5A5F] transition-colors">
                    {company.company_blurb}
                  </p>
                )}

                <div className="mt-auto">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {company.technologies?.slice(0, 3).map((tech) => {
                      const colors = getColor(tech);
                      return (
                        <span 
                          key={tech} 
                          style={{ backgroundColor: colors.bg, color: colors.text }}
                          className="text-[10px] font-black border-2 border-gray-900 px-2 py-1 uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        >
                          {tech}
                        </span>
                    )})}
                    {(company.technologies?.length || 0) > 3 && (
                      <span className="text-[10px] font-black text-gray-900 py-1 px-2 border-2 border-gray-900 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        +{(company.technologies?.length || 0) - 3} MORE
                      </span>
                    )}
                  </div>

                  <div className="pt-4 border-t-2 border-gray-900 flex justify-end">
                     <span className="font-black text-gray-900 group-hover:text-[#FF5A5F] group-hover:underline decoration-2 underline-offset-2 flex items-center gap-1 transition-colors">
                       VIEW DETAILS <span className="text-xl leading-none">→</span>
                     </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <p className="text-2xl font-black text-gray-400 uppercase">No companies found for this region.</p>
          </div>
        )}
      </div>
    </div>
    );
}