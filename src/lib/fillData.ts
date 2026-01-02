import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv'
import path, { resolve } from "path";
import { supabaseAdmin } from "./supabaseAdmin";
import OpenAI from "openai";

dotenv.config({path: path.resolve(__dirname, '../../.env')});

//const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

const openai = new OpenAI({
     baseURL: "https://openrouter.ai/api/v1",
     apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000", 
        "X-Title": "GetTheFounder",
    },
});

// Update function signature to accept BOTH title and url
async function extractDetails(title: string, url: string, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const completion = await openai.chat.completions.create({
                model: "google/gemini-2.0-flash-exp:free", // Best free model for this
                messages: [
                    {
                        role: "system",
                        content: `You are an elite financial data extraction engine. 
                                Your goal is to populate a database with 100% accuracy.

                                ### EXTRACTION RULES:
                                1. **Target Entity**: Identify the startup that is *receiving* funding or being discussed.
                                2. **Website (High Priority)**: 
                                - If the URL contains the domain (e.g. "techcrunch.com/startups/stripe"), extract it.
                                - If not, you MUST predict the most likely official domain based on the company name (e.g. "Stripe" -> "https://stripe.com"). 
                                - Do NOT use news sites (yahoo, bloomberg, etc.) as the website.
                                3. **Funding Amount (Strict)**: 
                                - Extract ONLY the specific amount raised in this specific news event.
                                - Convert to a raw integer (e.g. "$5.5M" -> 5500000). 
                                - If no amount is mentioned, return null. DO NOT GUESS.
                                4. **Funding Round**: 
                                - Extract the round type (Seed, Series A, Pre-seed, IPO, Acquisition).
                                - If ambiguous, return null.

                                ### RESPONSE FORMAT:
                                Return strictly valid JSON. No markdown. No explanations.`
                                                    },
                                                    {
                                                        role: "user",
                                                        content: `
                                Analyze this startup news event:

                                HEADLINE: "${title}"
                                SOURCE URL: "${url}"

                                ### EXAMPLES FOR LEARNING:

                                Input Headline: "Generative AI star Writer raises $200M Series B"
                                Input URL: "https://techcrunch.com/2023/09/18/writer-series-b"
                                Output: { "website": "https://writer.com", "funding_amount": 200000000, "funding_round": "Series B" }

                                Input Headline: "Vercel acquires Split to improve feature flags"
                                Input URL: "https://vercel.com/blog/split-acquisition"
                                Output: { "website": "https://split.io", "funding_amount": null, "funding_round": "Acquisition" }

                                Input Headline: "New startup Blink appears in stealth mode"
                                Input URL: "https://news.ycombinator.com/item?id=12345"
                                Output: { "website": "https://blink.com", "funding_amount": null, "funding_round": null }

                                ### YOUR TURN:
                                Extract the data for the provided headline/URL.`
                    }
                ],
                stream: false,
                response_format: { type: "json_object" }
            });

            const rawData = completion.choices[0].message.content || "{}";
            return JSON.parse(rawData);

        } catch (e: any) {
            if (e.status === 429) {
                console.log(`      ⚠️ Rate Limited. Retrying in 10s... (Attempt ${i + 1}/${retries})`);
                await new Promise(resolve => setTimeout(resolve, 10000));
            } else {
                console.error("      ❌ Non-retriable Error:", e.message);
                return null;
            }
        }
    }
    return null;
}

export async function fillData(){
    console.log("starting ai filling of data...");

    const prevDates = new Date();
    prevDates.setDate(prevDates.getDate() - 2);
    const dateString = prevDates.toISOString().split('T')[0];

    const {data: rows, error} = await supabaseAdmin
        .from('startups')
        .select('*')
        .is('website', null)
        .gte('created_at', dateString)
        .order('created_at', {ascending: false});

    if(error) {
        console.error(" Supabase Error:", error.message);
        return;
    }

    if(!rows || rows.length == 0){
        console.log("✅ No incomplete startups found.");
        return;
    }

    console.log(` Found ${rows.length} startups to fill.`);

    for(const row of rows) {
        console.log(`\n Analyzing url: ${row.source_url}`);
        if(!row.source_url) continue;

        const details = await extractDetails(row.name, row.source_url);
        if(!details) continue;

        const {error: updateError} = await supabaseAdmin
            .from('startups')
            .update({
                website: details.website,
                funding_amount: details.funding_amount,
                funding_round: details.funding_round,
            })
            .eq('id', row.id);

        if(updateError){
            console.error(" Update Failed:", updateError.message);
        } else {
            console.log(` Updated: ${details.funding_amount || 'N/A'} | ${details.funding_round || 'N/A'}`);
        }

        await new Promise(resolve => setTimeout(resolve, 10000));    
    }

}
