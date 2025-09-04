'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { getCurrentUserOrRedirect } from '../auth/user';

export async function deleteMoment(momentId: string) {
    const supabase = await createClient();

    const user = await getCurrentUserOrRedirect();

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

    revalidatePath('/dashboard');
    return { success: true, message: 'Moment deleted successfully!' };
}
