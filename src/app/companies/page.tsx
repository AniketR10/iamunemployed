import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import { Company } from '@/src/types/company';
import Navbar from '@/src/components/Navbar';

async function getCompanies(): Promise<Company[]> {
  const filePath = path.join(process.cwd(), 'src/data/remote_companies.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(fileContents);
}

const tagColors = [
  { bg: '#FF5A5F', text: 'white' },
  { bg: '#00A86B', text: 'white' }, 
  { bg: '#FFC700', text: 'black' }, 
  { bg: '#2D7FF9', text: 'white' }, 
  { bg: '#9D4EDD', text: 'white' }, 
];

const getTagColor = (tech: string) => {
  const index = tech.length % tagColors.length;
  return tagColors[index];
};

export default async function CompaniesPage() {
  const companies = await getCompanies();

  return (
    <div className="min-h-screen bg-[#F8F3E7] font-sans text-gray-900 text-sm flex flex-col">
        <Navbar/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        <div className="text-center mb-42 relative">
          <div className="inline-block relative">
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none relative z-20">
              REMOTE
              <span className="block text-[#FF5A5F] drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                COMPANIES
              </span>
            </h1>

            <div className="absolute -bottom-26 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center w-50">
               
               <div className="w-full flex justify-between items-end px-8 z-0">
                   <div className="w-1.5 h-14 bg-gray-900 border-x border-gray-900"></div>
                   <div className="w-1.5 h-16 bg-gray-900 border-x border-gray-900"></div>
               </div>

               <div className="w-full bg-[#FFC700] border-2 border-gray-900 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -mt-1 rotate-2 hover:rotate-0 transition-transform duration-300 origin-top cursor-help relative">
                   
                   <div className="absolute -top-2 left-7 w-3 h-3 bg-gray-300 rounded-full border-2 border-gray-900"></div>
                   <div className="absolute -top-2 right-7 w-3 h-3 bg-gray-300 rounded-full border-2 border-gray-900"></div>

                   <p className="text-sm font-bold text-gray-900 leading-tight text-center">
                     Discover 800+ remote friendly companies!
                   </p>
               </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
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
                      const colors = getTagColor(tech);
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
          ))}
        </div>
      </div>
    </div>
  );
}