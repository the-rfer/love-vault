'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function getCurrentUserOrRedirect() {
    const supabase = await createClient();
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        const message = 'You must login to access the app';
        const type = 'error';

        redirect(
            `/login?message=${encodeURIComponent(
                message
            )}&type=${encodeURIComponent(type)}`
        );
    }

    return user;
}
