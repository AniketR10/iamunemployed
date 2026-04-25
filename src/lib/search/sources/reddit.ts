import { supabaseAdmin } from '../../supabaseAdmin';
import { RESULT_LIMIT, SearchFilters, SearchResult } from '../types';

const hoursFor = (t?: string) => (t === '24h' ? 24 : t === '7d' ? 24 * 7 : 0);

export async function searchReddit(filters: SearchFilters, offset = 0): Promise<SearchResult[]> {
  let query = supabaseAdmin
    .from('redditjobs')
    .select('id, title, url, subreddit, timestamp')
    .order('timestamp', { ascending: false })
    .range(offset, offset + RESULT_LIMIT - 1);

  if (filters.subreddit) query = query.ilike('subreddit', filters.subreddit.replace(/^r\//, ''));
  if (filters.keyword) query = query.ilike('title', `%${filters.keyword}%`);

  const h = hoursFor(filters.time);
  if (h > 0) {
    const past = new Date(Date.now() - h * 60 * 60 * 1000);
    query = query.gte('timestamp', past.toISOString());
  }

  const { data } = await query;
  if (!data) return [];

  return data.map((r: any) => ({
    id: String(r.id),
    title: r.title,
    snippet: `r/${r.subreddit}`,
    href: r.url || '#',
    external: true,
    meta: r.timestamp ? new Date(r.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : undefined,
  }));
}
