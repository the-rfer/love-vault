import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function HomePage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        // Check if user has completed onboarding
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profile && profile.username && profile.partner_name) {
            redirect('/dashboard');
        } else {
            redirect('/onboarding');
        }
    }

    redirect('/auth/login');
}
