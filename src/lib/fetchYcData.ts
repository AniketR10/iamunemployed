import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from './supabaseAdmin';


const HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
};

async function getFounderSocials(ycUrl: string): Promise<string[]> {
    try {
        const response = await axios.get(ycUrl, { headers: HEADERS, timeout: 10000 });
        if (response.status !== 200) return [];

        const $ = cheerio.load(response.data);
        const socialLinks: string[] = [];

        $("a[href*='linkedin.com'], a[href*='twitter.com'], a[href*='x.com']").each((_, element) => {
            const href = $(element).attr('href');
            if (href) {
                if (
                    !href.includes('/company/') && 
                    !href.includes('ycombinator') && 
                    !href.includes('y-combinator')
                ) {
                    socialLinks.push(href);
                }
            }
        });

        return [...new Set(socialLinks)];

    } catch (e: any) {
        console.error(`   ❌ Error scraping ${ycUrl}: ${e.message}`);
        return [];
    }
}

async function scrapeAndUpload() {
    const targetBatches = [
        "winter-2026", "summer-2026", "spring-2026", "fall-2026",
        "winter-2025", "summer-2025", "spring-2025", "fall-2025",
    ];

    const baseUrl = "https://yc-oss.github.io/api/batches/{batch}.json";

    console.log("🚀 Starting YC Scraper -> Supabase (Table: ycStartups)...");

    for (const batch of targetBatches) {
        const url = baseUrl.replace("{batch}", batch);
        process.stdout.write(`\n📂 Fetching Batch: ${batch}... `);

        try {
            const res = await axios.get(url);
            if (res.status !== 200) {
                console.log("⚠️  (No data yet)");
                continue;
            }

            const companies = res.data;
            console.log(`✅ Found ${companies.length} companies.`);

            for (let i = 0; i < companies.length; i++) {
                const company = companies[i];
                const name = company.name;
                const ycUrl = company.url;

                if (!name || !ycUrl) continue;

                process.stdout.write(`   [${i + 1}/${companies.length}] Processing ${name}... `);

                const socials = await getFounderSocials(ycUrl);
                
                if (socials.length > 0) {
                    process.stdout.write(`🔗 Found ${socials.length} socials. `);
                } else {
                    process.stdout.write(`No socials. `);
                }

                const rowData = {
                    name: name,
                    website: company.website,
                    all_locations: company.all_locations,
                    one_liner: company.one_liner,
                    launched_at: company.launched_at,
                    batch: company.batch,
                    stage: company.stage,
                    url: ycUrl,
                    founder_socials: socials.length > 0 ? socials : null 
                };

                const { error } = await supabaseAdmin
                    .from('ycstartups')
                    .upsert(rowData, { onConflict: 'name, url' });

                if (error) {
                    console.log(` DB Error: ${error.message}`);
                } else {
                    console.log("✅ Saved.");
                }

                const sleepTime = Math.random() * 1500 + 1000;
                await new Promise(resolve => setTimeout(resolve, sleepTime));
            }

        } catch (e: any) {
            console.log(`Batch not found or error: ${e.message})`);
        }
    }

    console.log("\n All Done!");
}

scrapeAndUpload();