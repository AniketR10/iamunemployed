import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Company } from '@/src/types/company';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Navbar from '@/src/components/Navbar';

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

async function getCompany(slug: string): Promise<Company | undefined> {
  const filePath = path.join(process.cwd(), 'src/data/remote_companies.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const companies: Company[] = JSON.parse(fileContents);
  return companies.find((c) => c.slug === slug);
}

export default async function CompanyDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const company = await getCompany(slug);

  if (!company) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F8F3E7] font-sans text-gray-900 text-sm flex flex-col">
        <Navbar/>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-12">
        
        <Link href="/companies" className="inline-block mb-6 group">
            <button className="text-xs font-black text-gray-900 bg-white border-2 border-gray-900 px-3 py-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none transition-all flex items-center gap-2">
                ← BACK
            </button>
        </Link>

        <div className="bg-white border-2 border-gray-900 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFC700] border-l-2 border-b-2 border-gray-900 rounded-bl-full opacity-50 -mr-2 -mt-2"></div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-3 uppercase leading-none">
                {company.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-2">
                 <span className={`px-2.5 py-1 text-xs font-black border-2 border-gray-900 uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                    ${company.remote_policy === 'Remote-first' ? 'bg-[#00A86B] text-white' : 
                      company.remote_policy === 'Remote-friendly' ? 'bg-[#FF5A5F] text-white' : 
                      'bg-gray-200 text-gray-900'}`}>
                    {company.remote_policy.replace('-', ' ')}
                 </span>

                 {/* <span className="px-2.5 py-1 text-xs font-bold bg-white border-2 border-gray-900 text-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                   👥 {company.company_size}
                 </span> */}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
               {company.website && (
                 <a href={company.website} target="_blank" rel="noopener noreferrer" 
                    className="flex-1 md:flex-none px-5 py-2.5 bg-white border-2 border-gray-900 text-gray-900 text-sm font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all text-center">
                   Website
                 </a>
               )}
               {company.careers_url && (
                 <a href={company.careers_url} target="_blank" rel="noopener noreferrer"
                    className="flex-1 md:flex-none px-5 py-2.5 bg-[#FF5A5F] border-2 border-gray-900 text-white text-sm font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all text-center">
                   Apply Now 🚀
                 </a>
               )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-2 space-y-6">
            
            {company.company_blurb && (
              <section className="bg-white border-2 border-gray-900 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-xl font-black text-gray-900 mb-4 uppercase border-b-4 border-[#FF5A5F] inline-block">
                  About {company.title}
                </h2>
                <div className="prose prose-sm md:prose-base text-gray-800 font-medium max-w-none 
                                prose-headings:font-black prose-headings:text-gray-900 prose-headings:uppercase
                                prose-p:leading-relaxed prose-a:text-[#FF5A5F] prose-a:font-bold hover:prose-a:underline">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {company.company_blurb}
                  </ReactMarkdown>
                </div>
              </section>
            )}

            {company.remote_status && (
              <section className="bg-white border-2 border-gray-900 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-xl font-black text-gray-900 mb-4 uppercase border-b-4 border-[#00A86B] inline-block">
                  Remote Culture
                </h2>
                <div className="prose prose-sm md:prose-base text-gray-800 font-medium max-w-none 
                                prose-headings:font-black prose-a:text-[#00A86B] prose-a:font-bold hover:prose-a:underline">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {company.remote_status}
                  </ReactMarkdown>
                </div>
              </section>
            )}
            
            {company.how_to_apply && (
            <section className="bg-[#FFC700] border-2 border-gray-900 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
                <div className="absolute top-3 right-3 text-3xl opacity-120">📝</div>
                <h2 className="text-xl font-black text-gray-900 mb-3 uppercase">
                How to Apply
                </h2>
                <div className="text-gray-900 font-bold text-sm md:text-base whitespace-pre-wrap">
                <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                    a: ({node, ...props}) => (
                        <a 
                        {...props} 
                        className="text-blue-700 underline decoration-2 hover:bg-white hover:text-black hover:px-1 transition-all"
                        target="_blank" 
                        rel="noopener noreferrer"
                        />
                    ),
                    p: ({node, ...props}) => <p {...props} className="mb-4 last:mb-0" />
                    }}
                >
                    {company.how_to_apply}
                </ReactMarkdown>
                </div>
            </section>

            )}
          </div>

          <div className="space-y-6">
            
            <div className="bg-white border-2 border-gray-900 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-base font-black uppercase tracking-wider text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-black"></span> Tech Stack
              </h3>
              
              {company.technologies && company.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {company.technologies.map(tech => {
                    const colors = getTagColor(tech);
                    return (
                      <span 
                        key={tech} 
                        style={{ backgroundColor: colors.bg, color: colors.text }}
                        className="text-[10px] sm:text-xs font-black border-2 border-gray-900 px-2 py-1 uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-none transition-all cursor-default"
                      >
                        {tech}
                      </span>
                    );
                  })}
                </div>
              )}

              {company.company_technologies && (
                 <div className="prose prose-sm font-bold text-gray-800 border-t-2 border-gray-100 pt-3
                                 prose-ul:list-disc prose-ul:pl-4 prose-li:mb-1 prose-li:marker:text-gray-900
                                 prose-p:mb-2 prose-headings:font-black prose-headings:text-xs prose-headings:uppercase">
                   <ReactMarkdown remarkPlugins={[remarkGfm]}>
                     {company.company_technologies}
                   </ReactMarkdown>
                 </div>
              )}

              {(!company.technologies || company.technologies.length === 0) && !company.company_technologies && (
                <p className="text-xs font-bold text-gray-500 italic">No tech stack listed.</p>
              )}
            </div>

            <div className="bg-white border-2 border-gray-900 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-1">Hiring Region</h3>
                <p className="text-base font-bold text-gray-900 border-l-4 border-[#2D7FF9] pl-3">
                  {company.region || "Worldwide"}
                </p>
              </div>

              {company.office_locations && (
                 <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-1">Office Locations</h3>
                  <p className="text-xs font-bold text-gray-900 leading-relaxed">
                    {company.office_locations}
                  </p>
                </div>
              )}
            </div>

            {company.careers_url && (
                <a href={company.careers_url} target="_blank" rel="noopener noreferrer"
                    className="block md:hidden w-full py-3 bg-[#FF5A5F] border-2 border-gray-900 text-white font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center text-sm active:shadow-none active:translate-y-1">
                    Apply Now
                </a>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}