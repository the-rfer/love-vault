import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Plus } from 'lucide-react';
import Link from 'next/link';

export function NewMoment() {
    return (
        <div className='bg-gradient-to-r from-secondary/80 to-primary/80 p-[1px] rounded-xl'>
            <Card className='bg-gradient-to-r from-primary/80 to-secondary/80 border-0'>
                <CardContent className='px-2 md:px-6'>
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center space-x-3'>
                            <div className='hidden md:flex justify-center items-center bg-background/50 rounded-full w-10 h-10'>
                                <Heart className='w-5 h-5 text-primary' />
                            </div>
                            <div>
                                <h3 className='font-semibold text-primary-foreground'>
                                    Capture a Beautiful Moment
                                </h3>
                                <p className='text-primary-foreground text-sm'>
                                    Add something special that happened
                                </p>
                            </div>
                        </div>
                        <Button
                            asChild
                            className='bg-primary hover:bg-primary/90 text-primary-foreground'
                        >
                            <Link href='/moments/new'>
                                <Plus className='md:mr-2 w-4 h-4' />
                                <span className='hidden md:block'>
                                    Add Moment
                                </span>
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
