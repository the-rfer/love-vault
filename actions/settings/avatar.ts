'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function uploadProfilePhoto(userId: string, file: File) {
    const supabase = await createClient();
    // const ext = file.name.split('.').pop();
    // const path = `${userId}/profile.${ext}`;
    const path = `${userId}/profile`;

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

export async function deleteProfilePhoto(userId: string, photoUrl: string) {
    const supabase = await createClient();

    // remove current photo
    try {
        const { pathname } = new URL(photoUrl);

        const path = pathname.replace(
            '/storage/v1/object/public/profile-photos/',
            ''
        );

        const { error } = await supabase.storage
            .from('profile-photos')
            .remove([path]);

        if (error) {
            console.error('Error deleting media:', error);
            return { success: false, error: error.message };
        }

        console.log('Successfully deleted file from bucket');
    } catch (err) {
        console.error('Unexpected error deleting media:', err);
        return { success: false, error: 'Unexpected error' };
    }

    const { error } = await supabase
        .from('profiles')
        .update({ profile_photo_url: null })
        .eq('id', userId);

    if (error) return { error: 'Failed to delete photo' };

    revalidatePath('/settings');

    return { success: true };
}
