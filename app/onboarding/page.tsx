import { getCurrentUserOrRedirect } from '@/actions/auth/user';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Onboarding } from './_components/onboarding';

import { Heart } from 'lucide-react';
import { getUserProfile } from '@/actions/profile';
import { redirect, RedirectType } from 'next/navigation';

export default async function OnboardingPage() {
    const user = await getCurrentUserOrRedirect();
    if (!user) redirect('/login');
    const profile = await getUserProfile(user.id);

    if (profile.isOnboarded) redirect('/', RedirectType.replace);

    return (
        <div className='flex justify-center items-center p-4 min-h-screen'>
            <div className='w-full max-w-md'>
                <Card className='bg-card/80 shadow-lg backdrop-blur-sm border-0'>
                    <CardHeader className='space-y-4 text-center'>
                        <div className='flex justify-center items-center bg-primary/10 mx-auto rounded-full w-12 h-12'>
                            <Heart className='w-6 h-6 text-primary' />
                        </div>
                        <div>
                            <CardTitle className='font-bold text-foreground text-2xl'>
                                Welcome to Your Love Vault
                            </CardTitle>
                            <CardDescription className='text-muted-foreground'>
                                Let&apos;s set up your profile to start
                                capturing beautiful moments
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <Onboarding userId={user.id} userEmail={user.email!} />
                </Card>
            </div>
        </div>
    );
}
