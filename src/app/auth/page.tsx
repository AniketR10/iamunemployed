'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import { supabase } from '@/src/lib/supabase';
import { Mail, Lock, Loader2, ArrowRight, User } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    const handlePageShow = (() => {
        setLoading(false)
    });
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    }
  },[])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              full_name: `${formData.firstName} ${formData.lastName}`.trim(),
            }
          }
        });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        // Sign In
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        router.push('/'); 
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'github') => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F3E7] font-sans text-gray-900 flex flex-col">
      <Navbar />

      <div className="grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black mb-2 tracking-tight">
              {isSignUp ? 'Join the' : 'Welcome'} <span className="text-[#FF5A5F]">{isSignUp ? 'Club' : 'Back'}</span>
            </h1>
            <p className="text-lg font-medium text-gray-600">
              {isSignUp ? 'Create an account to get started.' : 'Sign in to get back to begging!'}
            </p>
          </div>

          <div className="p-8 border-2 border-gray-900 rounded-lg bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            
            {error && (
              <div className="mb-6 p-3 bg-red-100 border-2 border-red-500 rounded text-red-600 text-xs font-bold">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 mb-6">
              <button
                onClick={() => handleSocialAuth('google')}
                className="flex items-center justify-center gap-2 py-2.5 border-2 border-gray-900 rounded-lg font-bold text-sm hover:bg-gray-50 transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
              
              {/* <button
                onClick={() => handleSocialAuth('github')}
                className="flex items-center justify-center gap-2 py-2.5 border-2 border-gray-900 rounded-lg font-bold text-sm hover:bg-gray-50 transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-900">
                   <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button> */}
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t-2 border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500 font-bold">Or continue with</span>
              </div>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-5">
              
              {isSignUp && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-900 uppercase tracking-wider mb-2">First Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <User size={16} />
                      </div>
                      <input 
                        type="text" 
                        name="firstName" 
                        required 
                        value={formData.firstName} 
                        onChange={handleChange} 
                        placeholder="John" 
                        className="w-full pl-9 pr-4 py-3 bg-gray-50 border-2 border-gray-900 rounded-lg text-sm font-bold placeholder-gray-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:bg-white transition-all" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-900 uppercase tracking-wider mb-2">Last Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <User size={16} />
                      </div>
                      <input 
                        type="text" 
                        name="lastName" 
                        required 
                        value={formData.lastName} 
                        onChange={handleChange} 
                        placeholder="Doe" 
                        className="w-full pl-9 pr-4 py-3 bg-gray-50 border-2 border-gray-900 rounded-lg text-sm font-bold placeholder-gray-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:bg-white transition-all" 
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-black text-gray-900 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail size={16} />
                  </div>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-900 rounded-lg text-sm font-bold placeholder-gray-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:bg-white transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-900 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock size={16} />
                  </div>
                  <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-900 rounded-lg text-sm font-bold placeholder-gray-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:bg-white transition-all" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-[#00A86B] text-white border-2 border-gray-900 py-3.5 rounded-lg font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loading ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : <>{isSignUp ? 'Sign Up' : 'Sign In'} <ArrowRight size={18} /></>}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button onClick={() => { setIsSignUp(!isSignUp); setError(null); }} className="text-xs font-bold text-gray-500 hover:text-gray-900 underline underline-offset-4">
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}