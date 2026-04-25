import { NextRequest, NextResponse } from 'next/server';
import { routeIntent } from '@/src/lib/search/router';
import { RESULT_LIMIT, SearchFilters, SearchResponse, SearchResult, SearchSource } from '@/src/lib/search/types';
import { searchYc } from '@/src/lib/search/sources/yc';
import { searchStartups } from '@/src/lib/search/sources/startups';
import { searchReddit } from '@/src/lib/search/sources/reddit';
import { searchInterview } from '@/src/lib/search/sources/interview';
import { searchRemote } from '@/src/lib/search/sources/remote';

async function runSource(source: SearchSource, filters: SearchFilters, offset: number): Promise<SearchResult[]> {
  switch (source) {
    case 'yc': return searchYc(filters, offset);
    case 'startups': return searchStartups(filters, offset);
    case 'reddit': return searchReddit(filters, offset);
    case 'interview': return searchInterview(filters, offset);
    case 'remote': return searchRemote(filters, offset);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const query = typeof body.query === 'string' ? body.query.trim() : '';
    const offset = typeof body.offset === 'number' && body.offset >= 0 ? body.offset : 0;
    const cachedSource = body.source as SearchSource | undefined;
    const cachedFilters = (body.filters && typeof body.filters === 'object') ? body.filters as SearchFilters : undefined;

    if (query.length < 3 && !cachedSource) {
      return NextResponse.json({ source: 'yc', filters: {}, results: [], hasMore: false } satisfies SearchResponse);
    }

    let source: SearchSource;
    let filters: SearchFilters;

    if (cachedSource && cachedFilters) {
      source = cachedSource;
      filters = cachedFilters;
    } else {
      const intent = await routeIntent(query);
      if (!intent) {
        return NextResponse.json({ source: 'yc', filters: {}, results: [], hasMore: false } satisfies SearchResponse);
      }
      source = intent.source;
      filters = intent.filters;
    }

    const results = await runSource(source, filters, offset);
    const response: SearchResponse = {
      source,
      filters,
      results,
      hasMore: results.length === RESULT_LIMIT,
    };
    return NextResponse.json(response);
  } catch (e: any) {
    console.error('search route error:', e);
    return NextResponse.json({ source: 'yc', filters: {}, results: [], hasMore: false }, { status: 500 });
  }
}
