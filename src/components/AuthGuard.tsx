"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { X, Lock} from "lucide-react";
import Link from "next/link";

export default function AuthGuard({children}:{children: React.ReactNode}) {
    const [user, setUser] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            const {data} = await supabase.auth.getUser();
            setUser(data.user)
        };
        getUser();
    },[]);

    const handleInteraction = (e: React.MouseEvent) => {
        if(!user) {
            e.preventDefault();
            e.stopPropagation();
            setShowModal(true);
        }
    };

    return (
    <>
      <div onClickCapture={handleInteraction} className="contents">
        {children}
      </div>

      {showModal && (
        <div 
          className="fixed inset-0 z-9999 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={(e) => { e.stopPropagation(); setShowModal(false); }}
        >
          <div 
            className="bg-[#F8F3E7] border-4 border-gray-900 p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-md w-full text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
                onClick={() => setShowModal(false)} 
                className="absolute top-4 right-4 text-gray-900 hover:scale-110 transition-transform"
            >
                <X size={24} strokeWidth={3} />
            </button>

            <div className="w-16 h-16 bg-[#FF5A5F] border-2 border-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <Lock size={32} className="text-white" strokeWidth={3} />
            </div>
            
            <h2 className="text-3xl font-black mb-3 text-gray-900 leading-none">
              SignIn For Free!
            </h2>
            <p className="mb-8 font-bold text-gray-600 leading-relaxed">
              You need to sign in to view company details, apply for jobs, and access founder contacts.
            </p>
            
            <div className="space-y-3">
                <Link href="/auth">
                    <button className="w-full py-4 bg-gray-900 text-white font-black uppercase text-lg border-2 border-gray-900 shadow-[3px_3px_0px_0px_#FFC700] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                    Sign In / Sign Up
                    </button>
                </Link>
                <button 
                    onClick={() => setShowModal(false)}
                    className="w-full py-3 font-bold text-gray-500 hover:text-gray-900 text-sm uppercase tracking-widest"
                >
                    Maybe Later
                </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}