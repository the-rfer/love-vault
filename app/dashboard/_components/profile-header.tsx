import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings } from 'lucide-react';
import { getSignedUrl } from '@/actions/dashboard/signed-url';
import { type Profile } from '@/app/dashboard/types';

export async function ProfileHeader({ profile }: { profile: Profile }) {
    const signedUrl = await getSignedUrl({
        path: profile.profile_photo_url,
        bucket: 'profile-photos',
    });

    return (
        <div className='flex justify-between items-center'>
            {/* Avatar + Greeting */}
            <div className='flex items-center space-x-4'>
                <Avatar className='w-12 h-12'>
                    <AvatarImage src={signedUrl} alt={profile.username} />
                    <AvatarFallback className='bg-primary/10 text-primary'>
                        {profile.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h1 className='font-bold text-foreground text-2xl'>
                        Hello {profile.username} 👋
                    </h1>
                    <p className='text-muted-foreground'>
                        Welcome to {profile.partner_name}&apos;s vault!
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className='flex items-center space-x-2'>
                <ThemeToggle />
                <Button
                    variant='outline'
                    size='icon'
                    asChild
                    className='bg-transparent'
                >
                    <Link href='/settings'>
                        <Settings className='w-4 h-4' />
                    </Link>
                </Button>
            </div>
        </div>
    );
}
