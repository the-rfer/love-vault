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
import { Profile } from './settings';

export function ProfilePhotoSection({
    profile,
    setProfile,
    user,
}: {
    profile: Profile;
    setProfile: (p: Profile) => void;
    user: User;
}) {
    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const res = await uploadProfilePhoto(user.id, file);
        if (res.error) toast.error(res.error);
        else if (res.url) {
            setProfile({ ...profile, profile_photo_url: res.url });
            toast.success('Profile photo updated!');
        }
    };

    const handleDelete = async () => {
        const res = await deleteProfilePhoto(user.id);
        if (res.error) toast.error(res.error);
        else {
            setProfile({ ...profile, profile_photo_url: null });
            toast.success('Profile photo deleted!');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Photo</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className='flex items-center space-x-4'>
                    <Avatar className='w-20 h-20'>
                        <AvatarImage src={profile.profile_photo_url!} />
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
