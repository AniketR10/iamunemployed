import { promises as fs } from 'fs';
import path from 'path';
import { Company } from '../../../types/company';
import { RESULT_LIMIT, SearchFilters, SearchResult } from '../types';

let cache: Company[] | null = null;

async function load(): Promise<Company[]> {
  if (cache) return cache;
  const filePath = path.join(process.cwd(), 'src/data/remote_companies.json');
  const contents = await fs.readFile(filePath, 'utf8');
  cache = JSON.parse(contents);
  return cache!;
}

const includes = (hay: string | undefined, needle: string) =>
  !!hay && hay.toLowerCase().includes(needle.toLowerCase());

export async function searchRemote(filters: SearchFilters, offset = 0): Promise<SearchResult[]> {
  const companies = await load();

  const kw = filters.keyword || filters.company;
  const technologies = filters.technologies
    ? (Array.isArray(filters.technologies) ? filters.technologies : [filters.technologies as unknown as string])
    : [];

  const matches = companies.filter(c => {
    if (filters.region && !includes(c.region, filters.region)) return false;
    if (filters.remote_policy && !includes(c.remote_policy, filters.remote_policy)) return false;
    if (technologies.length > 0) {
      const techBlob = [c.company_technologies, ...(c.technologies || [])].join(' ').toLowerCase();
      const hasAny = technologies.some(t => techBlob.includes(t.toLowerCase()));
      if (!hasAny) return false;
    }
    if (kw) {
      const blob = [c.title, c.company_blurb, c.region, c.company_technologies].join(' ');
      if (!includes(blob, kw)) return false;
    }
    return true;
  });

  return matches.slice(offset, offset + RESULT_LIMIT).map(c => ({
    id: c.id,
    title: c.title,
    snippet: c.company_blurb?.slice(0, 120).replace(/\s+/g, ' ').trim() || c.region || 'Remote company',
    href: `/companies/${c.slug}`,
    external: false,
    meta: c.remote_policy,
  }));
}
