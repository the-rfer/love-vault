'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Profile } from './settings';

export function PersonalInfoSection({
    profile,
    setProfile,
}: {
    profile: Profile;
    setProfile: (p: Profile) => void;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className='space-y-2'>
                    <Label>Your Name</Label>
                    <Input
                        value={profile.username}
                        onChange={(e) =>
                            setProfile({ ...profile, username: e.target.value })
                        }
                    />
                </div>
                <div className='space-y-2'>
                    <Label>Email</Label>
                    <Input value={profile.email} disabled />
                    <p className='text-muted-foreground text-xs'>
                        Email cannot be changed from here.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
