'use server';

import { createClient } from '@/lib/supabase/server';

export async function getUserProfile(userId: string) {
    const supabase = await createClient();

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    return profile;
}
