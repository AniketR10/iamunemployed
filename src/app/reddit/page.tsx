'use client';
import { useEffect, useState, useRef } from 'react';
import Navbar from '@/src/components/Navbar';
import { Zap, Clock, Calendar, Layers, Loader2, ArrowDownCircle } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';
import Footer from '@/src/components/Footer';
import SubredditFilter from '@/src/components/SubredditFilter'; 

export default function RedditPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedSubreddit, setSelectedSubreddit] = useState<string>('All');
  const [timeFilter, setTimeFilter] = useState<string>('all'); 
  
  const visibleCountRef = useRef(20);

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
            <h1 className="text-3xl font-black">Reddit Live Feed</h1>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 border-2 border-gray-900 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs font-bold text-green-800">LIVE</span>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-3 space-y-4">
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
                            <h3 className="text-base font-bold leading-tight mb-2 hover:text-blue-600 transition">
                                <a href={post.url} target="_blank" rel="noopener noreferrer">{post.title}</a>
                            </h3>
                            </div>

                            <div className="min-w-fit flex items-center text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 border-2 border-gray-900 rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                            <Clock size={12} className="mr-1" />
                            {new Date(post.timestamp).toLocaleString([], {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute:'2-digit'
                            })}
                            </div>
                        </div>
                        
                        <div className="mt-3 flex justify-end">
                            <a href={post.url} target="_blank" rel="noopener noreferrer" className="bg-gray-900 text-white px-4 py-2 text-xs font-bold rounded border-2 border-gray-900 hover:bg-gray-700 transition flex items-center gap-2">
                            Apply on Reddit <Zap size={12} className="text-yellow-400" />
                            </a>
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

          <div className="md:col-span-1">
             <div className="sticky top-4 space-y-6">
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