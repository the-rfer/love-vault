'use server';

import { createClient } from '@/lib/supabase/server';
import { uploadProfilePhoto } from '../settings/avatar';
import { CreateProfileArgs } from '@/types/app';

export async function createProfile(data: CreateProfileArgs) {
    const supabase = await createClient();

    let photoUrl: string | undefined = undefined;

    if (data.profilePhoto) {
        const { error, url } = await uploadProfilePhoto(
            data.userId,
            data.profilePhoto
        );

        if (error) {
            return { success: false, error };
        }

        photoUrl = url;
    }

    const { error } = await supabase.from('profiles').upsert({
        id: data.userId,
        username: data.username,
        email: data.email,
        partner_name: data.partnerName,
        partner_birthday: data.partnerBirthday || null,
        relationship_start_date: data.relationshipStartDate,
        profile_photo_url: photoUrl,
        isOnboarded: true,
    });

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}
