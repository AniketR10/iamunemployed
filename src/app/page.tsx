import Navbar from '../components/Navbar';
import { ArrowRight, Database, Zap, Globe } from 'lucide-react';
import Link from 'next/link';
import Footer from '../components/Footer';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8F3E7] font-sans text-gray-900 flex flex-col">
      <Navbar />
      
      <main className="container mx-auto px-4 py-10 text-center grow">
        
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-gray-900">
           I AM{" "}
              <Image
                src="/icon.png"
                alt="emoji"
                width={48}
                height={48}
                className="inline-block align-middle mx-2 mb-2"
              />
              <br />
          <span className="text-[#FF5A5F]">UNEMPLOYED!
          </span>
        </h1>
        
        <p className="text-lg md:text-xl font-medium text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed">
          Are you tired of Applying for Jobs and getting Ghosted? Access our latest Funded Startups and their Founders socials
          and say,
            <br />
           "Sir, please give me Job!" 
          <br />
          Track YC Founders, and find real-time developer jobs posts from Reddit.
        </p>

        <div className="mb-24 relative inline-block">
          <Link href="/auth">
            <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-black text-white transition-all duration-200 bg-gray-900 border-2 border-gray-900 rounded-lg hover:bg-[#00A86B] hover:text-white hover:border-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.75 hover:translate-y-0.75">
              <span>Get Started</span>
              <ArrowRight className="ml-2 w-6 h-6 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>

          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-5 -rotate-2 z-10 pointer-events-none">
            <div className="bg-[#FFD700] border-2 border-gray-900 px-3 py-1.5 rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] relative">
               <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-3 bg-gray-900"></div>
               
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 block whitespace-nowrap">
                Proudly Open Source
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">

          <Link href="/startups" className="group p-8 border-2 border-gray-900 rounded-lg bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all">
            <div className="w-12 h-12 bg-blue-100 border-2 border-gray-900 rounded-md flex items-center justify-center mb-4 mx-auto group-hover:bg-blue-200 transition">
              <Database size={24} className="text-gray-900" />
            </div>
            <h3 className="text-xl font-black mb-2">Startup DB</h3>
            <p className="text-sm font-medium text-gray-600">Access data of thousands of latest funded startups and founders socials daily.</p>
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