import { supabaseAdmin } from "@/src/lib/supabaseAdmin";
import { NextResponse } from "next/server";


export async function GET() {
    const {data, error} = await supabaseAdmin.rpc('get_unique_subreddits');

    if(error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }

    const subreddits = data.map((item: any) => item.subreddit);

    return NextResponse.json(subreddits);

}