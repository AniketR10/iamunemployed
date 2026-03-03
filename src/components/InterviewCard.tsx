import React from "react";
import { Calendar, ExternalLink } from "lucide-react";

export interface InterviewPost {
  id: string;
  title: string;
  url: string;
  company: string | null;
  role: string | null;
  yoe: number | null;
  outcome: string | null;
  post_date: number | string;
  summary?: string | null;
}

const getOutcomeColor = (outcome: string | null) => {
  if (!outcome) return "bg-gray-100 text-gray-900";
  const lower = outcome.toLowerCase();
  if (lower.includes("offer")) return "bg-[#00A86B] text-white"; 
  if (lower.includes("reject")) return "bg-[#FF5A5F] text-white"; 
  return "bg-[#8B5CF6] text-white"; 
};

const formatDate = (dateValue: number | string) => {
  if (!dateValue) return "Unknown Date";
  const date = new Date(
    typeof dateValue === "number" ? dateValue * 1000 : dateValue
  );
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function InterviewCard({ post }: { post: InterviewPost }) {
  const Wrapper: any = post.url ? "a" : "div";

  return (
    <Wrapper
      {...(post.url && {
        href: post.url,
        target: "_blank",
        rel: "noopener noreferrer",
      })}
      className="p-5 border-2 border-gray-900 rounded-xl bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFFCF2] transition-all flex flex-col h-full group cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3 gap-2">
        <div className="space-y-2 flex-1">
          
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-xl font-black tracking-tight uppercase">
              {post.company || "UNKNOWN COMPANY"}
            </h3>
            
            {post.role && (
              <span className="px-2.5 py-1 bg-[#FF90E8] border-2 border-gray-900 rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black text-gray-900 uppercase transform -rotate-2">
                {post.role}
              </span>
            )}
          </div>

          {post.post_date && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500 font-bold">
              <Calendar size={14} strokeWidth={2.5} />
              <span>{formatDate(post.post_date)}</span>
            </div>
          )}
        </div>

        <div className="shrink-0 pl-2">
          {post.outcome && (
            <span
              className={`inline-block px-2.5 py-1 text-xs font-black border-2 border-gray-900 rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wide transform rotate-2 ${getOutcomeColor(
                post.outcome
              )}`}
            >
              {post.outcome}
            </span>
          )}
        </div>
      </div>

      <div className="mb-4 mt-2">
        <div className="text-lg text-gray-700 font-bold leading-tight mb-2 flex items-start gap-2">
          <span className="group-hover:text-blue-600 transition-colors">
            {post.title}
          </span>

          {post.url && (
            <ExternalLink
              size={18}
              strokeWidth={2.5}
              className="text-gray-400 group-hover:text-blue-600 group-hover:scale-110 transition-all shrink-0 mt-0.5"
            />
          )}
        </div>

        {post.summary && (
          <p className="text-sm font-medium text-gray-600 line-clamp-3 leading-relaxed">
            {post.summary}
          </p>
        )}
      </div>

      {post.yoe !== null && (
        <div className="mt-auto pt-4 border-t-2 border-dashed border-gray-200">
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center px-3 py-1.5 bg-[#93C5FD] border-2 border-gray-900 rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black transform transition-transform group-hover:-rotate-1">
              <span className="text-gray-900 uppercase">
                ⏳ {post.yoe === 0 ? "NEW GRAD" : `${post.yoe} YOE`}
              </span>
            </div>
          </div>
        </div>
      )}
    </Wrapper>
  );
}