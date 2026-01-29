'use client';
import { useEffect, useState, useCallback } from 'react';
import Navbar from '@/src/components/Navbar';
import { ExternalLink, DollarSign, Users, Calendar, Filter, Loader2, ArrowDownCircle } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';
import Footer from '@/src/components/Footer';
import AuthGuard from '@/src/components/AuthGuard';

const ITEMS_PER_PAGE = 20;

export default function StartupsPage() {
  const [startups, setStartups] = useState<any[]>([]);
  const [dateFilter, setDateFilter] = useState('all');
  const [roundFilter, setRoundFilter] = useState('all');

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [availableRounds, setAvailableRounds] = useState<string[]>([]);

  const getHost = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch(e) {
      return url;
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(() => {
    const fetchRounds = async () => {
      const { data } = await supabase
        .from('startups')
        .select('funding_round')
        .not('funding_round', 'is', null);

      if (data) {
        const uniqueRounds = Array.from(new Set(data.map(d => d.funding_round))).sort();
        setAvailableRounds(uniqueRounds);
      }
    };
    fetchRounds();
  }, []);

  const fetchStartups = useCallback(async (pageNumber: number, isNewFilter: boolean = false) => {
    setIsLoading(true);

    try {
      let query = supabase
        .from('startups')
        .select('*')
        .order('announced_date', { ascending: false });

      if (dateFilter !== 'all') {
        const now = new Date();
        let daysToSubtract = 0;
        
        if (dateFilter === '1d') daysToSubtract = 2; 
        if (dateFilter === '7d') daysToSubtract = 7;
        if (dateFilter === '30d') daysToSubtract = 30;

        if (daysToSubtract > 0) {
          const pastDate = new Date();
          pastDate.setDate(now.getDate() - daysToSubtract);
          query = query.gte('announced_date', pastDate.toISOString());
        }
      }

      if (roundFilter !== 'all') {
        query = query.ilike('funding_round', `%${roundFilter}%`);
      }

      const from = pageNumber * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      
      const { data, error } = await query.range(from, to);

      if (error) throw error;

      if (data) {
        if (isNewFilter) {
          setStartups(data);
        } else {
          setStartups(prev => [...prev, ...data]);
        }

        if (data.length < ITEMS_PER_PAGE) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      }
    } catch (err) {
      console.error("Error fetching startups:", err);
    } finally {
      setIsLoading(false);
      setInitialLoading(false);
    }
  }, [dateFilter, roundFilter]);

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    fetchStartups(0, true);
  }, [dateFilter, roundFilter, fetchStartups]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchStartups(nextPage, false);
  };

  return (
    <div className="min-h-screen bg-[#F8F3E7] font-sans text-gray-900 flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 lg:ml-[8.33%] lg:w-[58.33%]">
            <h1 className="text-3xl font-black border-b-4 border-gray-900 pb-4">Startup Database</h1>
        </div>
        
        <div className="flex flex-col-reverse lg:grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-start">
          
          <div className="lg:col-start-2 lg:col-span-7 space-y-6">
            
            {initialLoading && (
               <div className="p-12 flex justify-center text-gray-500">
                  <Loader2 className="animate-spin" size={32} />
               </div>
            )}

            {!initialLoading && startups.length === 0 && (
              <div className="p-8 text-center text-gray-500 font-bold border-2 border-dashed border-gray-300 rounded-lg">
                No startups match your filters.
              </div>
            )}

            {startups.map((startup) => {
              const validFounders = startup.founder_socials?.filter((f: any) => 
                  f.name && f.name !== 'null' && f.name.trim() !== ''
              ) || [];

              return (
                <div key={startup.id} className="p-5 border-2 border-gray-900 rounded-lg bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x hover:translate-y hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                  
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-1.5">
                      <h3 className="text-xl font-black tracking-tight">{startup.company_name}</h3>
                      
                      <div className="flex flex-col gap-1.5">
                       <AuthGuard>
                        <a href={startup.website} target="_blank" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1.5 w-fit">
                          {startup.website ? getHost(startup.website) : 'No Website'} <ExternalLink size={12} />
                        </a>
                       </AuthGuard>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 font-bold">
                          {startup.announced_date && (
                            <div className="flex items-center gap-1.5 text-gray-500">
                              <Calendar size={12} />
                              <span>{formatDate(startup.announced_date)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {startup.funding_amount && (
                        <span className="bg-[#00A86B] text-white px-2.5 py-1 text-xs font-black border-2 border-gray-900 rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1 shrink-0 transform rotate-1">
                          <DollarSign size={12} strokeWidth={3} /> {startup.funding_amount}
                        </span>
                      )}
                      
                      {startup.funding_round && (
                        <span className="bg-[#8B5CF6] text-white px-2.5 py-1 text-xs font-black border-2 border-gray-900 rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wide transform -rotate-1">
                           {startup.funding_round}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-lg text-gray-800 font-medium leading-relaxed">
                      {startup.name || "No description available."}
                      
                      {startup.source_url && (
                        <AuthGuard>
                        <a 
                          href={startup.source_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex align-baseline ml-2 text-gray-400 hover:text-blue-600 hover:scale-110 transition-all"
                          title="Read Source Article"
                        >
                          <ExternalLink size={16} strokeWidth={2.5} />
                        </a>
                        </AuthGuard>
                      )}
                    </div>
                  </div>

                  {validFounders.length > 0 && (
                    <div className="mt-4 pt-3 border-t-2 border-dashed border-gray-300">
                      <div className="flex items-center gap-2 text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">
                        <Users size={12} /> Founders
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {validFounders.map((founder: any, index: number) => (
                          <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-[#FFF5EB] border-2 border-gray-900 rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-bold">
                            <span className="text-gray-900">{founder.name}</span>
                            <div className="h-3 w-0.5 bg-gray-400 rounded-full mx-1"></div>
                            <div className="flex gap-2 items-center">
                              {founder.linkedin && founder.linkedin !== 'null' && (
                                <AuthGuard>
                                <a href={founder.linkedin} target="_blank" className="text-blue-700 hover:scale-125 transition-transform" title="LinkedIn">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="block"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                </a>
                                </AuthGuard>
                              )}
                              {founder.twitter && founder.twitter !== 'null' && (
                                <AuthGuard>
                                <a href={founder.twitter} target="_blank" className="text-black hover:scale-125 transition-transform" title="Twitter/X">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="block"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                </a>
                                </AuthGuard>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {hasMore && !initialLoading && (
                <div className="pt-4 flex justify-center">
                    <button 
                        onClick={handleLoadMore}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-900 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={16} />
                                Loading...
                            </>
                        ) : (
                            <>
                                <ArrowDownCircle size={16} />
                                Load More
                            </>
                        )}
                    </button>
                </div>
            )}
          </div>

          <div className="lg:col-span-3">
            <div className="p-5 border-2 border-gray-900 rounded-lg bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-gray-100">
                <Filter size={16} />
                <h3 className="font-black text-lg">Filters</h3>
              </div>

              <div className="space-y-4">               
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
                    Time Period
                  </label>
                  <div className="relative">
                    <select 
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full appearance-none bg-white border-2 border-gray-900 text-gray-900 text-sm font-bold py-2.5 px-3 pr-8 rounded focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-shadow cursor-pointer"
                    >
                      <option value="all">All Time</option>
                      <option value="1d">Last 24 Hours</option>
                      <option value="7d">Last 7 Days</option>
                      <option value="30d">Last 30 Days</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-900">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
                    Funding Round
                  </label>
                  <div className="relative">
                    <select 
                      value={roundFilter}
                      onChange={(e) => setRoundFilter(e.target.value)}
                      className="w-full appearance-none bg-white border-2 border-gray-900 text-gray-900 text-sm font-bold py-2.5 px-3 pr-8 rounded focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-shadow cursor-pointer"
                    >
                      <option value="all">All Rounds</option>
                      {availableRounds.map((round: string) => (
                        <option key={round} value={round}>{round}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-900">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer/>
    </div>
  );
}