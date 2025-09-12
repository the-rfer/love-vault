import { getCurrentUserOrRedirect } from '@/actions/auth/user';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { MomentDetails } from '../_components/moment-details';

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
    params: Promise<{ id: string }>;
}) {
    const user = await getCurrentUserOrRedirect();

    //TODO: receber params de error no edit
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
        <div className='min-h-screen'>
            <div className='mx-auto p-4 max-w-sm md:max-w-lg lg:max-w-4xl'>
                {/* Header */}
                <div className='mb-6'>
                    <Button variant='ghost' asChild className='mb-4'>
                        <Link href='/'>
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
