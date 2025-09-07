'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { getCurrentUserOrRedirect } from '../auth/user';

export async function deleteMoment(momentId: string) {
    const supabase = await createClient();

    const user = await getCurrentUserOrRedirect();

    const { data: moment, error: fetchError } = await supabase
        .from('moments')
        .select('media_urls')
        .eq('id', momentId)
        .eq('user_id', user.id)
        .single();

    if (fetchError || !moment) {
        return { success: false, message: 'Moment not found.' };
    }

    const mediaUrls: string[] = moment.media_urls || [];

    await Promise.all(
        mediaUrls.map(async (url) => {
            try {
                const path = url.split('/').slice(-2).join('/');
                await supabase.storage.from('moment-media').remove([path]);
            } catch (err) {
                console.error('Failed to delete file:', url, err);
                return {
                    success: false,
                    message: 'Failed to delete moment. Try again later.',
                };
            }
        })
    );

    const { error } = await supabase
        .from('moments')
        .delete()
        .eq('id', momentId)
        .eq('user_id', user.id);

    if (error) {
        return {
            success: false,
            message: 'Failed to delete moment. Try again later.',
        };
    }

    revalidatePath('/');
    return { success: true, message: 'Moment deleted successfully!' };
}
