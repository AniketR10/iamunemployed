import { createClient } from "@supabase/supabase-js";
import dotenv from 'dotenv';
import path from "path";

if (!process.env.SUPABASE_SERVICE_KEY){
    dotenv.config({path: path.resolve(__dirname, "../../.env")});
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey =  process.env.SUPABASE_SERVICE_KEY

if(!supabaseUrl || !supabaseServiceKey){
    throw new Error("missing supabase keys in the .env file");
}

export const supabaseAdmin = createClient(
    supabaseUrl,
    supabaseServiceKey,
)
