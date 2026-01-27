import { promises as fs } from 'fs';
import path from 'path';
import { Company } from '@/src/types/company';
import Navbar from '@/src/components/Navbar';
import CompanyFilter from '@/src/components/CompanyFilter';

async function getCompanies(): Promise<Company[]> {
  const filePath = path.join(process.cwd(), 'src/data/remote_companies.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(fileContents);
}

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

               <div className="w-full bg-[#FFC700] border-2 border-gray-900 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -mt-1 rotate-2 hover:rotate-0 transition-transform duration-300 origin-top relative">
                   <div className="absolute -top-2 left-7 w-3 h-3 bg-gray-300 rounded-full border-2 border-gray-900"></div>
                   <div className="absolute -top-2 right-7 w-3 h-3 bg-gray-300 rounded-full border-2 border-gray-900"></div>
                   <p className="text-sm font-bold text-gray-900 leading-tight text-center">
                     Discover 800+ remote friendly companies!
                   </p>
               </div>
            </div>
          </div>
        </div>

        <CompanyFilter initialCompanies={companies} />

      </div>
    </div>
  );
}