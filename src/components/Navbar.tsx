'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, LogOut, User, Menu, X, Database, Zap, Globe, Github } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';
import { useEffect, useState, useRef } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      router.refresh();
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.refresh();
  };

  const isActive = (path: string) =>
    pathname === path
      ? "text-[#FF5A5F] underline decoration-2 underline-offset-4"
      : "hover:text-[#FF5A5F] transition-colors";

  const avatarUrl = user?.user_metadata?.avatar_url || 
                    user?.user_metadata?.picture || 
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`;

  const StarButton = () => (
    <a 
    href="https://github.com/AniketR10/iamunemployed" 
    target="_blank"
    rel='noopener noreferrer'
    className="w-full md:w-auto flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-2 rounded font-bold text-xs tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:cursor-pointer transition-all"
    >
        <Github size={16} />
        Star Project
    </a>
  );

  return (
    <nav className="bg-[#F8F3E7] border-b-2 border-gray-900 sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          
          <Link href="/" className="flex items-center space-x-1 text-xl font-black tracking-tighter group">
            <span className='text-gray-900'>IAM<span className='text-[#FF5A5F]'>UNEMPLOYED</span></span>
          </Link>
          
          <div className="hidden md:flex space-x-6 font-bold text-gray-800 text-sm items-center">
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
            <Link href="/companies" className={isActive('/companies')}>Remote</Link>  
            <Link href="/contact" className={isActive('/contact')}>Contact Us</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <StarButton />

            {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-9 h-9 rounded-full border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-gray-200 overflow-hidden focus:outline-none hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                  >
                     <img 
                       src={avatarUrl} 
                       alt="Profile" 
                       className="w-full h-full object-cover"
                       referrerPolicy="no-referrer"
                     />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg py-1 z-50">
                      <div className="px-4 py-2 border-b-2 border-gray-100">
                        <p className="text-xs text-gray-500 font-bold uppercase">Signed in as</p>
                        <p className="text-sm font-black truncate text-gray-900">
                          {user.user_metadata?.full_name || user.email?.split('@')[0]}
                        </p>
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
            ) : (
                <Link href="/auth" className="text-sm font-bold hover:underline">
                    Login
                </Link>
            )}
          </div>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-900 bg-[#00A86B] border-2 border-gray-900 rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-px active:translate-y-px transition-all focus:outline-none hover:cursor-pointer"          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t-2 border-gray-900 bg-white">
          <div className="flex flex-col p-4 space-y-4">
            
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={`font-bold ${isActive('/')}`}>Home</Link>
            <Link href="/startups" onClick={() => setIsMobileMenuOpen(false)} className={`font-bold ${isActive('/startups')}`}>Startups DB</Link>
            <Link href="/yc" onClick={() => setIsMobileMenuOpen(false)} className={`font-bold ${isActive('/yc')}`}>YC Directory</Link>
            <Link href="/reddit" onClick={() => setIsMobileMenuOpen(false)} className={`font-bold ${isActive('/reddit')} flex items-center gap-2`}>
                Reddit Live <Zap size={14} className="text-red-500 fill-current" />
            </Link>
            <Link href="/companies" className={`font-bold ${isActive('/companies')}`}>Remote</Link>  
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className={`font-bold ${isActive('/contact')}`}>Contact Us</Link>

            <hr className="border-gray-200" />
            
            <div className="flex flex-col gap-3">
                <StarButton />

                {user ? (
                    <div className="bg-gray-50 p-3 rounded border border-gray-200">
                        <div className="flex items-center gap-3 mb-3">
                            <img src={avatarUrl} alt="Profile" className="w-8 h-8 rounded-full border border-gray-900" />
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-500 uppercase">Signed in as</span>
                                <span className="text-sm font-black text-gray-900">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                            </div>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded font-bold text-sm border border-red-200"
                        >
                            <LogOut size={16} /> Sign Out
                        </button>
                    </div>
                ) : (
                    <Link 
                    href="/auth" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full bg-white text-gray-900 border-2 border-gray-900 px-5 py-2 rounded font-bold text-xs tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-px active:translate-y-px"
                    >
                      LOGIN / JOIN CLUB
                    </Link>
                )}
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}