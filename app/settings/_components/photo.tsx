'use client';

import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Trash2, Camera } from 'lucide-react';
import {
    uploadProfilePhoto,
    deleteProfilePhoto,
} from '@/actions/settings/avatar';
import { useEffect, useState, type ChangeEvent } from 'react';
import { getSignedUrl } from '@/actions/signed-url';
import { Profile } from '@/types/app';

export function ProfilePhotoSection({
    profile,
    setProfile,
    user,
}: {
    profile: Profile;
    setProfile: (p: Profile) => void;
    user: User;
}) {
    const [signedUrl, setSignedUrl] = useState<string | null>(null);

    async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const res = await uploadProfilePhoto(user.id, file);

        if (res.error) toast.error(res.error);
        else if (res.url) {
            setProfile({ ...profile, profile_photo_url: res.url });
            toast.success('Profile photo updated!');
        }
    }

    async function handleDelete() {
        const res = await deleteProfilePhoto(
            user.id,
            profile.profile_photo_url!
        );

        if (res.error) toast.error(res.error);
        else {
            setProfile({ ...profile, profile_photo_url: null });
            setSignedUrl(null);
            toast.success('Profile photo deleted!');
        }
    }

    useEffect(() => {
        async function updateUrl() {
            if (!profile.profile_photo_url) return;

            const signedPhotoUrl = await getSignedUrl({
                path: profile.profile_photo_url,
                bucket: 'profile-photos',
            });

            if (signedPhotoUrl) setSignedUrl(signedPhotoUrl);
        }

        updateUrl();
    }, [profile.profile_photo_url]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Photo</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className='flex items-center space-x-4'>
                    <Avatar className='w-20 h-20'>
                        <AvatarImage src={signedUrl!} />
                        <AvatarFallback>
                            {profile.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col space-y-2'>
                        <Label
                            htmlFor='photo-upload'
                            className='cursor-pointer'
                        >
                            <Button variant='outline' asChild>
                                <span>
                                    <Camera className='mr-2 w-4 h-4' />
                                    Change Photo
                                </span>
                            </Button>
                        </Label>
                        <input
                            id='photo-upload'
                            type='file'
                            accept='image/*'
                            onChange={handleUpload}
                            className='hidden'
                        />
                        {profile.profile_photo_url && (
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={handleDelete}
                            >
                                <Trash2 className='mr-2 w-4 h-4' /> Remove Photo
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
