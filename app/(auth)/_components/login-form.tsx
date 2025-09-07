'use client';

import { useActionState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginAction } from '@/actions/auth/login';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const initialState = {
    error: {
        email: undefined,
        password: undefined,
        general: undefined,
    },
    success: false,
};

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const message = searchParams.get('message');
        const type = searchParams.get('type');

        if (message && type) {
            switch (type) {
                case 'error':
                    toast.error(message);
                    break;
                case 'success':
                    toast.success(message);
                    break;
                default:
                    toast.info(message);
                    break;
            }
        }
    }, [searchParams]);

    const [state, formAction, pending] = useActionState(
        loginAction,
        initialState
    );

    useEffect(() => {
        if (state.success) {
            router.push('/');
        }
    }, [state.success, router]);

    return (
        <form action={formAction} className='space-y-4'>
            <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                    id='email'
                    name='email'
                    type='email'
                    placeholder='your@email.com'
                    required
                    className='h-11'
                />
                {state.error?.email && (
                    <p className='text-destructive text-sm'>
                        {state.error?.email}
                    </p>
                )}
            </div>
            <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <Input
                    id='password'
                    name='password'
                    type='password'
                    placeholder='Enter your password'
                    required
                    className='h-11'
                />
                {state.error?.password && (
                    <p className='text-destructive text-sm'>
                        {state.error?.password}
                    </p>
                )}
            </div>
            {state.error?.general && (
                <p className='text-destructive text-sm'>
                    {state.error?.general}
                </p>
            )}
            <Button
                type='submit'
                className='w-full h-11'
                disabled={pending || state.success}
            >
                {pending
                    ? 'Please wait…'
                    : state.success
                    ? 'Redirecting...'
                    : 'sign in'}
            </Button>
        </form>
    );
}
