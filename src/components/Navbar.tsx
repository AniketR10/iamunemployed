'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path ? "text-[#FF5A5F] underline decoration-2 underline-offset-4" : "hover:underline decoration-2 underline-offset-4";

  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b-2 border-gray-900 bg-[#F8F3E7] sticky top-0 z-50">
      <Link href="/" className="flex items-center space-x-1 text-xl font-black text-blue-600 tracking-tighter">
        <span>DEV</span>
        <span>TOOLS</span>
      </Link>
      
      <div className="hidden md:flex space-x-6 font-bold text-gray-800 text-sm">
        <Link href="/" className={isActive('/')}>Home</Link>
        <Link href="/startups" className={isActive('/startups')}>Startups DB</Link>
        <Link href="/yc" className={isActive('/yc')}>YC Directory</Link>
        <Link href="/reddit" className={isActive('/reddit')}>
           <span className="flex items-center gap-2">
             Reddit Live
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
             </span>
           </span>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <Bell className="text-gray-900 cursor-pointer hover:text-[#FF5A5F] transition-colors" size={20} strokeWidth={2.5} />
        <div className="w-8 h-8 rounded-full border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-gray-200 overflow-hidden">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
        </div>
      </div>
    </nav>
  );
}