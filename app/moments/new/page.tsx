import { NewMomentForm } from '../_components/new-moment';
import { getCurrentUserOrRedirect } from '@/actions/auth/user';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function NewMomentPage() {
    const user = await getCurrentUserOrRedirect();

    return (
        <div className='min-h-screen'>
            <div className='mx-auto p-4 max-w-4xl'>
                <div className='mb-6'>
                    <Button variant='ghost' asChild className='mb-4'>
                        <Link href='/'>
                            <ArrowLeft className='mr-2 w-4 h-4' />
                            Back to Dashboard
                        </Link>
                    </Button>
                </div>

                <Card className='bg-card/80 shadow-lg backdrop-blur-sm border-0'>
                    <CardHeader className='space-y-4 text-center'>
                        <div className='flex justify-center items-center bg-primary/10 mx-auto rounded-full w-12 h-12'>
                            <Heart className='w-6 h-6 text-primary' />
                        </div>
                        <div>
                            <CardTitle className='font-bold text-foreground text-2xl'>
                                Capture a Beautiful Moment
                            </CardTitle>
                            <CardDescription className='text-muted-foreground'>
                                Share something special that happened today
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <NewMomentForm user={user} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
