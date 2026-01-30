import { User } from "@supabase/supabase-js"

export type AuthContextType = {
    user: User | null;
    loading: boolean;
}