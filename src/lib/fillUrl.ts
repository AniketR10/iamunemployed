import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv'
import path, { resolve } from "path";
import { supabaseAdmin } from "./supabaseAdmin";
import OpenAI from "openai";
import Groq from "groq-sdk"
import { fillFounders } from "./fillFounders";

dotenv.config({path: path.resolve(__dirname, '../../.env')});

//const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


const openai = new OpenAI({
     baseURL: "https://openrouter.ai/api/v1",
     apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000", 
        "X-Title": "GetTheFounder",
    },
});

async function extractDetails(title: string, url: string) {
        try {
            const completion = await groq.chat.completions.create({
                model: "moonshotai/kimi-k2-instruct",
                messages: [
                    {
                        role: "system",
                        content: `
                            Analyze this startup news:
                            HEADLINE: "${title}"
                            SOURCE URL: "${url}"

                            ### EXTRACT THE FOLLOWING DETAILS ABOUT THAT STARTUP FROM THE URL:
                            1. **Target Entity**: Identify the name of the startup receiving funding.
                            2. **Website**: Predict the official domain (e.g. "Stripe" -> "https://stripe.com").

                            Return JSON format:
                            {
                            "company_name": "string"
                            "website": "string or null",
                            }`,
                    }
                ],
                stream: false,
                response_format: { type: "json_object" }
            });

            const rawData = completion.choices[0].message.content || "{}";
            return JSON.parse(rawData);

        } catch (e: any) {
            console.error("Error: ",e);
            return null;
        }
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
                company_name: details.company_name,
                website: details.website,
            })
            .eq('id', row.id);

        if(updateError){
            console.error(" Update Failed:", updateError.message);
        } else {
            console.log(` Updated: ${details.funding_amount || 'N/A'} | ${details.funding_round || 'N/A'}`);
        }

        await new Promise(resolve => setTimeout(resolve, 5000));    
    }
    console.log("webiste links filled now filling founders data...")
    await fillFounders();

}
