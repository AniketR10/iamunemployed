"use server";

import { supabaseAdmin } from "@/src/lib/supabaseAdmin";
import { error } from "console";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function adminLogin(prevState: any, formData: FormData){
    const username = formData.get('username');
    const password = formData.get('password');

    if(
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
    ) {
        (await cookies()).set('admin_session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60*60*1
        })
        redirect('/admin/dashboard')
    } else {
        return {error: "invalid credentails!"}
    }
}

export async function updateStartups(id: any, formData: FormData) {

    const cookieStore = await cookies();
    const isLoggedIn = cookieStore.get('admin_session')?.value === 'true'
    if(!isLoggedIn) throw new Error("Unauthorized")

           const names = formData.getAll('founder_name')
           const twitters = formData.getAll('founder_twitter')
           const linkedins = formData.getAll('founder_linkedin')
        
    const founders = names.map((curr, i) => ({
        name: curr,
        linkedin: linkedins[i] || "",
        twitter: twitters[i] || "",
    })).filter(f => f.name.toString().trim() !== " ");

        const data = {
            website: formData.get('website'),
            funding_amount: formData.get('funding_amount'),
            funding_round: formData.get('funding_round'),
            announced_date: formData.get('announced_date'),
            founder_socials: founders,
            source_url: formData.get('source_url'),
        }

        const {error} = await supabaseAdmin
        .from('startups')
        .update(data)
        .eq('id', id)

        if(error) {
            console.error('update error', error)
            throw new Error(error.message);
        }

        revalidatePath('/admin/dashboard')
}

export async function deleteStartup(id: any) {
    const cookieStore = await cookies();
    const isLoggedIn = cookieStore.get('admin_session')?.value === 'true';
    if(!isLoggedIn) throw new Error("Unauthorized")

        const {error} = await supabaseAdmin
        .from('startups')
        .delete()
        .eq('id', id)

        if(error) {
            console.error('update error', error)
            throw new Error(error.message);
        }

        revalidatePath('/admin/dashboard');

}

export async function fetchStartups(offset: number) {
    const {data} = await supabaseAdmin
    .from('startups')
    .select('*')
    .order('created_at', {ascending: false})
    .range(offset, offset + 9);

    return data || [];

}

export async function logOut() {
    (await cookies()).delete('admin_session')
    redirect('/admin')
}