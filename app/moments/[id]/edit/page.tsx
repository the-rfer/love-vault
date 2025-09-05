import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { EditMomentForm } from '../../_components/edit-form';

export default async function EditMomentPage({
    params,
}: {
    params: { id: string };
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

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
