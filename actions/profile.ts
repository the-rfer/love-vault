'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function getUserProfile(userId: string) {
    const supabase = await createClient();

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (!profile) redirect('/onboarding');

    return profile;
}
