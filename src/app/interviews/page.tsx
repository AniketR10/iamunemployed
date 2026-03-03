'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import InterviewCard, { InterviewPost } from '@/src/components/InterviewCard';
import { Filter, Loader2 } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';
import ArchiveBook from '@/src/components/ArchiveBook';

export default function LatestInterviewsPage() {
  const [interviews, setInterviews] = useState<InterviewPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [companyFilter, setCompanyFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    const fetchInterviews = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('latest_interviews')
        .select('*')
        .order('post_date', { ascending: false });

      if (error) {
        console.error('Error fetching live interviews:', error.message);
      } else if (data) {
        setInterviews(data);
      }
      setIsLoading(false);
    };

    fetchInterviews();
  }, []);

  const uniqueCompanies = useMemo(() => {
    const companies = interviews.map(i => i.company?.toLowerCase().trim()).filter(Boolean);
    return Array.from(new Set(companies)).sort();
  }, [interviews]);

  const uniqueRoles = useMemo(() => {
    const roles = interviews.map(i => i.role?.toUpperCase().trim()).filter(Boolean);
    return Array.from(new Set(roles)).sort();
  }, [interviews]);

  const filteredInterviews = useMemo(() => {
    return interviews.filter(interview => {
      const matchCompany = companyFilter === 'all' || interview.company?.toLowerCase().trim() === companyFilter;
      const matchRole = roleFilter === 'all' || interview.role?.toUpperCase().trim() === roleFilter;
      return matchCompany && matchRole;
    });
  }, [interviews, companyFilter, roleFilter]);

  return (
    <div className="min-h-screen bg-[#F8F3E7] font-sans text-gray-900 text-sm flex flex-col">
            <Navbar/>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-16 relative w-full">
            
            <ArchiveBook />
            
            <div className="text-center mb-40 relative">
              <div className="inline-block relative">
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none relative z-20">
                  LATEST
                  <span className="block text-[#FF5A5F] drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                    INTERVIEWS
                  </span>
                </h1>
    
                <div className="absolute -bottom-28 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center w-50">
                   
                   <div className="w-full flex justify-between items-end px-8 z-0">
                       <div className="w-1.5 h-16 bg-gray-900 border-x border-gray-900"></div>
                       <div className="w-1.5 h-16 bg-gray-900 border-x border-gray-900"></div>
                   </div>
    
                   <div className="w-full bg-[#FFC700] border-2 border-gray-900 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -mt-1 rotate-2 hover:rotate-0 transition-transform duration-300 origin-top relative">
                       <div className="absolute -top-2 left-7 w-3 h-3 bg-gray-300 rounded-full border-2 border-gray-900"></div>
                       <div className="absolute -top-2 right-7 w-3 h-3 bg-gray-300 rounded-full border-2 border-gray-900"></div>
                       <p className="text-sm font-bold text-gray-900 leading-tight text-center">
                         Get latest interview experiences of your favourite companies!
                       </p>
                   </div>
                </div>
              </div>
            </div>

        <div className="flex flex-col-reverse lg:grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-8 space-y-5">
            {isLoading ? (
               <div className="p-12 flex justify-center text-gray-500">
                  <Loader2 className="animate-spin" size={32} />
               </div>
            ) : filteredInterviews.length > 0 ? (
              filteredInterviews.map((post) => (
                <InterviewCard key={`live-${post.id}`} post={post} />
              ))
            ) : (
              <div className="p-8 bg-white border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
                <p className="text-lg font-black uppercase">No interviews match your filters.</p>
                <p className="font-medium text-sm mt-1">Try adjusting the company or role. 🤖</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 lg:sticky top-20">
            <div className="p-5 border-2 border-gray-900 rounded-lg bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              
              <div className="flex items-center gap-2 mb-5 pb-3 border-b-2 border-gray-900">
                <Filter size={20} strokeWidth={2.5} />
                <h3 className="font-black text-xl uppercase tracking-tight">Filters</h3>
              </div>

              <div className="space-y-5">
                
                <div>
                  <label className="block text-xs font-black text-gray-900 uppercase tracking-wider mb-2">
                    Company
                  </label>
                  <div className="relative">
                    <select
                      value={companyFilter}
                      onChange={(e) => setCompanyFilter(e.target.value)}
                      className="w-full appearance-none bg-[#F8F3E7] border-2 border-gray-900 text-gray-900 text-sm font-bold py-2.5 px-3 pr-8 rounded focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-shadow cursor-pointer capitalize"
                    >
                      <option value="all">All Companies</option>
                      {uniqueCompanies.map((company) => (
                        <option key={company} value={company} className="capitalize">{company}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-900">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-900 uppercase tracking-wider mb-2">
                    Role
                  </label>
                  <div className="relative">
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="w-full appearance-none bg-[#F8F3E7] border-2 border-gray-900 text-gray-900 text-sm font-bold py-2.5 px-3 pr-8 rounded focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-shadow cursor-pointer uppercase"
                    >
                      <option value="all">All Roles</option>
                      {uniqueRoles.map((role) => (
                        <option key={role} value={role} className="uppercase">{role}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-900">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}