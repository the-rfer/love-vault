'use client';

import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { updateProfile } from '@/actions/settings/update';
import { ProfilePhotoSection } from './photo';
import { PersonalInfoSection } from './personal';
import { PartnerInfoSection } from './partner';
import { AccountSection } from './account';

export interface Profile {
    id: string;
    username: string;
    email: string;
    partner_name: string;
    partner_birthday: string | null;
    relationship_start_date: string;
    profile_photo_url: string | null;
}

export function Settings({
    user,
    profile: initialProfile,
}: {
    user: User;
    profile: Profile;
}) {
    const [profile, setProfile] = useState<Profile>(initialProfile);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        const result = await updateProfile(user.id, profile);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('Profile updated successfully!');
        }
        setIsSaving(false);
    };

    return (
        <div className='bg-background min-h-screen'>
            <div className='space-y-6 mx-auto p-4 max-w-2xl'>
                <ProfilePhotoSection
                    profile={profile}
                    setProfile={setProfile}
                    user={user}
                />

                <PersonalInfoSection
                    profile={profile}
                    setProfile={setProfile}
                />

                <PartnerInfoSection profile={profile} setProfile={setProfile} />

                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className='w-full'
                >
                    <Save className='mr-2 w-4 h-4' />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>

                <AccountSection />
            </div>
        </div>
    );
}
