'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Navbar from '@/src/components/Navbar';
import { MapPin } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';

export default function YCPage() {
  const [ycList, setYcList] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('ycstartups').select('*').limit(50).then(({ data }) => {
      if (data) setYcList(data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F3E7] font-sans text-gray-900 text-sm">
      <Navbar />
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <h1 className="text-3xl font-black mb-8 border-b-2 border-gray-900 pb-4 text-[#FF5A5F]">YC Directory</h1>

        <div className="grid md:grid-cols-2 gap-4">
          {ycList.map((item) => (
            <div key={item.id} className="p-5 border-2 border-gray-900 rounded-lg bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-black">{item.name}</h3>
                <span className="bg-orange-400 text-white px-2 py-0.5 text-xs font-bold border-2 border-gray-900 rounded">
                  {item.batch}
                </span>
              </div>
              
              <div className="flex items-center text-xs font-bold text-gray-500 mb-3">
                 <MapPin size={12} className="mr-1" /> {item.all_locations || 'Remote'}
              </div>

              <p className="text-gray-600 font-medium text-xs mb-4 line-clamp-2">{item.one_liner}</p>

              <div className="flex flex-wrap gap-2">
                {Array.isArray(item.founder_socials) && item.founder_socials.map((link: string, i: number) => (
                  <a key={i} href={link} target="_blank" className="px-2 py-1 bg-blue-100 border-2 border-gray-900 text-[10px] font-bold hover:bg-blue-200 transition rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    {link.includes('linkedin') ? 'LinkedIn' : 'Social'}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}