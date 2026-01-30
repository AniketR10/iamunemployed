"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType } from "../types/AuthContextType";
import { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

const AuthContext = createContext<AuthContextType>({user: null, loading: true});

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const {data: {session}} = await supabase.auth.getSession();
                setUser(session?.user ?? null);
            } catch(err) {
                console.error("auth error: ", err);
            } finally{
                setLoading(false);
            }
        };
        checkUser();

        const {data: {subscription}} = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );
        return () => {
            subscription.unsubscribe();
        }
    },[]);

    return (
        <AuthContext.Provider value={{user, loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);