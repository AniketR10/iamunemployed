import { promises as fs } from 'fs';
import path from 'path';
import { RESULT_LIMIT, SearchFilters, SearchResult } from '../types';

interface ArchiveEntry {
  id: string;
  title: string;
  url: string;
  company: string | null;
  role: string | null;
  outcome: string | null;
  yoe: number | null;
  post_date: string;
  summary?: string | null;
}

let cache: ArchiveEntry[] | null = null;

async function load(): Promise<ArchiveEntry[]> {
  if (cache) return cache;
  const filePath = path.join(process.cwd(), 'src/data/archive.json');
  const contents = await fs.readFile(filePath, 'utf8');
  cache = JSON.parse(contents);
  return cache!;
}

const includes = (hay: string | null | undefined, needle: string) =>
  !!hay && hay.toLowerCase().includes(needle.toLowerCase());

export async function searchInterview(filters: SearchFilters, offset = 0): Promise<SearchResult[]> {
  const entries = await load();

  const matches = entries.filter(e => {
    if (filters.company && !includes(e.company, filters.company)) return false;
    if (filters.role && !includes(e.role, filters.role)) return false;
    if (filters.outcome && !includes(e.outcome, filters.outcome)) return false;
    if (filters.keyword) {
      const blob = [e.title, e.summary, e.company, e.role].filter(Boolean).join(' ');
      if (!includes(blob, filters.keyword)) return false;
    }
    return true;
  });

  matches.sort((a, b) => (a.post_date < b.post_date ? 1 : -1));

  return matches.slice(offset, offset + RESULT_LIMIT).map(e => ({
    id: e.id,
    title: e.title,
    snippet: [e.company, e.role, e.outcome].filter(Boolean).join(' · ') || 'Interview experience',
    href: e.url || '#',
    external: true,
    meta: e.post_date ? new Date(e.post_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined,
  }));
}
