'use server';

import { createClient } from '@/lib/supabase/server';

export async function uploadProfilePhoto(userId: string, file: File) {
    const supabase = await createClient();
    const ext = file.name.split('.').pop();
    const path = `${userId}/profile.${ext}`;

    const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(path, file, { upsert: true });

    if (uploadError) return { error: 'Upload failed' };

    const { data } = supabase.storage.from('profile-photos').getPublicUrl(path);

    const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_photo_url: data.publicUrl })
        .eq('id', userId);

    if (updateError) return { error: 'Failed to update profile photo' };
    return { url: data.publicUrl };
}

export async function deleteProfilePhoto(userId: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('profiles')
        .update({ profile_photo_url: null })
        .eq('id', userId);

    if (error) return { error: 'Failed to delete photo' };
    return { success: true };
}
