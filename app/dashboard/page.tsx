import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Loading as LoadingSpinner } from '@/components/loading';
import { ActivityCalendarClient } from './_components/activity';
import { TimelineClient } from './_components/timeline';
import { ProfileHeader } from './_components/profile-header';
import { NewMoment } from './_components/new-moment';

export default async function DashboardPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect('/auth/login');

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (!profile) redirect('/onboarding');

    const { data: moments } = await supabase
        .from('moments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

    return (
        <div className='space-y-6 mx-auto p-4 w-4xl'>
            <ProfileHeader profile={profile} />
            <NewMoment />

            <div className='relative min-h-[211px]'>
                <Suspense fallback={<LoadingSpinner variant='box' />}>
                    <ActivityCalendarClient userId={user.id} />
                </Suspense>
            </div>

            <Suspense fallback={<LoadingSpinner />}>
                <TimelineClient
                    initialMoments={moments || []}
                    userId={user.id}
                />
            </Suspense>
        </div>
    );
}
