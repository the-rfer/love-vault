import Link from 'next/link';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Heart } from 'lucide-react';
import { SignInForm } from '@/app/auth/_components/signin-form';
import { OauthForm } from '@/app/auth/_components/oauth-form';

export default function SignUpPage() {
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
                                Create Your Vault
                            </CardTitle>
                            <CardDescription className='text-muted-foreground'>
                                Start capturing your love story
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                        <SignInForm />
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
                            Already have an account?{' '}
                            <Link
                                href='/auth/login'
                                className='font-medium text-primary hover:underline'
                            >
                                Sign in
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
