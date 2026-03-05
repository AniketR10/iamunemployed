import dotenv from 'dotenv';
import path from 'path';
import { supabaseAdmin } from './supabaseAdmin';
import Groq from 'groq-sdk';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function extractInterviewDetails(title: string) {
    try {
        const completion = await groq.chat.completions.create({
            model: process.env.LLM_MODEL || " ",
            messages: [
                {
                    role: "system",
                    content: `
                        You are a data extraction assistant. Analyze this LeetCode interview experience title:
                        TITLE: "${title}"

                        ### EXTRACT THE FOLLOWING DETAILS:
                        1. **company**: The name of the company the interview was for (e.g., "Amazon", "Google", "Uber", "Roku").
                        2. **role**: The specific job title or level mentioned (e.g., "SDE2", "SWE", "SMTS", "Data Engineer", "Intern"). Return null if not mentioned.
                        3. **outcome**: The result of the interview if mentioned (e.g., "Offer", "Rejected", "Ghosted", "Virtual Onsite"). Return null if not mentioned.

                        Return strictly in JSON format:
                        {
                            "company": "string or null",
                            "role": "string or null",
                            "outcome": "string or null"
                        }
                    `,
                }
            ],
            stream: false,
            response_format: {type: "json_object"}
        });

        const rawData = completion.choices[0].message.content || "{}";
        return JSON.parse(rawData);

    } catch(e: any) {
        console.error("groq extension error: ", e);
        return null;
    }
}

export async function fillInterviewData(){
    console.log("\nstarting AI data extraction for LeetCode Interviews...");

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - 2);
    const dateString = targetDate.toISOString().split('T')[0];

    const { data: rows, error } = await supabaseAdmin
        .from('latest_interviews')
        .select('id, title, url')
        .is('company', null)
        .gte('created_at', dateString)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("error", error.message);
        return;
    }

    if (!rows || rows.length === 0) {
        console.log(" no incomplete interview posts found.");
        return;
    }

    console.log(`found ${rows.length} interview posts to process.`);

    for (const row of rows) {
        console.log(`\n analyzing Title: "${row.title}"`);
        
        const details = await extractInterviewDetails(row.title);

        if (!details) {
            console.log(" AI could not parse title, skipping...");
            continue;
        }

       const lowerCompany = details.company ? String(details.company).toLowerCase() : null;
       const lowerOutcome = details.outcome ? String(details.outcome).toLowerCase() : null;
       const lowerRole = details.role ? String(details.role).toUpperCase() : null;

        console.log(`-> extracted: ${details.company} | ${details.role} | ${details.outcome}`);

        const { error: updateError } = await supabaseAdmin
            .from('latest_interviews')
            .update({
                company: lowerCompany,
                role: lowerRole,
                outcome: lowerOutcome,
            })
            .eq('id', row.id);

        if (updateError) {
            console.error("  update Failed:", updateError.message);
        } else {
            console.log(`    success! row updated.`);
        }

        await new Promise(resolve => setTimeout(resolve, 3000));
    }

    console.log("\n AI Interview processing complete!");
}