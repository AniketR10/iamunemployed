import Groq from "groq-sdk";
import dotenv from 'dotenv';
import path from "path";
import { supabaseAdmin } from "./supabaseAdmin";
import { fillFunding } from "./fillFundData";

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function extractFounderDetails(title: string, url: string) {
    try {
        const completion = await groq.chat.completions.create({
            model: process.env.LLM_MODEL || "",
            messages: [
                {
                    role: "system",
                    content: `
                        You are a Data Enrichment Assistant.
                        Analyze the following startup news metadata to identify the founders.

                        HEADLINE: "${title}"
                        WEBSITE URL: "${url}"

                        ### TASK:
                        1. Identify the **Founders** of the startup mentioned.
                        2. Get their **LinkedIn** and **Twitter/X** profiles based on public knowledge or search the internet.

                        ### RETURN FORMAT (JSON ONLY):
                        {
                            "founder_socials": [
                                { 
                                    "name": "Full Name", 
                                    "linkedin": linkedin url", 
                                    "twitter": "x userid url" 
                                }
                            ]
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

export async function fillFounders() {
    console.log("🚀 Starting AI Founder Enrichment...");

    const { data: rows, error } = await supabaseAdmin
        .from('startups')
        .select('id, name, company_name, website')
        .is('founder_socials', null)
        .not('source_url', 'is', null)
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) {
        console.error(" Error:", error.message);
        return;
    }

    if (!rows || rows.length === 0) {
        console.log("✅ No startups found with missing founder details.");
        return;
    }

    console.log(`🔍 Found ${rows.length} startups to enrich.`);

    for (const row of rows) {
        console.log(`Analyzing: ${row.company_name || row.name}`);
        
        const details = await extractFounderDetails(row.company_name || row.name, row.website);

        if (!details || !details.founder_socials || details.founder_socials.length === 0) {
            console.log(`  No founders found for ${row.company_name}. Skipping.`);
            continue;
        }

        const { error: updateError } = await supabaseAdmin
            .from('startups')
            .update({
                founder_socials: details.founder_socials
            })
            .eq('id', row.id);

        if (updateError) {
            console.error(" Update Failed:", updateError.message);
        } else {
            console.log(`✅ Updated Founders:`);
            details.founder_socials.forEach((f: any) => {
                console.log(`   - ${f.name} (${f.linkedin || 'No LI'})`);
            });
        }

        await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    console.log("\n Filling founder data is complete. Now filling the Funding amount and round.");
    
    await fillFunding();

}

if (require.main === module) {
    fillFounders();
}