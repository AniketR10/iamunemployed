"use client";

import { useState, useMemo } from "react";
import { Search, ExternalLink, X, Filter } from "lucide-react";
import Navbar from "@/src/components/Navbar"; 
import rawJobData from "@/src/data/job_boards.json";

interface JobBoard {
  name: string;
  url: string;
  description?: string;
}

const cardThemes = [
  "bg-[#FFE4E6] hover:shadow-[6px_6px_0px_0px_#E11D48] hover:border-[#E11D48]", 
  "bg-[#DBEAFE] hover:shadow-[6px_6px_0px_0px_#2563EB] hover:border-[#2563EB]", 
  "bg-[#DCFCE7] hover:shadow-[6px_6px_0px_0px_#16A34A] hover:border-[#16A34A]", 
  "bg-[#FEF9C3] hover:shadow-[6px_6px_0px_0px_#D97706] hover:border-[#D97706]", 
  "bg-[#F3E8FF] hover:shadow-[6px_6px_0px_0px_#9333EA] hover:border-[#9333EA]", 
  "bg-[#FFEDD5] hover:shadow-[6px_6px_0px_0px_#EA580C] hover:border-[#EA580C]", 
];

export default function JobBoardsPage() {
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [mainSearchQuery, setMainSearchQuery] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  const { allBoards, allUniqueCategories } = useMemo(() => {
    const data = rawJobData as any; 
    
    const boards: (JobBoard & { category: string })[] = [];
    const categoriesSet = new Set<string>();

    Object.entries(data).forEach(([key, value]) => {
      if (!value) return;

      if (key === "Country" && Array.isArray(value)) {
        value.forEach((countryObject: Record<string, JobBoard[]>) => {
          Object.entries(countryObject).forEach(([categoryName, links]) => {
            categoriesSet.add(categoryName);
            links.forEach((link) => {
              boards.push({ ...link, category: categoryName });
            });
          });
        });
      } else if (Array.isArray(value)) {
        categoriesSet.add(key);
        value.forEach((link: JobBoard) => {
          boards.push({ ...link, category: key });
        });
      }
    });

    return {
      allBoards: boards.sort((a, b) => a.name.localeCompare(b.name)),
      allUniqueCategories: Array.from(categoriesSet).sort(),
    };
  }, []);

  const filteredBoards = useMemo(() => {
    return allBoards.filter((board) => {
      const matchesCategory =
        activeCategories.length === 0 || activeCategories.includes(board.category);
      const matchesSearch = board.name.toLowerCase().includes(mainSearchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allBoards, activeCategories, mainSearchQuery]);

  const visibleCategories = allUniqueCategories.filter((cat) =>
    cat.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const toggleCategory = (cat: string) => {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F3E7] font-sans text-gray-900 text-sm flex flex-col">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-16 w-full">
        
        <div className="text-center mb-40 relative mt-4">
          <div className="inline-block relative">
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none relative z-20">
              JOB
              <span className="block text-[#FF5A5F] drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                 BOARDS
              </span>
            </h1>

            <div className="absolute -bottom-28 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center w-56">
               <div className="w-full flex justify-between items-end px-8 z-0">
                   <div className="w-1.5 h-14 bg-gray-900 border-x border-gray-900"></div>
                   <div className="w-1.5 h-16 bg-gray-900 border-x border-gray-900"></div>
               </div>

               <div className="w-full bg-[#FFC700] border-2 border-gray-900 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -mt-1 rotate-2 hover:rotate-0 transition-transform duration-300 origin-top relative cursor-default">
                   <div className="absolute -top-2 left-7 w-3 h-3 bg-gray-300 rounded-full border-2 border-gray-900"></div>
                   <div className="absolute -top-2 right-7 w-3 h-3 bg-gray-300 rounded-full border-2 border-gray-900"></div>
                   <p className="text-sm font-bold text-gray-900 leading-tight text-center">
                     Find any Job that you can imagine!
                   </p>
               </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          <main className="flex-1 order-2 lg:order-1">
            <div className="mb-6 flex flex-wrap gap-4 justify-between items-end border-b-2 border-gray-900 pb-4">
              <h2 className="text-3xl font-black flex items-center gap-3">
                {activeCategories.length === 0 ? "All Boards" : "Filtered Results"}
                {activeCategories.length > 0 && (
                  <button 
                    onClick={() => setActiveCategories([])}
                    className="bg-gray-200 hover:bg-[#FF5A5F] hover:cursor-pointer hover:text-white px-3 py-1 rounded-full text-sm font-bold transition-colors flex items-center gap-1"
                  >
                    <X size={14} strokeWidth={3} /> Clear All Filters
                  </button>
                )}
              </h2>
              <span className="font-bold text-white bg-[#FF5A5F] px-4 py-1.5 rounded-md border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm">
                {filteredBoards.length} Results
              </span>
            </div>

            {filteredBoards.length === 0 ? (
              <div className="w-full p-12 bg-white border-2 border-dashed border-gray-400 rounded-lg text-center">
                <p className="text-xl font-bold text-gray-500">No job boards found.</p>
                <button 
                  onClick={() => { setMainSearchQuery(""); setActiveCategories([]); }}
                  className="mt-4 text-[#FF5A5F] font-bold hover:underline hover:cursor-pointer"
                >
                  Clear search and filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredBoards.map((board, idx) => {
                  const themeClass = cardThemes[idx % cardThemes.length];
                  
                  return (
                    <a
                      key={idx}
                      href={board.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group border-2 border-gray-900 rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200 relative overflow-hidden flex flex-col ${themeClass}`}
                    >
                      <div className="flex justify-between items-start mb-4 gap-4">
                        
                        <div className="flex items-start gap-2">
                          <h3 className="font-black text-xl leading-tight text-gray-900 transition-colors">
                            {board.name}
                          </h3>
                          <ExternalLink size={20} className="text-gray-900 group-hover:scale-110 transition-transform shrink-0 relative top-0.5" strokeWidth={2.5} />
                        </div>
                        
                        <div className="shrink-0">
                          <span className="inline-block px-2.5 py-1 bg-white border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-sm text-[10px] font-black uppercase tracking-wider text-gray-900">
                            {board.category}
                          </span>
                        </div>

                      </div>
                      
                      {board.description && (
                        <p className="text-sm font-bold text-gray-800/80 line-clamp-2">
                          {board.description}
                        </p>
                      )}
                    </a>
                  );
                })}
              </div>
            )}
          </main>

          <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-4 order-1 lg:order-2 lg:sticky lg:top-8 lg:self-start">
            
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} strokeWidth={3} />
              <input
                type="text"
                placeholder="Search specific boards..."
                value={mainSearchQuery}
                onChange={(e) => setMainSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-900 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#FF5A5F] focus:shadow-[4px_4px_0px_0px_#FF5A5F] transition-all"
              />
            </div>

            <div className="bg-white border-2 border-gray-900 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden">
              <div className="bg-gray-100 border-b-2 border-gray-900 p-3 flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm font-black text-gray-900 uppercase tracking-wider">
                  <Filter size={16} className="text-[#FF5A5F]" /> 
                  Categories 
                  {activeCategories.length > 0 && <span className="bg-[#FF5A5F] text-white px-2 py-0.5 rounded-full text-[10px]">{activeCategories.length}</span>}
                </div>
                {activeCategories.length > 0 && (
                  <button onClick={() => setActiveCategories([])} className="text-xs font-bold text-gray-500 hover:text-[#FF5A5F] hover:cursor-pointer">Clear</button>
                )}
              </div>
              
              <div className="p-3">
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} strokeWidth={3} />
                  <input
                    type="text"
                    placeholder="Filter categories..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border-2 border-gray-200 rounded text-sm font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 transition-colors"
                  />
                </div>

                <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                  {visibleCategories.length > 0 ? visibleCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`px-2.5 py-1 rounded border-2 font-bold text-xs transition-all ${
                        activeCategories.includes(cat)
                          ? "bg-gray-900 border-gray-900 text-white" 
                          : "bg-white border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900"
                      }`}
                    >
                      {cat}
                    </button>
                  )) : <p className="text-xs text-gray-400 font-medium w-full text-center py-2">No categories found.</p>}
                </div>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}