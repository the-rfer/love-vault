import { getSignedUrl } from '@/actions/signed-url';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Profile } from '@/types/app';
import { Settings } from 'lucide-react';
import Link from 'next/link';

export async function ProfileHeader({ profile }: { profile: Profile }) {
    const signedUrl = await getSignedUrl({
        path: profile.profile_photo_url,
        bucket: 'profile-photos',
    });

    return (
        <div className='flex justify-between items-center'>
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

            <div className='flex md:flex-row flex-col items-center md:space-x-2 space-y-2 md:space-y-0'>
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
