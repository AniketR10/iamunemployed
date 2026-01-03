'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Navbar from '@/src/components/Navbar';
import { Zap, Clock } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';

export default function RedditPage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('reddit_posts').select('*').order('created_at', { ascending: false }).limit(20)
      .then(({ data }) => { if (data) setPosts(data); });

    const channel = supabase.channel('reddit-updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reddit_posts' }, (payload) => {
          setPosts((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F3E7] font-sans text-gray-900 text-sm">
      <Navbar />
      <div className="container mx-auto px-4 py-10 max-w-3xl">
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

        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="p-4 border-2 border-gray-900 rounded-lg bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex justify-between items-start gap-4">
                <div>
                   <span className="text-xs font-black text-[#FF5A5F] uppercase mb-1 block tracking-wider">
                     r/{post.subreddit}
                   </span>
                   <h3 className="text-base font-bold leading-tight mb-2 hover:text-blue-600 transition">
                     <a href={post.url} target="_blank">{post.title}</a>
                   </h3>
                </div>
                <div className="min-w-fit flex items-center text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 border-2 border-gray-900 rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                   <Clock size={12} className="mr-1" />
                   {new Date(post.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
              
              <div className="mt-3 flex justify-end">
                <a href={post.url} target="_blank" className="bg-gray-900 text-white px-4 py-2 text-xs font-bold rounded border-2 border-gray-900 hover:bg-gray-700 transition flex items-center gap-2">
                   Apply on Reddit <Zap size={12} className="text-yellow-400" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}