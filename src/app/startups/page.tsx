'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/src/components/Navbar';
import { ExternalLink, DollarSign, Users, Calendar } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';

export default function StartupsPage() {
  const [startups, setStartups] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('startups').select('*').order('announced_date', {ascending: false}).limit(50).then(({ data }) => {
      if (data) setStartups(data);
    });
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F3E7] font-sans text-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-black mb-8 border-b-4 border-gray-900 pb-4">Startup Database</h1>
        
        <div className="space-y-4">
          {startups.map((startup) => {
            
            const validFounders = startup.founder_socials?.filter((f: any) => 
                f.name && 
                f.name !== 'null' && 
                f.name.trim() !== ''
            ) || [];

            return (
              <div key={startup.id} className="p-4 border-2 border-gray-900 rounded-lg bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x hover:translate-y hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                
                <div className="flex justify-between items-start mb-2">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black tracking-tight">{startup.company_name}</h3>
                    
                    <div className="flex flex-col gap-1">
                      <a href={startup.website} target="_blank" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1.5 w-fit">
                        {startup.website ? new URL(startup.website).hostname : 'No Website'} <ExternalLink size={12} />
                      </a>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 font-bold">
                        {startup.announced_date && (
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <Calendar size={12} />
                            <span>{formatDate(startup.announced_date)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {startup.funding_amount && (
                    <span className="bg-[#00A86B] text-white px-2 py-1 text-xs font-black border-2 border-gray-900 rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1 shrink-0 transform rotate-1">
                      <DollarSign size={12} strokeWidth={3} /> {startup.funding_amount}
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-lg text-gray-800 font-medium leading-relaxed">
                    {startup.name || "No description available."}
                    
                    {startup.source_url && (
                      <a 
                        href={startup.source_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex align-baseline ml-2 text-gray-400 hover:text-blue-600 hover:scale-110 transition-all"
                        title="Read Source Article"
                      >
                        <ExternalLink size={16} strokeWidth={2.5} />
                      </a>
                    )}
                  </p>
                </div>

                {validFounders.length > 0 && (
                  <div className="mt-3 pt-3 border-t-2 border-dashed border-gray-300">
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
                              <a href={founder.linkedin} target="_blank" className="text-blue-700 hover:scale-125 transition-transform" title="LinkedIn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="block">
                                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                </svg>
                              </a>
                            )}
                            {founder.twitter && founder.twitter !== 'null' && (
                              <a href={founder.twitter} target="_blank" className="text-black hover:scale-125 transition-transform" title="Twitter/X">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="block">
                                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                              </a>
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
        </div>
      </div>
    </div>
  );
}