'use server';

import { createClient } from '@/lib/supabase/server';

interface ProfileUpdate {
    username: string;
    partner_name: string;
    partner_birthday: string | null;
    relationship_start_date: string;
}

export async function updateProfile(userId: string, profile: ProfileUpdate) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', userId);

    if (error) {
        console.error('Update error:', error);
        return { error: 'Failed to update profile' };
    }
    return { success: true };
}
