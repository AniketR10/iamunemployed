import Navbar from '../components/Navbar';
import { ArrowRight, Database, Zap, Globe } from 'lucide-react';
import Link from 'next/link';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8F3E7] font-sans text-gray-900 flex flex-col">
      <Navbar />
      
      <main className="container mx-auto px-4 py-20 text-center grow">
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-gray-900">
          THE ULTIMATE <br/>
          <span className="text-[#FF5A5F]">DEV TOOLKIT</span>
        </h1>
        
        <p className="text-lg md:text-xl font-medium text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed">
          One platform to rule them all. Access our massive database of startups, 
          track YC companies, and find real-time developer jobs from Reddit.
        </p>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">

          <Link href="/startups" className="group p-8 border-2 border-gray-900 rounded-lg bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all">
            <div className="w-12 h-12 bg-blue-100 border-2 border-gray-900 rounded-md flex items-center justify-center mb-4 mx-auto group-hover:bg-blue-200 transition">
              <Database size={24} className="text-gray-900" />
            </div>
            <h3 className="text-xl font-black mb-2">Startup DB</h3>
            <p className="text-sm font-medium text-gray-600">Access enriched data on thousands of startups including funding and founders.</p>
          </Link>

          <Link href="/yc" className="group p-8 border-2 border-gray-900 rounded-lg bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all">
            <div className="w-12 h-12 bg-orange-100 border-2 border-gray-900 rounded-md flex items-center justify-center mb-4 mx-auto group-hover:bg-orange-200 transition">
              <Globe size={24} className="text-gray-900" />
            </div>
            <h3 className="text-xl font-black mb-2">YC Directory</h3>
            <p className="text-sm font-medium text-gray-600">Browse the complete YC catalog with direct social links to founders.</p>
          </Link>

          <Link href="/reddit" className="group p-8 border-2 border-gray-900 rounded-lg bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all">
            <div className="w-12 h-12 bg-red-100 border-2 border-gray-900 rounded-md flex items-center justify-center mb-4 mx-auto group-hover:bg-red-200 transition">
              <Zap size={24} className="text-gray-900" />
            </div>
            <h3 className="text-xl font-black mb-2">Reddit Live</h3>
            <p className="text-sm font-medium text-gray-600">Real-time feed of job postings from r/forhire, r/remotejobs and more.</p>
          </Link>
        </div>
      </main>
      <Footer/>
    </div>
  );
}