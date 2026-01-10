import Groq from "groq-sdk";
import dotenv from 'dotenv';
import path from "path";
import { supabaseAdmin } from "./supabaseAdmin";

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function extractFundingDetails(title: string, url: string) {
    try {
        const completion = await groq.chat.completions.create({
            model: process.env.LLM_MODEL || "",
            messages: [
                {
                    role: "system",
                    content: `
                        You are a Financial Data Analyst for startups.
                        Analyze the headline and URL to extract the funding details.

                        HEADLINE: "${title}"
                        SOURCE URL: "${url}"

                        ### TASK:
                        1. Extract the **Funding Amount** (e.g., "$5M", "$12.5M", "€2M"). 
                        2. Extract the **Funding Round** (e.g., "Pre-Seed", "Seed", "Series A", "Series B").

                        ### RETURN FORMAT (JSON ONLY):
                        {
                            "funding_amount": "string or null", 
                            "funding_round": "string or null"
                        }
                    `,
                }
            ],
            stream: false,
            response_format: { type: "json_object" }
        });

        const rawData = completion.choices[0].message.content || "{}";
        return JSON.parse(rawData);

    } catch (e: any) {
        console.error("Error: ", e.message);
        return null;
    }
}

export async function fillFunding() {
    console.log("💰 Starting AI Funding Enrichment...");

    const { data: rows, error } = await supabaseAdmin
        .from('startups')
        .select('id, name, source_url')
        .is('funding_amount', null)
        .is('funding_round', null)
        .not('source_url', 'is', null)
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) {
        console.error("❌ Supabase Error:", error.message);
        return;
    }

    if (!rows || rows.length === 0) {
        console.log("✅ No startups found with missing funding data.");
        return;
    }

    console.log(`🔍 Found ${rows.length} startups to enrich.`);

    for (const row of rows) {
        console.log(`\n-----------------------------------`);
        console.log(` Analyzing: ${row.name}`);
        
        const details = await extractFundingDetails(row.name, row.source_url);

        if (!details || (!details.funding_amount && !details.funding_round)) {
            console.log(` No funding data found for ${row.name}. Skipping.`);
            continue;
        }

        const { error: updateError } = await supabaseAdmin
            .from('startups')
            .update({
                funding_amount: details.funding_amount,
                funding_round: details.funding_round
            })
            .eq('id', row.id);

        if (updateError) {
            console.error(" Update Failed:", updateError.message);
        } else {
            console.log(`✅ Updated:`);
            console.log(`   - Amount: ${details.funding_amount || 'N/A'}`);
            console.log(`   - Round:  ${details.funding_round || 'N/A'}`);
        }

        await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    console.log("\nFunding data generation complete.");
}

if (require.main === module) {
    fillFunding();
}