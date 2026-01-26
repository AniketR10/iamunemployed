import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import { Company } from '@/src/types/company';

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
    <div className="min-h-screen bg-[#F8F3E7] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-gray-900 sm:text-6xl tracking-tight">
            REMOTE-FIRST
            <span className="block text-[#FF5A5F] drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">COMPANIES</span>
          </h1>
          <p className="mt-8 text-xl font-bold text-gray-900 max-w-2xl mx-auto border-2 border-gray-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-1">
            Discover {companies.length}+ companies hiring remotely right now.
            <br />
            <span className="text-sm font-black text-[#FF5A5F] uppercase mt-2 block">"Sir, please give me Job!"</span>
          </p>
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