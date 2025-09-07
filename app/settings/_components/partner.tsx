'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/date-picker';
import { formatDateToLocalString } from '@/lib/utils';
import { Profile } from '@/types/app';

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

                    <DatePicker
                        date={
                            profile.partner_birthday
                                ? new Date(profile.partner_birthday)
                                : undefined
                        }
                        onDateChange={(date) =>
                            setProfile({
                                ...profile,
                                partner_birthday: formatDateToLocalString(
                                    date
                                ) as string,
                            })
                        }
                    />
                </div>
                <div className='space-y-2'>
                    <Label>Relationship Start</Label>

                    <DatePicker
                        date={new Date(profile.relationship_start_date)}
                        onDateChange={(date) => {
                            if (date) {
                                setProfile({
                                    ...profile,
                                    relationship_start_date:
                                        formatDateToLocalString(date) as string,
                                });
                            }
                        }}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
