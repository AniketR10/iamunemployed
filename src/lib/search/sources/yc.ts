import { supabaseAdmin } from '../../supabaseAdmin';
import { RESULT_LIMIT, SearchFilters, SearchResult } from '../types';

const LOCATION_ALIASES: Record<string, string[]> = {
  sf: ['San Francisco'],
  'sf bay': ['San Francisco'],
  'bay area': ['San Francisco', 'Palo Alto', 'Mountain View', 'Berkeley', 'Oakland'],
  nyc: ['New York'],
  ny: ['New York'],
  la: ['Los Angeles'],
  blr: ['Bangalore', 'Bengaluru'],
  bengaluru: ['Bangalore', 'Bengaluru'],
  usa: ['United States'],
  us: ['United States'],
  uk: ['United Kingdom'],
};

function locationVariants(raw: string): string[] {
  const key = raw.trim().toLowerCase();
  if (LOCATION_ALIASES[key]) return LOCATION_ALIASES[key];
  return [raw.trim()];
}


export async function searchYc(filters: SearchFilters, offset = 0): Promise<SearchResult[]> {
  let query = supabaseAdmin.from('ycstartups').select('id, name, one_liner, batch, all_locations, url, website').range(offset, offset + RESULT_LIMIT - 1);

  if (filters.batch) query = query.ilike('batch', filters.batch);
  if (filters.location) {
    if (/^remote$/i.test(filters.location.trim())) {
      query = query.or('all_locations.is.null,all_locations.ilike.%Remote%');
    } else {
      const variants = locationVariants(filters.location);
      const orClause = variants.map(v => `all_locations.ilike.%${v}%`).join(',');
      query = query.or(orClause);
    }
  }

  const kw = filters.keyword || filters.company;
  if (kw) query = query.or(`name.ilike.%${kw}%,one_liner.ilike.%${kw}%`);

  const { data } = await query;
  if (!data) return [];

  return data.map((r: any) => ({
    id: String(r.id),
    title: r.name,
    snippet: r.one_liner || 'No description',
    href: r.url || r.website || '#',
    external: true,
    meta: [r.batch, r.all_locations].filter(Boolean).join(' · '),
  }));
}
