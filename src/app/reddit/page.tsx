'use client';
import { useEffect, useState, useRef } from 'react';
import Navbar from '@/src/components/Navbar';
import { Zap, Clock, Calendar, Layers, Loader2, ArrowDownCircle } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';
import Footer from '@/src/components/Footer';
import SubredditFilter from '@/src/components/SubredditFilter'; 
import AuthGuard from '@/src/components/AuthGuard';

export default function RedditPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedSubreddit, setSelectedSubreddit] = useState<string>('All');
  const [timeFilter, setTimeFilter] = useState<string>('all'); 
  
  const visibleCountRef = useRef(20);

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return '';
    const safeDateString = dateString.endsWith('Z') ? dateString : `${dateString}Z`;
    
    const date = new Date(safeDateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 0) return 'Just now';

    const interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval + "y ago";

    const months = Math.floor(seconds / 2592000);
    if (months >= 1) return months + "mo ago";

    const days = Math.floor(seconds / 86400);
    if (days >= 1) return days + "d ago";

    const hours = Math.floor(seconds / 3600);
    if (hours >= 1) return hours + "h ago";

    const minutes = Math.floor(seconds / 60);
    if (minutes >= 1) return minutes + "m ago";

    return "Just now";
  };

  const fetchPosts = async (isLoadMore = false) => {
    if (!isLoadMore) setIsLoading(true);
    
    let query = supabase
      .from('redditjobs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(visibleCountRef.current);

    if (selectedSubreddit !== 'All') {
      query = query.eq('subreddit', selectedSubreddit);
    }

    if (timeFilter !== 'all') {
       const now = new Date();
       let timeLimit;
       if (timeFilter === '24h') timeLimit = new Date(now.getTime() - (24 * 60 * 60 * 1000));
       if (timeFilter === '7d') timeLimit = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
       
       if (timeLimit) {
           query = query.gte('timestamp', timeLimit.toISOString());
       }
    }

    const { data } = await query;
    
    if (data) {
        setPosts(data);
    }
    
    setIsLoading(false);
    setIsLoadingMore(false);
  };

  useEffect(() => {
    visibleCountRef.current = 20; 
    fetchPosts();
  }, [selectedSubreddit, timeFilter]);

  useEffect(() => {
    const interval = setInterval(() => {
        fetchPosts(true);
    }, 60000);
    return () => clearInterval(interval);
  }, [selectedSubreddit, timeFilter]);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    visibleCountRef.current += 20;
    await fetchPosts(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F3E7] font-sans text-gray-900 text-sm flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-10 max-w-5xl grow">        
        <div className="flex justify-between items-center border-b-2 border-gray-900 pb-4 mb-8">
            <h1 className="text-3xl font-black">Reddit Job Posts</h1>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 border-2 border-gray-900 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs font-bold text-green-800">LIVE</span>
            </div>
        </div>

        <div className="flex flex-col-reverse md:grid md:grid-cols-4 gap-8 md:items-start">
          
          <div className="w-full md:col-span-3 space-y-4">
            {isLoading ? (
               <div className="p-12 flex justify-center text-gray-500">
                  <Loader2 className="animate-spin" size={32} />
               </div>
            ) : posts.length === 0 ? (
                <div className="p-8 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    No posts match your filters.
                </div>
            ) : (
                <>
                    {posts.map((post) => (
                        <div key={post.id} className="p-4 border-2 border-gray-900 rounded-lg bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="flex justify-between items-start gap-4">
                            <div>
                            <span className="text-xs font-black text-[#FF5A5F] uppercase mb-1 block tracking-wider">
                                r/{post.subreddit}
                            </span>
                            <h3 className="text-base font-bold leading-tight mb-2 transition">
                                <p>{post.title}</p>
                            </h3>
                            </div>

                            <div className="min-w-fit flex items-center text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 border-2 border-gray-900 rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                              <Clock size={12} className="mr-1" />
                              {formatTimeAgo(post.timestamp)}
                            </div>
                        </div>
                        
                        <div className="mt-3 flex justify-end">
                            <AuthGuard>
                            <a href={post.url} target="_blank" rel="noopener noreferrer" className="bg-gray-900 text-white px-4 py-2 text-xs font-bold rounded border-2 border-gray-900 hover:bg-gray-700 transition flex items-center gap-2">
                            See on Reddit <svg 
                                            viewBox="0 0 24 24" 
                                            fill="currentColor" 
                                            className="w-5 h-5 text-[#FF4500]"
                                        >
                                            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                                        </svg>
                            </a>
                            </AuthGuard>
                        </div>
                        </div>
                    ))}

                    <div className="pt-4 flex justify-center">
                        <button 
                            onClick={handleLoadMore}
                            disabled={isLoadingMore}
                            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-900 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoadingMore ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} />
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <ArrowDownCircle size={16} />
                                    Load 20 More
                                </>
                            )}
                        </button>
                    </div>
                </>
            )}
          </div>

          <div className="w-full md:col-span-1">
             <div className="md:sticky md:top-4 space-y-6">
                
                <div className="bg-white border-2 border-gray-900 rounded-lg p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center gap-2 mb-3 border-b-2 border-gray-100 pb-2">
                        <Calendar size={16} />
                        <h3 className="font-black text-sm uppercase">Time Range</h3>
                    </div>
                    <div className="space-y-2">
                        {[
                            { label: 'All Time', value: 'all' },
                            { label: 'Past 24 Hours', value: '24h' },
                            { label: 'Past 7 Days', value: '7d' }
                        ].map((opt) => (
                            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-full border-2 border-gray-900 flex items-center justify-center ${timeFilter === opt.value ? 'bg-gray-900' : 'bg-white'}`}>
                                    {timeFilter === opt.value && <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full" />}
                                </div>
                                <input 
                                    type="radio" 
                                    name="timeFilter" 
                                    className="hidden" 
                                    checked={timeFilter === opt.value}
                                    onChange={() => setTimeFilter(opt.value)}
                                />
                                <span className={`text-xm font-bold ${timeFilter === opt.value ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-900'}`}>
                                    {opt.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="bg-white border-2 border-gray-900 rounded-lg p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center gap-2 mb-3 border-b-2 border-gray-100 pb-2">
                        <Layers size={16} />
                        <h3 className="font-black text-sm uppercase">Communities</h3>
                    </div>
                    
                    <div className="w-full">
                        <SubredditFilter 
                            onSelectAction={(val) => {
                                setSelectedSubreddit(val === "" ? "All" : val);
                            }} 
                        />
                    </div>
                </div>

             </div>
          </div>

        </div>
      </div>
      <Footer/>
    </div>
  );
}