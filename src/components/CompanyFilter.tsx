"use client";

import { useState, useEffect } from "react";
import { Company } from "../types/company";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Search, X, AlertCircle } from "lucide-react";
import AuthGuard from "./AuthGuard";

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
    const activeSearch = searchParams.get('search') || '';

    const [searchTerm, setSearchTerm] = useState(activeSearch);

    useEffect(() => {
        setSearchTerm(activeSearch);
    }, [activeSearch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if(searchTerm !== activeSearch){
                const params = new URLSearchParams(searchParams.toString());
                if(searchTerm) {
                    params.set('search', searchTerm);
                } else {
                    params.delete('search');
                }
                router.replace(`${pathname}?${params.toString()}`, {scroll: false});
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [searchTerm, router, pathname, searchParams, activeSearch]);

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

    // const handleSearch = (term: string) => {
    //     const params = new URLSearchParams(searchParams.toString());
    //     if(term) {
    //         params.set('search', term);
    //     } else {
    //         params.delete('search');
    //     }
    //     router.replace(`${pathname}?${params.toString()}`, {scroll: false});

    // }

    const filteredCompanies = initialCompanies.filter((company) => {
        const companyRegion = (company.region || '').toLowerCase();
        const companyTechs = (company.technologies || []).map(t => t.toLowerCase());
        const companyTitle = (company.title || '').toLowerCase();

        const searchTerm = activeSearch.toLowerCase();

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

        let matchesSearch = true;
        if(searchTerm) {
            matchesSearch = companyTitle.includes(searchTerm);
        }

        return matchesRegion && matchesTech && matchesSearch;
    })

   return (
        <div>
            <div className="max-w-2xl mx-auto mb-8 px-4">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-6 w-6 text-gray-900" strokeWidth={3} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-12 pr-12 py-3.5 bg-white border-2 border-gray-900 text-gray-900 font-bold text-lg focus:outline-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-none transition-all"
                    />
                    {activeSearch && (
                        <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-900">
                            <X className="h-6 w-6" strokeWidth={3} />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-center gap-5 mb-10">
                
                <div className="flex flex-wrap justify-center gap-2.5 px-4">
                    {FILTERS.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => handleFilter('region', filter)}
                            className={`px-5 py-2 font-black uppercase text-sm border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${activeRegion === filter ? 'bg-[#FF5A5F] text-white translate-x-0.5 translate-y-0.5 shadow-none' : 'bg-white text-gray-900 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap justify-center gap-2 px-4 max-w-5xl">
                    {TECH.map((tech) => (
                        <button
                            key={tech}
                            onClick={() => handleFilter('tech', tech)}
                            className={`px-3 py-1.5 font-bold uppercase text-xs border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all rounded-sm ${activeTech === tech ? 'bg-[#FFC700] text-gray-900 translate-x-0.5 translate-y-0.5 shadow-none' : 'bg-gray-50 text-gray-600 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'}`}
                        >
                            {tech}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCompanies.length > 0 ? (
                    filteredCompanies.map((company) => (
                        <AuthGuard key={company.id}>
                        <Link href={`/companies/${company.slug}`} key={company.id} className="block group relative">
                            <div className="h-full flex flex-col bg-white border-2 border-gray-900 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-[2px_2px_0px_0px_#FF5A5F] rounded-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">{company.title}</h2>
                                    <span className={`shrink-0 ml-2 px-2 py-1 text-[10px] sm:text-xs font-black border-2 border-gray-900 uppercase tracking-widest shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${company.remote_policy === 'Remote-first' ? 'bg-[#00A86B] text-white' : company.remote_policy === 'Remote-friendly' ? 'bg-[#FF5A5F] text-white' : 'bg-gray-200 text-gray-900'}`}>{company.remote_policy?.replace('-', ' ')}</span>
                                </div>
                                {company.company_blurb && <p className="text-sm font-bold text-gray-700 mb-5 line-clamp-3 border-l-4 border-gray-900 pl-3 group-hover:border-[#FF5A5F] transition-colors">{company.company_blurb}</p>}
                                <div className="mt-auto">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {company.technologies?.slice(0, 3).map((tech) => {
                                            const colors = getColor(tech);
                                            return <span key={tech} style={{ backgroundColor: colors.bg, color: colors.text }} className="text-[10px] font-black border-2 border-gray-900 px-2 py-0.5 uppercase tracking-wider shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">{tech}</span>
                                        })}
                                        {(company.technologies?.length || 0) > 3 && <span className="text-[10px] font-black text-gray-900 py-0.5 px-2 border-2 border-gray-900 bg-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">+{company.technologies!.length - 3} MORE</span>}
                                    </div>
                                    <div className="pt-4 border-t-2 border-gray-900 flex justify-end">
                                        <span className="font-black text-sm text-gray-900 group-hover:text-[#FF5A5F] group-hover:underline decoration-2 underline-offset-2 flex items-center gap-1 transition-colors">VIEW DETAILS <span className="text-xl leading-none">→</span></span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                        </AuthGuard>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-75">                        <p className="text-4xl mb-4">🤷‍♂️</p>
                        <p className="text-xl font-black text-gray-900 uppercase text-center">No companies found</p>
                        <button onClick={() => router.push(pathname)} className="mt-4 text-sm font-bold underline text-[#FF5A5F] cursor-pointer">Clear all filters</button>
                    </div>
                )}
            </div>
        </div>
    );
}