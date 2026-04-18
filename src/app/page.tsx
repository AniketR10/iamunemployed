import Navbar from '../components/Navbar';
import { ArrowRight, Database, Zap, Globe, Laptop } from 'lucide-react';
import Link from 'next/link';
import Footer from '../components/Footer';
import FeatureCarousel from '../components/FeatureCarousel';
import Image from 'next/image';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        }
      }
    }
  )

  const {data: {user}} = await supabase.auth.getUser();
  const getStartedLink = user ? "/yc" : "/auth";
  const interviewLink = user ? "/interviews" : "/auth";

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
          Are you tired of Applying for Jobs and getting Ghosted? Access our latest Funded Startups, their Founders socials
          and say,
            <br />
           "Sir, please give me Job!" 
          <br />
         Learn from real Interview Experiences, Track YC Founders, find real-time Job posts from Reddit and discover remote-first companies.
        </p>

        <div className="mb-4 flex flex-col sm:flex-row justify-center gap-4">
  
        <Link
          href={getStartedLink}
          className="mx-2 w-full sm:w-auto group inline-flex items-center justify-center px-8 py-4 text-lg font-black text-white transition-all duration-200 bg-gray-900 border-2 border-gray-900 rounded-lg hover:bg-[#00A86B] hover:border-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.75 hover:translate-y-0.75"
        >
          <span className="flex items-center gap-2">
            Get Started
            <span className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1">
              ↗
            </span>
          </span>
        </Link>

        <Link
          href={interviewLink}
          className="w-full sm:w-auto group inline-flex items-center justify-center px-8 py-4 text-lg font-black text-white transition-all duration-200 bg-gray-500 border-2 border-gray-900 rounded-lg hover:bg-[#de891a] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.75 hover:translate-y-0.75"
        >
          <span className="flex items-center gap-2">
            Interviews
            <span className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1">
              ↗
            </span>
          </span>
        </Link>

      </div>

       <div className="w-full max-w-7xl mx-auto mt-2">
          <FeatureCarousel />
        </div>
      </main>
      <Footer/>
    </div>
  );
}