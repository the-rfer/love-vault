import Link from 'next/link';
import { Heart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function NewMoment() {
    return (
        <Card className='bg-gradient-to-r from-primary/50 dark:from-primary/80 to-secondary/50 dark:to-secondary/80 dark:border-primary/20'>
            <CardContent className='px-6'>
                <div className='flex justify-between items-center'>
                    <div className='flex items-center space-x-3'>
                        <div className='flex justify-center items-center bg-background/50 rounded-full w-10 h-10'>
                            <Heart className='w-5 h-5 text-primary' />
                        </div>
                        <div>
                            <h3 className='font-semibold text-primary-foreground'>
                                Capture a Beautiful Moment
                            </h3>
                            <p className='text-primary-foreground text-sm'>
                                Add something special that happened today
                            </p>
                        </div>
                    </div>
                    <Button
                        asChild
                        className='bg-primary/70 hover:bg-primary/90 dark:bg-primary text-primary-foreground'
                    >
                        <Link href='/moments/new'>
                            <Plus className='mr-2 w-4 h-4' />
                            Add Moment
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
