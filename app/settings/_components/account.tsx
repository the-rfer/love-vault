'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut } from 'lucide-react';
import { signOutUser } from '@/actions/settings/logout';
import { useRouter } from 'next/navigation';

export function AccountSection() {
    const router = useRouter();
    const handleSignOut = async () => {
        await signOutUser();
        router.push('/login');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent>
                <Button
                    variant='outline'
                    onClick={handleSignOut}
                    className='w-full'
                >
                    <LogOut className='mr-2 w-4 h-4' /> Sign Out
                </Button>
            </CardContent>
        </Card>
    );
}
