'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signinAction } from '@/actions/auth/signin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const initialState = {
    error: {
        email: undefined,
        password: undefined,
        confirmPassword: undefined,
        general: undefined,
    },
    success: false,
};

export function SignInForm() {
    const router = useRouter();

    const [state, formAction, pending] = useActionState(
        signinAction,
        initialState
    );

    useEffect(() => {
        if (state.success) {
            router.push('/check-email');
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
            <div className='space-y-2'>
                <Label htmlFor='password'>Confirm Password</Label>
                <Input
                    id='confirmPassword'
                    name='confirmPassword'
                    type='password'
                    placeholder='Confirm your password'
                    required
                    className='h-11'
                />
                {state.error?.confirmPassword && (
                    <p className='text-destructive text-sm'>
                        {state.error?.confirmPassword}
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
                    : 'sign up'}
            </Button>
        </form>
    );
}
