import Link from 'next/link';
import { Heart } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LoginForm } from '@/app/auth/_components/login-form';
import { OauthForm } from '@/app/auth/_components/oauth-form';

export default async function LoginPage() {
    return (
        <div className='flex justify-center items-center p-4 min-h-screen'>
            <div className='w-full max-w-md'>
                <Card className='bg-card/80 shadow-lg backdrop-blur-sm border-0'>
                    <CardHeader className='space-y-4 text-center'>
                        <div className='flex justify-center items-center bg-primary/10 mx-auto rounded-full w-12 h-12'>
                            <Heart className='w-6 h-6 text-primary' />
                        </div>
                        <div>
                            <CardTitle className='font-bold text-foreground text-2xl'>
                                Welcome Back
                            </CardTitle>
                            <CardDescription className='text-muted-foreground'>
                                Sign in to your love vault
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className='space-y-6'>
                        <LoginForm />

                        <div className='relative'>
                            <div className='absolute inset-0 flex items-center'>
                                <Separator className='w-full' />
                            </div>
                            <div className='relative flex justify-center text-xs uppercase'>
                                <span className='bg-card px-2 text-muted-foreground'>
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        {/* OAuth Buttons, grid templace to facilitate adding oauth providers in the future */}
                        <div className='gap-3 grid grid-cols-1'>
                            <OauthForm provider={'google'} />
                        </div>

                        <div className='text-muted-foreground text-sm text-center'>
                            Don&apos;t have an account?{' '}
                            <Link
                                href='/auth/sign-up'
                                className='font-medium text-primary hover:underline'
                            >
                                Sign up
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
