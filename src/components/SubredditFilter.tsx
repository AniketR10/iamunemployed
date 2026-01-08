"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function SubredditFilter({ onSelectAction }: { onSelectAction: (val: string) => void }) {
    const [subreddits, setSubreddits] = useState<string[]>(["All"]);
    const [loading, setLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [selected, setSelected] = useState("All");

    useEffect(() => {
        const fetchSubreddits = async () => {
            try {
                const res = await fetch("/api/subreddits");
                const data = await res.json();

                if (Array.isArray(data)) {
                    setSubreddits(["All", ...data]);
                }
            } catch (error) {
                console.error("error fetching communities", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubreddits();
    }, []);

    const handleSelect = (sub: string) => {
        setSelected(sub);
        onSelectAction(sub === "All" ? "" : sub);
    };

    const visibleSubreddits = isExpanded ? subreddits : subreddits.slice(0, 4);
    const hiddenCount = subreddits.length - 4;

    if (loading) return <div className="text-xs font-bold animate-pulse text-gray-500">Loading tags...</div>;

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-2 mb-3">
                {visibleSubreddits.map((sub) => (
                    <button
                        key={sub}
                        onClick={() => handleSelect(sub)}
                        className={`
                            text-xm font-bold px-3 py-1.5 rounded border-2 border-gray-900 transition-all 
                            shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] 
                            hover:translate-x-px hover:translate-y-px hover:shadow-none 
                            active:translate-x-0.5 active:translate-y-0.5
                            ${selected === sub 
                                ? 'bg-gray-900 text-white' 
                                : 'bg-white text-gray-900 hover:bg-gray-50'}
                        `}
                    >
                        {sub === "All" ? "All" : `r/${sub}`}
                    </button>
                ))}
            </div>

            {subreddits.length > 4 && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="
                        w-full mt-1 flex items-center justify-center gap-2 px-3 py-2 
                        bg-gray-100 border-2 border-dashed border-gray-900 rounded 
                        text-xs font-black uppercase tracking-wider text-gray-700
                        hover:bg-white hover:text-black hover:border-solid hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] 
                        transition-all active:translate-y-0.5
                    "
                >
                    {isExpanded ? (
                        <>
                            Show Less <ChevronUp size={14} strokeWidth={3} />
                        </>
                    ) : (
                        <>
                            Load {hiddenCount} More <ChevronDown size={14} strokeWidth={3} />
                        </>
                    )}
                </button>
            )}
        </div>
    );
}