import { supabaseAdmin } from '../../supabaseAdmin';
import { RESULT_LIMIT, SearchFilters, SearchResult } from '../types';

const daysFor = (t?: string) => (t === '24h' ? 2 : t === '7d' ? 7 : t === '30d' ? 30 : 0);

export async function searchStartups(filters: SearchFilters, offset = 0): Promise<SearchResult[]> {
  let query = supabaseAdmin
    .from('startups')
    .select('id, company_name, website, announced_date, funding_round, source_url')
    .order('announced_date', { ascending: false })
    .range(offset, offset + RESULT_LIMIT - 1);

  if (filters.funding_round) query = query.ilike('funding_round', `%${filters.funding_round}%`);

  const kw = filters.keyword || filters.company;
  if (kw) query = query.ilike('company_name', `%${kw}%`);

  const d = daysFor(filters.time);
  if (d > 0) {
    const past = new Date();
    past.setDate(past.getDate() - d);
    query = query.gte('announced_date', past.toISOString());
  }

  const { data } = await query;
  if (!data) return [];

  return data.map((r: any) => ({
    id: String(r.id),
    title: r.company_name,
    snippet: r.funding_round || 'Funding round',
    href: r.source_url || r.website || '#',
    external: true,
    meta: r.announced_date ? new Date(r.announced_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : undefined,
  }));
}
