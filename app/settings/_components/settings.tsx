'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { updateProfile } from '@/actions/settings/update';
import { ProfilePhotoSection } from './photo';
import { PersonalInfoSection } from './personal';
import { PartnerInfoSection } from './partner';
import { AccountSection } from './account';
import { Profile } from '@/types/app';

export function Settings({
    user,
    profile: initialProfile,
}: {
    user: User;
    profile: Profile;
}) {
    const [profile, setProfile] = useState<Profile>(initialProfile);
    const [isSaving, setIsSaving] = useState(false);

    const router = useRouter();

    const handleSave = async () => {
        setIsSaving(true);
        const result = await updateProfile(user.id, profile);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('Profile updated successfully!');
        }
        setIsSaving(false);
        router.push('/');
    };

    return (
        <>
            <ProfilePhotoSection
                profile={profile}
                setProfile={setProfile}
                user={user}
            />
            <PersonalInfoSection profile={profile} setProfile={setProfile} />
            <PartnerInfoSection profile={profile} setProfile={setProfile} />
            <Button onClick={handleSave} disabled={isSaving} className='w-full'>
                <Save className='mr-2 w-4 h-4' />
                {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <AccountSection />
        </>
    );
}
