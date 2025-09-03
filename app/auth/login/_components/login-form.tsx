'use client';

import { Button } from '@/components/ui/button';
import { loginAction } from '@/actions/login-action';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

    const [state, formAction, pending] = useActionState(
        loginAction,
        initialState
    );

    console.log('LoginForm state:', state);

    useEffect(() => {
        if (state.success) {
            console.log('Redirecting...');
            router.push('/dashboard');
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
                    <p className='text-red-600 text-sm'>{state.error?.email}</p>
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
                    <p className='text-red-600 text-sm'>
                        {state.error?.password}
                    </p>
                )}
            </div>
            {state.error?.general && (
                <p className='text-red-600 text-sm'>{state.error?.general}</p>
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
