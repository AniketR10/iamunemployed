'use client';
import { useEffect, useState, useRef, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import Navbar from '@/src/components/Navbar';
import { 
  MapPin, Filter, X, Loader2, ChevronDown, Globe, ExternalLink, 
  Calendar, TrendingUp, Check, Search, Users 
} from 'lucide-react';
import { supabase } from '@/src/lib/supabase';
import Footer from '@/src/components/Footer';

const PAGE_SIZE = 100;

const LinkedinIcon = ({ size = 12 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const TwitterIcon = ({ size = 12 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkIcon = ({ size = 12 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
  </svg>
);

const getFounderInfo = (url: string) => {
  let name = "Founder";
  let icon = <LinkIcon size={12} />;
  let type = "website";

  const cleanUrl = url.replace(/\/$/, '');

  if (url.includes('linkedin')) {
    type = "linkedin";
    icon = <LinkedinIcon size={12} />;
    const match = cleanUrl.match(/\/in\/([^/]+)/);
    if (match && match[1]) name = match[1];
  } else if (url.includes('twitter') || url.includes('x.com')) {
    type = "twitter";
    icon = <TwitterIcon size={12} />;
    const parts = cleanUrl.split('/');
    let rawName = parts[parts.length - 1]; 
    if (rawName.startsWith('@')) rawName = rawName.substring(1);
    if (rawName.includes('?')) rawName = rawName.split('?')[0];
    name = rawName;
  }

  return { name, icon, type };
};

const CustomSelect = ({ 
  label, 
  value, 
  options, 
  onChange 
}: { 
  label: string, 
  value: string, 
  options: string[], 
  onChange: (val: string) => void 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setSearch(''); 
    }
  }, [isOpen]);

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    return options.filter(opt => 
      opt.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  return (
    <div className="mb-5 relative" ref={dropdownRef}>
      <label className="block text-xs font-black text-gray-900 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-[#F8F3E7] border-2 border-gray-900 rounded-lg px-3 py-2.5 text-xs font-bold focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
      >
        <span className="truncate">{value}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border-2 border-gray-900 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 overflow-hidden flex flex-col max-h-60">
          <div className="p-2 border-b-2 border-gray-100 bg-gray-50 sticky top-0">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                ref={inputRef}
                type="text" 
                placeholder="Search..." 
                className="w-full pl-8 pr-2 py-1.5 text-xs font-bold border-2 border-gray-200 rounded focus:border-gray-900 focus:outline-none transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div 
                  key={option}
                  onClick={() => { onChange(option); setIsOpen(false); }}
                  className={`px-4 py-2 text-xs font-bold cursor-pointer hover:bg-gray-100 flex items-center justify-between border-b border-gray-50 last:border-0
                    ${value === option ? 'bg-blue-50 text-blue-600' : 'text-gray-900'}
                  `}
                >
                  {option}
                  {value === option && <Check size={12} />}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-xs font-bold text-gray-400 text-center">No results</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function YCPage() {
  const [ycList, setYcList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [batchOptions, setBatchOptions] = useState<string[]>([]);
  const [locationOptions, setLocationOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      const { data } = await supabase.from('ycstartups').select('batch, all_locations');
      if (data) {
        const uniqueBatches = new Set(data.map(item => item.batch).filter(Boolean));
        const uniqueLocs = new Set(data.map(item => item.all_locations || 'Remote').filter(Boolean));
        setBatchOptions(['All', ...Array.from(uniqueBatches).sort().reverse()]);
        setLocationOptions(['All', ...Array.from(uniqueLocs).sort()]);
      }
    };
    fetchFilterOptions();
  }, []);

  const fetchStartups = async (pageNumber: number, isLoadMore: boolean = false) => {
    if (!isLoadMore) setLoading(true);
    else setLoadingMore(true);

    try {
      let query = supabase.from('ycstartups').select('*', { count: 'exact' });

      if (selectedBatch !== 'All') query = query.eq('batch', selectedBatch);
      if (selectedLocation !== 'All') {
        if (selectedLocation === 'Remote') query = query.or('all_locations.is.null,all_locations.ilike.%Remote%');
        else query = query.ilike('all_locations', `%${selectedLocation}%`);
      }

      const from = pageNumber * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data } = await query.range(from, to).order('id', { ascending: true });

      if (data) {
        if (isLoadMore) setYcList(prev => [...prev, ...data]);
        else setYcList(data);
        setHasMore(data.length === PAGE_SIZE);
      }
    } catch (error) {
      console.error("Error fetching startups:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    fetchStartups(0, false); 
  }, [selectedBatch, selectedLocation]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchStartups(nextPage, true);
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return '';
    return new Date(timestamp * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#F8F3E7] font-sans text-gray-900 text-sm flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8 max-w-350 grow">
        <div className="flex flex-col md:flex-row gap-10">
          
          <div className="flex-1 order-2 md:order-1">
            <div className="flex items-center justify-between mb-6 border-b-2 border-gray-900 pb-3">
               <h1 className="text-3xl font-black text-[#FF5A5F] tracking-tight">YC Directory</h1>
               <span className="font-bold text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-300 text-xs">{ycList.length} loaded</span>
            </div>

            {loading ? (
               <div className="flex justify-center items-center py-20 text-gray-500">
                  <Loader2 className="animate-spin mr-2" /> Loading...
               </div>
            ) : (
              <>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  {ycList.map((item) => (
                    <div key={item.id} className="flex flex-col h-full p-7 border-2 border-gray-900 rounded-lg bg-white shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:translate-x hover:translate-y hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all">
                      
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-black leading-tight text-gray-900">{item.name}</h3>
                        <span className="bg-[#FF6600] text-white px-3 py-0.5 text-xs font-bold border-2 border-gray-900 rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                          {item.batch}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 mb-4 text-xs font-bold text-gray-700 bg-gray-50 p-2.5 rounded border border-gray-200">
                        <div className="flex items-center">
                           <MapPin size={13} className="mr-1.5 text-blue-600" /> 
                           {item.all_locations || 'Remote'}
                        </div>
                        {item.stage && (
                            <div className="flex items-center border-l-2 border-gray-300 pl-3">
                                <TrendingUp size={13} className="mr-1.5 text-green-600" /> 
                                {item.stage}
                            </div>
                        )}
                        {item.launched_at && (
                            <div className="flex items-center border-l-2 border-gray-300 pl-3">
                                <Calendar size={13} className="mr-1.5 text-purple-600" /> 
                                {formatDate(item.launched_at)}
                            </div>
                        )}
                      </div>

                        
                      <p className="text-gray-700 font-medium text-sm mb-5 leading-relaxed grow line-clamp-2">
                        {item.one_liner || "No description provided."}
                      </p>
                        
                        {item.founder_socials && item.founder_socials.length > 0 && (
                        <div className="mb-5">
                            <span className="text-[11px] uppercase font-black text-gray-400 mb-2 tracking-wider flex items-center gap-1">
                              <Users size={12} /> Founders
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {(() => {
                                  const seenNames = new Set();
                                  
                                  return (item.founder_socials as string[]).map((url, i) => {
                                      const { name, icon, type } = getFounderInfo(url);
                                      
                                      if (seenNames.has(name)) return null;
                                      
                                      seenNames.add(name);

                                      let colorClass = "bg-gray-50 border-gray-200 hover:border-black text-gray-800";
                                      if (type === 'linkedin') colorClass = "bg-blue-50 border-blue-200 hover:border-blue-500 text-blue-800";
                                      
                                      return (
                                        <a 
                                            key={i} 
                                            href={url} 
                                            target="_blank" 
                                            className={`flex items-center gap-1.5 px-2.5 py-1.5 border text-xs font-bold transition rounded hover:bg-opacity-80 ${colorClass}`}
                                        >
                                            {icon} {name}
                                        </a>
                                      );
                                  }).filter(Boolean);
                                })()}
                            </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t-2 border-dashed border-gray-200">
                        <a 
                            href={item.website || '#'} 
                            target="_blank"
                            className={`flex items-center justify-center gap-2 border-2 border-gray-900 py-2.5 rounded-lg font-black text-xs transition shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x hover:translate-y
                            ${item.website ? 'bg-white text-gray-900 hover:bg-gray-50' : 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300 shadow-none'}`}
                        >
                            <Globe size={14} /> Website
                        </a>

                        <a 
                            href={item.url || '#'} 
                            target="_blank"
                            className="flex items-center justify-center gap-2 bg-[#FF6600] border-2 border-gray-900 text-white py-2.5 rounded-lg font-black text-xs hover:bg-[#e55c00] transition shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x hover:translate-y"
                        >
                            <ExternalLink size={14} /> YC Profile
                        </a>
                      </div>

                    </div>
                  ))}
                </div>

                {hasMore && ycList.length > 0 && (
                  <div className="mt-8 text-center">
                    <button 
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="bg-white border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-lg font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y hover:translate-x transition-all disabled:opacity-50 flex items-center justify-center mx-auto gap-2"
                    >
                      {loadingMore ? <Loader2 className="animate-spin" size={14} /> : <ChevronDown size={14} />}
                      {loadingMore ? 'Loading...' : 'Load More'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <aside className="w-full md:w-64 order-1 md:order-2 space-y-4 mt-12">
            <div className="p-4 border-2 border-gray-900 rounded-lg bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sticky top-32">
              <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-gray-100">
                <h2 className="text-base font-black flex items-center gap-1.5">
                  <Filter size={16} /> Filters
                </h2>
                {(selectedBatch !== 'All' || selectedLocation !== 'All') && (
                  <button onClick={() => { setSelectedBatch('All'); setSelectedLocation('All'); }} className="text-[10px] text-red-500 font-bold hover:underline flex items-center bg-red-50 px-2 py-1 rounded">
                    <X size={10} className="mr-1"/> Clear
                  </button>
                )}
              </div>

              <CustomSelect label="Batch" value={selectedBatch} options={batchOptions} onChange={setSelectedBatch} />
              <CustomSelect label="Location" value={selectedLocation} options={locationOptions} onChange={setSelectedLocation} />

            </div>
          </aside>
        </div>
      </div>
      <Footer/>
    </div>
  );
}