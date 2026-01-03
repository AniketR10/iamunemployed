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
            model: "moonshotai/kimi-k2-instruct", // or "llama3-70b-8192" for better reasoning
            messages: [
                {
                    role: "system",
                    content: `
                        You are a Data Enrichment Assistant.
                        Analyze the following startup news metadata to identify the founders.

                        HEADLINE: "${title}"
                        SOURCE URL: "${url}"

                        ### TASK:
                        1. Identify the **Founders** of the startup mentioned.
                        2. Predict or extract their **LinkedIn** and **Twitter/X** profiles based on common patterns or public knowledge.

                        ### RETURN FORMAT (JSON ONLY):
                        {
                            "founder_socials": [
                                { 
                                    "name": "Full Name", 
                                    "linkedin": "https://linkedin.com/in/username (or null)", 
                                    "twitter": "https://x.com/username (or null)" 
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
        .select('id, name, source_url')
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
        console.log(`Analyzing: ${row.name}`);
        
        const details = await extractFounderDetails(row.name, row.source_url);

        if (!details || !details.founder_socials || details.founder_socials.length === 0) {
            console.log(`  No founders found for ${row.name}. Skipping.`);
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