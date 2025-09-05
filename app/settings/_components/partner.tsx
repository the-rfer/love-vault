'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Profile } from './settings';

export function PartnerInfoSection({
    profile,
    setProfile,
}: {
    profile: Profile;
    setProfile: (p: Profile) => void;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Partner Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className='space-y-2'>
                    <Label>Partner&apos;s Name</Label>
                    <Input
                        value={profile.partner_name}
                        onChange={(e) =>
                            setProfile({
                                ...profile,
                                partner_name: e.target.value,
                            })
                        }
                    />
                </div>
                <div className='space-y-2'>
                    <Label>Partner&apos;s Birthday</Label>
                    <Input
                        type='date'
                        value={profile.partner_birthday || ''}
                        onChange={(e) =>
                            setProfile({
                                ...profile,
                                partner_birthday: e.target.value,
                            })
                        }
                    />
                </div>
                <div className='space-y-2'>
                    <Label>Relationship Start</Label>
                    <Input
                        type='date'
                        value={profile.relationship_start_date}
                        onChange={(e) =>
                            setProfile({
                                ...profile,
                                relationship_start_date: e.target.value,
                            })
                        }
                    />
                </div>
            </CardContent>
        </Card>
    );
}
