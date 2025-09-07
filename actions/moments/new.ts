'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function createMoment(formData: FormData, userId: string) {
    const supabase = await createClient();

    try {
        const title = (formData.get('title') as string)?.trim();
        const description =
            (formData.get('description') as string)?.trim() || null;
        const momentDate = formData.get('momentDate') as string;

        if (!title) {
            return { error: 'Title is required' };
        }

        const files = formData.getAll('files') as File[];

        const mediaUrls: string[] = [];
        for (const file of files) {
            const ext = file.name.split('.').pop();
            const path = `${userId}/${Date.now()}-${Math.random()
                .toString(36)
                .slice(2)}.${ext}`;

            const { error: uploadError } = await supabase.storage
                .from('moment-media')
                .upload(path, file);

            if (uploadError) throw uploadError;

            const {
                data: { publicUrl },
            } = supabase.storage.from('moment-media').getPublicUrl(path);
            mediaUrls.push(publicUrl);
        }

        const { error } = await supabase.from('moments').insert({
            user_id: userId,
            title,
            description,
            moment_date: momentDate,
            media_urls: mediaUrls.length > 0 ? mediaUrls : null,
        });

        if (error) throw error;

        revalidatePath('/');
        return { success: true };
    } catch (err) {
        console.error('Error creating moment:', err);
        return { error: 'Failed to create moment. Please try again.' };
    }
}
