import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Heart, Mail } from 'lucide-react';

export default function CheckEmailPage() {
    return (
        <div className='flex justify-center items-center bg-gradient-to-br from-background to-card p-4 min-h-screen'>
            <div className='w-full max-w-md'>
                <Card className='bg-card/80 shadow-lg backdrop-blur-sm border-0'>
                    <CardHeader className='space-y-4 text-center'>
                        <div className='flex justify-center items-center bg-primary/10 mx-auto rounded-full w-12 h-12'>
                            <Mail className='w-6 h-6 text-primary' />
                        </div>
                        <div>
                            <CardTitle className='font-bold text-foreground text-2xl'>
                                Check Your Email
                            </CardTitle>
                            <CardDescription className='text-muted-foreground'>
                                We&apos;ve sent you a confirmation link
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className='space-y-6 text-center'>
                        <div className='space-y-2'>
                            <p className='text-muted-foreground text-sm'>
                                Please check your email and click the
                                confirmation link to activate your account.
                            </p>
                            <p className='text-muted-foreground text-sm'>
                                Once confirmed, you&apos;ll be redirected to
                                complete your profile setup.
                            </p>
                        </div>
                        <div className='flex justify-center items-center space-x-2 text-primary'>
                            <Heart className='w-4 h-4' />
                            <span className='font-medium text-sm'>
                                Almost there!
                            </span>
                            <Heart className='w-4 h-4' />
                        </div>
                        <Button
                            asChild
                            variant='outline'
                            className='bg-transparent w-full'
                        >
                            <Link href='/login'>Back to Sign In</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
