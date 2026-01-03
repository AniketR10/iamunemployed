'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/src/components/Navbar';
import { ExternalLink, DollarSign, Users } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';

export default function StartupsPage() {
  const [startups, setStartups] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('startups').select('*').limit(50).then(({ data }) => {
      if (data) setStartups(data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F3E7] font-sans text-gray-900 text-sm">
      <Navbar />
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <h1 className="text-3xl font-black mb-8 border-b-2 border-gray-900 pb-4">Startup Database</h1>
        
        <div className="space-y-4">
          {startups.map((startup) => {
            
            const validFounders = startup.founder_socials?.filter((f: any) => 
                f.name && 
                f.name !== 'null' && 
                f.name.trim() !== ''
            ) || [];

            return (
              <div key={startup.id} className="p-5 border-2 border-gray-900 rounded-lg bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x hover:translate-y hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-black">{startup.name}</h3>
                    <a href={startup.website} target="_blank" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                      {startup.website ? new URL(startup.website).hostname : 'No Website'} <ExternalLink size={10} />
                    </a>
                  </div>
                  {startup.funding_amount && (
                    <span className="bg-[#00A86B] text-white px-2 py-1 text-xs font-bold border-2 border-gray-900 rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
                      <DollarSign size={10} /> {startup.funding_amount}
                    </span>
                  )}
                </div>

                <p className="text-gray-600 font-medium mb-4 leading-relaxed">
                  {startup.one_liner || "No description available."}
                </p>

                {validFounders.length > 0 && (
                  <div className="mt-4 pt-3 border-t-2 border-dashed border-gray-200">
                    <div className="flex items-center gap-2 text-xs font-black text-gray-400 mb-2 uppercase tracking-wider">
                      <Users size={12} /> Founders
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      {validFounders.map((founder: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-[#FFF5EB] border-2 border-gray-900 rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-bold">
                          <span className="text-gray-900">{founder.name}</span>
                          
                          <div className="h-3 w-0.5 bg-gray-300 rounded-full mx-1"></div>

                          <div className="flex gap-2 items-center">
                            {founder.linkedin && founder.linkedin !== 'null' && (
                              <a href={founder.linkedin} target="_blank" className="text-blue-700 hover:scale-110 transition-transform" title="LinkedIn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="block">
                                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                </svg>
                              </a>
                            )}
                            {founder.twitter && founder.twitter !== 'null' && (
                              <a href={founder.twitter} target="_blank" className="text-black hover:scale-110 transition-transform" title="Twitter/X">
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