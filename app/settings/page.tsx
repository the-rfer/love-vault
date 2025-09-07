import { getCurrentUserOrRedirect } from '@/actions/auth/user';
import { getUserProfile } from '@/actions/profile';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Settings } from './_components/settings';

export default async function SettingsPage() {
    const user = await getCurrentUserOrRedirect();
    const profile = await getUserProfile(user.id);

    return (
        <div className='min-h-screen'>
            <div className='space-y-6 mx-auto p-4 max-w-4xl'>
                <div className='flex items-center space-x-4'>
                    <Button variant='ghost' asChild>
                        <Link href='/'>
                            <ArrowLeft className='w-4 h-4' />
                        </Link>
                    </Button>
                    <h1 className='font-bold text-2xl'>Settings</h1>
                </div>
                <Settings user={user} profile={profile} />
            </div>
        </div>
    );
}
