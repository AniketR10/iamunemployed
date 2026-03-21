import * as fs from 'fs/promises';
import * as path from 'path';
import Link from 'next/link';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import InterviewCard, { InterviewPost } from '@/src/components/InterviewCard';
import { ArrowLeft, FolderOpen } from 'lucide-react';

export default async function CompanyArchivePage({ params }: { params: Promise<{ company: string }> }) {
  const resolvedParams = await params;
  const targetCompany = decodeURIComponent(resolvedParams.company).toLowerCase();
  
  let archivedInterviews: InterviewPost[] = [];
  
  try {
    const archivesPath = path.join(process.cwd(), 'src', 'data', 'archive.json');
    const fileContents = await fs.readFile(archivesPath, 'utf8');
    archivedInterviews = JSON.parse(fileContents);
  } catch (err) {
    console.error("No archives found...");
  }

  const companyPosts = archivedInterviews.filter((post) => {
    const postCompany = post.company ? post.company.toLowerCase().trim() : 'miscellaneous';
    return postCompany === targetCompany;
  });

  return (
    <div className="min-h-screen bg-[#F8F3E7] font-sans text-gray-900 flex flex-col">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-16 w-full grow">
        
        <div className="mb-8">
          <Link 
            href="/archives" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all font-black uppercase text-sm"
          >
            <ArrowLeft size={16} strokeWidth={3} /> Back to Archives
          </Link>
        </div>

        <div className="bg-[#FFC700] border-[3px] border-gray-900 p-6 md:p-8 mb-10 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
            
            <div className="p-3 bg-white border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
              <FolderOpen size={32} strokeWidth={2.5} className="text-[#FF5A5F]" />
            </div>
            
            <div>
              <h1 className="text-xl md:text-3xl font-black text-gray-900 tracking-tighter uppercase mb-1">
                {targetCompany}
              </h1>
              <p className="font-bold uppercase text-gray-900 text-sm">
                {companyPosts.length} Interview Experience{companyPosts.length !== 1 ? 's' : ''}
              </p>
            </div>
            
          </div>
        </div>

        {companyPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {companyPosts.map((post, index) => (
              <InterviewCard key={`archive-${post.id || index}`} post={post} />
            ))}
          </div>
        ) : (
          <div className="p-10 bg-white border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
            <p className="text-xl font-black uppercase">Company folder is empty.</p>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}