import { createClient } from "@supabase/supabase-js";
import { spawn } from "child_process";
import dotenv from 'dotenv'
import path, { resolve } from "path";
import { supabaseAdmin } from "./supabaseAdmin";
import { fillData } from "./fillUrl";


dotenv.config({path: path.resolve(__dirname, '../../.env')});

const SCRAPERS = path.resolve(__dirname, '../../scripts/scrapers')

const scraper_list = [
  "healthcareittoday.py",
  "techcrunch.py",
  "theaiinsider.py",
  "thesassnews.py",
  "twitter.py",
  "entrackr.py",
  "techmeme.py",
]

function cleanTitle(title: string) {
    return title
        .replace(/https?:\/\/\S+/g, '')
        .replace(/#\w+/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

async function runScripts(scriptName: string) {
    return new Promise<void>((resolve, reject) => {
        console.log(`running ${scriptName}`);

       const scriptPath = path.join(SCRAPERS, scriptName);
       const pythonCommand = 'python';
       const python = spawn(pythonCommand, [scriptPath])
       
       let buffer = ''

       python.stdout.on('data', (data) => {
            const text = data.toString();
            buffer += text;

            if(!text.includes("__DATA_START__")){
                process.stdout.write(text);
            }
        });

       python.stderr.on('data', (data) => {
        console.error(`Error: ${data}`)
       });

       python.on('close', async (code) => {
        if (code !== 0){
            console.error(`scriptName: ${scriptName} exited with error: ${code}`)
            return resolve();
       }

       const match = buffer.match(/__DATA_START__(.*?)__DATA_END__/s);

       if (match && match[1]) {
        try {
            const articles = JSON.parse(match[1]);
            console.log(`recieved ${articles.length} articles.`)

            if (articles.length > 0){
                const {error} = await supabaseAdmin
                .from('startups')
                .upsert(articles.map((a: any) => ({
                    name: cleanTitle(a.title),
                    source_url: a.link,
                    announced_date: a.date,
                    source: a.source
                })),
                {
                    onConflict: 'source_url',
                    ignoreDuplicates: true,
                });

                if (error) {
                    console.error(" supabase upload error: ", error.message)
                } else {
                    console.log("saved to startups table!")
                }
            } else {
                console.log("no new articles to save");
            }
        } catch(e) {
            console.error("json parser error: ", e)
        }
       } else {
         console.log("no data returned...")
       }
       resolve();
    });
  });
}

(async () => {
    console.log("starting scraper pipeline");
    for (const script of scraper_list){
        await runScripts(script);
    }
    console.log("\n Scrapers finished. Now ai will fil the remaining details...");
    await fillData();
    console.log("pipeline completed!")
})();