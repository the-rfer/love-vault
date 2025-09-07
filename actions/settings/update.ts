'use server';

import { createClient } from '@/lib/supabase/server';
import { ProfileUpdate } from '@/types/app';

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
