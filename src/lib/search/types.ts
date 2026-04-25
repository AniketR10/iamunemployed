export type SearchSource = 'yc' | 'startups' | 'reddit' | 'interview' | 'remote';

export interface SearchFilters {
  keyword?: string;
  company?: string;
  batch?: string;
  location?: string;
  role?: string;
  outcome?: string;
  subreddit?: string;
  time?: '24h' | '7d';
  funding_round?: string;
  region?: string;
  remote_policy?: string;
  technologies?: string[];
}

export interface SearchIntent {
  source: SearchSource;
  filters: SearchFilters;
}

export interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  href: string;
  external: boolean;
  meta?: string;
}

export interface SearchResponse {
  source: SearchSource;
  filters: SearchFilters;
  results: SearchResult[];
  hasMore: boolean;
}

export const RESULT_LIMIT = 10;
