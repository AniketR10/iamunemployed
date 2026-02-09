"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { X, Lock} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthGuard({children}:{children: React.ReactNode}) {
    const {user, loading} = useAuth();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const router = useRouter();

    const handleInteraction = (e: React.MouseEvent) => {
        if(!user) {
            e.preventDefault();
            e.stopPropagation();
            dialogRef.current?.showModal();
        }
    };

    const closeModal = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        dialogRef.current?.close();
    };

    if (loading) {
        return <div className="contents opacity-50 pointer-events-none">{children}</div>;
    }

    return (
    <>
      <div onClickCapture={handleInteraction} className="contents cursor-pointer">
        {children}
      </div>

      <dialog
        ref={dialogRef}
        className="m-auto bg-transparent p-0 backdrop:bg-gray-900/80 backdrop:backdrop-blur-sm open:animate-in open:fade-in open:zoom-in-95 duration-200"
        onClick={(e) => {
            if (e.target === dialogRef.current) closeModal();
        }}
      >
          <div 
            className="bg-[#F8F3E7] border-4 border-gray-900 p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-md w-full text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
                onClick={closeModal} 
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
            <p className="mb-8 font-bold text-gray-600 text-md leading-relaxed">
              You need to sign in to view company details, apply for jobs, and access founder contacts.
            </p>
            
            <div className="space-y-3">
                    <button onClick={() => router.push('/auth')} className="w-full py-4 bg-gray-900 text-white font-black uppercase text-lg border-2 border-gray-900 shadow-[3px_3px_0px_0px_#FFC700] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                    Sign In / Sign Up
                    </button>
                <button 
                    onClick={closeModal}
                    className="w-full py-3 font-bold text-gray-500 hover:text-gray-900 text-sm uppercase tracking-widest"
                >
                    Maybe Later
                </button>
            </div>
          </div>
        </dialog>
    </>
  );
}