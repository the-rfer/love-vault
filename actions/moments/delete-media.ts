import { createClient } from '@/lib/supabase/client';

export async function deleteMedia(url: string) {
    try {
        const supabase = createClient();

        const { pathname } = new URL(url);
        const path = pathname.replace('/storage/v1/object/sign/', '');

        const { error } = await supabase.storage
            .from('moment-media')
            .remove([path]);

        if (error) {
            console.error('Error deleting media:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error('Unexpected error deleting media:', err);
        return { success: false, error: 'Unexpected error' };
    }
}
