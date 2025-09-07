import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { EditMomentForm } from '../../_components/edit-form';
import { getCurrentUserOrRedirect } from '@/actions/auth/user';

export default async function EditMomentPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const supabase = await createClient();
    const user = await getCurrentUserOrRedirect();

    const { id } = await params;

    const { data: moment, error } = await supabase
        .from('moments')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (error || !moment) {
        redirect(`/moments/${id}?error=not_found`);
    }

    return <EditMomentForm user={user} moment={moment} />;
}
