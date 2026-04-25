import Groq from 'groq-sdk';
import { SearchIntent, SearchSource } from './types';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a search intent classifier for a job/startup discovery site.

Classify the user's query into ONE source and extract filters. Return strict JSON only.

SOURCES:
- "yc": Y Combinator startups. Filters: batch, location, keyword, company.
- "startups": Recently funded startups. Filters: funding_round (e.g. "Series A","Seed"), time ("24h"|"7d"|"30d"), keyword, company.
- "reddit": Reddit job posts. Filters: subreddit (without "r/"), time, keyword.
- "interview": Interview experiences. Filters: company, role (e.g. "SDE2","SWE"), outcome ("Offer"|"Rejected"|"Ghosted"), keyword.
- "remote": Remote-friendly companies. Filters: region, remote_policy ("remote-friendly"|"fully-remote"), technologies (java, python etc.), keyword.

BATCH FORMAT (yc only):
- Format: "<Season> <YYYY>" with title-case season and 4-digit year.
- Valid seasons: Winter, Spring, Summer, Fall.
- Examples: "winter 2025" -> "Winter 2025", "w25" -> "Winter 2025", "S24" -> "Summer 2024", "fall 2026" -> "Fall 2026".
- Never output short codes like "W25" or lowercase.

LOCATION FORMAT (yc only):
- Output a single city name in title case. Do NOT include state/country suffixes or commas.
- Expand common abbreviations: "SF"/"sf bay"/"bay area" → "San Francisco", "NYC"/"ny" → "New York", "LA" → "Los Angeles", "LDN" → "London", "BLR" → "Bangalore".
- If the user only gives a country (e.g. "india", "usa"), use the country name as-is in title case: "India", "United States".
- If the user says "remote" or "anywhere", output "Remote".

RULES:
- Pick the single best source.
- Only include filter keys you are confident about. Omit the rest.
- "keyword" is the residual free-text after pulling structured filters out. Drop generic words like "list", "show", "find", "startups", "jobs".
- Return {"source": "...", "filters": {...}} and nothing else.`;

export async function routeIntent(query: string): Promise<SearchIntent | null> {
  try {
    const completion = await groq.chat.completions.create({
      model: process.env.LLM_MODEL || 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: query },
      ],
      stream: false,
      response_format: { type: 'json_object' },
      temperature: 0,
    });

    const raw = completion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(raw);

    const source = parsed.source as SearchSource;
    if (!['yc', 'startups', 'reddit', 'interview', 'remote'].includes(source)) return null;

    return { source, filters: parsed.filters || {} };
  } catch (e) {
    console.error('search router error:', e);
    return null;
  }
}
