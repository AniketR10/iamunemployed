'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Database, Zap, Globe, Laptop, ChevronLeft, ChevronRight, UserCheck2 } from 'lucide-react';
import AuthGuard from './AuthGuard';

const features = [
  {
    id: 'startups',
    title: 'Startup DB',
    desc: 'Access data of thousands of latest funded startups.',
    icon: Database,
    color: 'bg-blue-100',
    hoverColor: 'group-hover:bg-blue-200',
    link: '/startups',
    image: '/startups.png',
  },
  {
    id: 'interview',
    title: 'Latest Interview Experiences',
    desc: 'Get latest interview experiences of your favourite companies!',
    icon: UserCheck2,
    color: 'bg-[#F97316]',
    hoverColor: 'group-hover:bg-[#F97316]',
    link: '/interviews',
    image: '/interviews.png',
  },
  {
    id: 'yc',
    title: 'YC Directory',
    desc: 'A comprehensive directory of YC-backed startups. Filter by batch, location, and explore founder profiles directly from the source.',
    icon: Globe,
    color: 'bg-orange-100',
    hoverColor: 'group-hover:bg-orange-200',
    link: '/yc',
    image: '/yc.png',
  },
  {
    id: 'reddit',
    title: 'Reddit Live',
    desc: 'Real-time feed of job postings from Reddit.',
    icon: Zap,
    color: 'bg-red-100',
    hoverColor: 'group-hover:bg-red-200',
    link: '/reddit',
    image: '/reddit.png',
  },
  {
    id: 'companies',
    title: 'Remote Jobs',
    desc: 'Discover 800+ remote-first companies hiring worldwide.',
    icon: Laptop,
    color: 'bg-[#00A86B]',
    hoverColor: 'group-hover:bg-[#00A86B]',
    link: '/companies',
    image: '/remote.png',
  }
];

export default function FeatureCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === features.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? features.length - 1 : prev - 1));
  };

  return (
    <div className="w-full max-w-350 mx-auto py-12 px-2 sm:px-4 relative">
      
      <div className="absolute top-1/2 -translate-y-1/2 left-0 sm:left-2 md:left-8 z-40">
        <button onClick={prevSlide} className="p-2 sm:p-4 bg-white border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all rounded-full">
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-gray-900" strokeWidth={3} />
        </button>
      </div>
      
      <div className="absolute top-1/2 -translate-y-1/2 right-0 sm:right-2 md:right-8 z-40">
        <button onClick={nextSlide} className="p-2 sm:p-4 bg-white border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all rounded-full">
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-gray-900" strokeWidth={3} />
        </button>
      </div>

      <div className="relative h-105 sm:h-125 md:h-162.5 w-full flex justify-center items-center overflow-hidden">
        {features.map((feature, index) => {
          let diff = index - activeIndex;
          
          if (diff === features.length - 1) diff = -1;
          if (diff === -(features.length - 1)) diff = 1;

          let transformStyle = '';
          let opacityStyle = '';
          let zIndex = '';

          if (diff === 0) {
            transformStyle = 'translate-x-0 scale-100 md:scale-105';
            opacityStyle = 'opacity-100';
            zIndex = 'z-30';
          } else if (diff === -1) {
            transformStyle = '-translate-x-[70%] md:-translate-x-[90%] scale-80 md:scale-90';
            opacityStyle = 'opacity-50 hover:opacity-100 cursor-pointer';
            zIndex = 'z-20';
          } else if (diff === 1) {
            transformStyle = 'translate-x-[70%] md:translate-x-[90%] scale-80 md:scale-90';
            opacityStyle = 'opacity-50 hover:opacity-100 cursor-pointer';
            zIndex = 'z-20';
          } else {
            transformStyle = diff < 0 ? '-translate-x-[150%] scale-50' : 'translate-x-[150%] scale-50';
            opacityStyle = 'opacity-0 pointer-events-none';
            zIndex = 'z-10';
          }

          const Icon = feature.icon;

          return (
            <div
              key={feature.id}
              className={`absolute w-65 sm:w-[320px] md:w-125 transition-all duration-500 ease-in-out ${transformStyle} ${opacityStyle} ${zIndex}`}
            >
            <AuthGuard key={feature.id}>
              <Link 
                href={feature.link}
                onClick={(e) => {
                    if(diff !== 0){
                        e.preventDefault();
                    }
                }}
                className={`block group border-2 border-gray-900 rounded-2xl bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-all ${diff === 0 ? 'cursor-pointer hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'cursor-default'}`}
                tabIndex={diff === 0 ? 0 : -1}
              >
                {/* Top Image Section - ✨ 3 Responsive heights added */}
                <div className="relative w-full h-40 sm:h-56 md:h-80 border-b-2 border-gray-900 bg-gray-100 overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] bg-size-[16px_16px] opacity-50"></div>
                  
                  <Image 
                    src={feature.image} 
                    alt={feature.title}
                    fill
                    className="object-cover object-top"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none'; 
                    }}
                  />
                </div>

                <div className="p-4 sm:p-6 md:p-8 bg-white relative">
                  <div className={`absolute -top-6 sm:-top-8 right-4 sm:right-8 w-12 h-12 sm:w-16 sm:h-16 ${feature.color} border-2 border-gray-900 rounded-xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors ${feature.hoverColor}`}>
                    <Icon className={`w-6 h-6 sm:w-8 sm:h-8 text-gray-900 ${feature.id === 'companies' ? 'text-white' : ''}`} />
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-2 sm:mb-3 uppercase tracking-tight text-gray-900 mt-2">{feature.title}</h3>
                  <p className="text-sm sm:text-base md:text-lg font-bold text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              </Link>
            </AuthGuard>
            </div>
          );
        })}
      </div>
    </div>
  );
}