'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, ArrowUpRight, X } from 'lucide-react';
import { SearchResponse, SearchResult, SearchSource } from '@/src/lib/search/types';

const SOURCE_LABEL: Record<SearchSource, string> = {
  yc: 'YC',
  startups: 'STARTUPS',
  reddit: 'REDDIT',
  interview: 'INTERVIEWS',
  remote: 'REMOTE',
};

const SOURCE_COLOR: Record<SearchSource, string> = {
  yc: 'bg-[#FF6600] text-white',
  startups: 'bg-[#00A86B] text-white',
  reddit: 'bg-[#FF5A5F] text-white',
  interview: 'bg-[#FFC700] text-gray-900',
  remote: 'bg-[#8B5CF6] text-white',
};

function formatFilters(filters: Record<string, any>) {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(filters)) {
    if (v == null || v === '') continue;
    if (Array.isArray(v)) {
      if (v.length) parts.push(v.join('+'));
      continue;
    }
    if (k === 'keyword') continue;
    parts.push(String(v));
  }
  return parts.join(' · ');
}

export default function NavbarSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [data, setData] = useState<SearchResponse | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);

  const runSearch = () => {
    const q = query.trim();
    if (q.length < 3) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setData(null);
    fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: q }),
      signal: controller.signal, // remote control as is when i want i can cancel/abort that fetch req
    })
      .then(r => r.json())
      .then((json: SearchResponse) => { setData(json); })
      .catch(err => console.error(err))
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
  };

  const loadMore = () => {
    if (!data || !data.hasMore || loadingMore) return;
    setLoadingMore(true);
    fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: query.trim(),
        source: data.source,
        filters: data.filters,
        offset: data.results.length,
      }),
    })
      .then(r => r.json())
      .then((json: SearchResponse) => {
        setData(prev => prev
          ? { ...prev, results: [...prev.results, ...json.results], hasMore: json.hasMore }
          : json);
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingMore(false));
  };

  const open = (r: SearchResult) => {
    if (r.external) {
      window.open(r.href, '_blank', 'noopener,noreferrer');
    } else {
      router.push(r.href);
    }
    setExpanded(false);
    setQuery('');
    setData(null);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); runSearch(); }
    else if (e.key === 'Escape') { setQuery(''); setData(null); setExpanded(false); }
  };

  const showDropdown = expanded && (loading || data !== null);
  const chip = data ? (
    <span className={`text-[10px] font-black tracking-wider px-2 py-0.5 rounded border-2 border-gray-900 ${SOURCE_COLOR[data.source]}`}>
      {SOURCE_LABEL[data.source]}
      {formatFilters(data.filters) ? ` · ${formatFilters(data.filters)}` : ''}
    </span>
  ) : null;

  return (
    <div ref={containerRef} className="relative">
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="p-2 border-2 border-gray-900 rounded bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          aria-label="Search"
        >
          <Search size={16} />
        </button>
      ) : (
        <div className="relative">
          <button
            onClick={runSearch}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-gray-100"
            aria-label="Search"
          >
            <Search size={14} className="text-gray-700" />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKey}
            placeholder="Search startups, yc, interviews..."
            className="w-72 pl-10 pr-9 py-2 text-sm font-bold border-2 border-gray-900 rounded bg-white focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          />
          {loading ? (
            <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-500" />
          ) : query ? (
            <button onClick={() => { setQuery(''); setData(null); }} className="absolute right-2 top-1/2 -translate-y-1/2 p-1">
              <X size={14} />
            </button>
          ) : null}
        </div>
      )}

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-96 border-2 border-gray-900 rounded bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden z-50">
          <ResultsPanel data={data} loading={loading} loadingMore={loadingMore} onPick={open} onLoadMore={loadMore} chip={chip} />
        </div>
      )}
    </div>
  );
}

function ResultsPanel({
  data, loading, loadingMore, onPick, onLoadMore, chip,
}: {
  data: SearchResponse | null;
  loading: boolean;
  loadingMore: boolean;
  onPick: (r: SearchResult) => void;
  onLoadMore: () => void;
  chip: React.ReactNode;
}) {
  if (loading && !data) {
    return <div className="p-4 text-xs font-bold text-gray-500 flex items-center gap-2"><Loader2 size={12} className="animate-spin" /> Searching...</div>;
  }
  if (!data) return null;
  if (data.results.length === 0) {
    return (
      <div className="p-4 text-xs font-bold text-gray-500">
        <div>No results.</div>
        <div className="mt-1 text-gray-400">Try: &quot;AI startups W24&quot;, &quot;google sde2 interview&quot;, &quot;series A fintech&quot;.</div>
      </div>
    );
  }
  return (
    <div className="flex flex-col max-h-96 overflow-y-auto">
      <div className="px-3 py-2 border-b-2 border-gray-100 bg-gray-50 flex items-center gap-2 sticky top-0">
        {chip}
        <span className="text-[10px] font-bold text-gray-500 ml-auto">{data.results.length} result{data.results.length === 1 ? '' : 's'}</span>
      </div>
      {data.results.map((r) => (
        <button
          key={r.id}
          onClick={() => onPick(r)}
          className="flex items-start gap-2 px-3 py-2.5 text-left border-b border-gray-100 last:border-0 hover:bg-[#F8F3E7]"
        >
          <div className="flex-1 min-w-0">
            <div className="text-xs font-black text-gray-900 truncate">{r.title}</div>
            <div className="text-[11px] font-bold text-gray-500 truncate">{r.snippet}</div>
            {r.meta && <div className="text-[10px] font-bold text-gray-400 mt-0.5">{r.meta}</div>}
          </div>
          <ArrowUpRight size={12} className="text-gray-400 mt-0.5 shrink-0" />
        </button>
      ))}
      {data.hasMore && (
        <button
          onClick={onLoadMore}
          disabled={loadingMore}
          className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-black text-gray-900 bg-[#F8F3E7] border-t-2 border-gray-100 hover:bg-[#FFC700] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loadingMore ? <><Loader2 size={12} className="animate-spin" /> Loading...</> : 'Load more'}
        </button>
      )}
    </div>
  );
}
