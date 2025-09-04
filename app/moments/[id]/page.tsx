import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUserOrRedirect } from '@/actions/auth/user';
import { MomentDetails } from '../_components/moment-details';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export interface Moment {
    id: string;
    title: string;
    description: string | null;
    moment_date: string;
    media_urls: string[] | null;
    created_at: string;
    updated_at: string;
    user_id: string;
}

export default async function MomentPage({
    params,
}: {
    params: { id: string };
}) {
    const user = await getCurrentUserOrRedirect();

    const { id } = await params;

    const supabase = await createClient();

    const { data: moment, error } = await supabase
        .from('moments')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single<Moment>();

    //TODO: handle gracefully
    if (error || !moment) return notFound();

    return (
        <div className='bg-background min-h-screen'>
            <div className='mx-auto p-4 max-w-4xl'>
                {/* Header */}
                <div className='mb-6'>
                    <Button variant='ghost' asChild className='mb-4'>
                        <Link href='/dashboard'>
                            <ArrowLeft className='mr-2 w-4 h-4' />
                            Back to Dashboard
                        </Link>
                    </Button>
                </div>

                {/* Main Content */}
                <div className='space-y-6'>
                    <MomentDetails moment={moment} />
                </div>
            </div>
        </div>
    );
}
