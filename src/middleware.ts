import { NextRequest, NextResponse } from "next/server";
import {createServerClient} from '@supabase/ssr'

export async function middleware(req: NextRequest) {
    
    let res = NextResponse.next({
        request: {
            headers: req.headers
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return req.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({name, value}) => req.cookies.set(name, value))
                    res = NextResponse.next({
                        request: {
                            headers: req.headers
                        }
                    })
                    cookiesToSet.forEach(({name, value, options}) => res.cookies.set(name, value, options))
                }
            }
        }
    )

    const {data} = await supabase.auth.getUser();


    const user = data?.user

    if((req.nextUrl.pathname.startsWith('/auth') || req.nextUrl.pathname.startsWith('/login')) && user){
        const url = req.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    return res;

}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};