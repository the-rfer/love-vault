'use client';

import { formatDate } from '@/lib/utils';
import { Moment } from '../[id]/page';
import { Card, CardContent } from '@/components/ui/card';

export function TimelineInfo({ moment }: { moment: Moment }) {
    return (
        <Card className='bg-card/80 shadow-lg backdrop-blur-sm border-0'>
            <CardContent className='p-6'>
                <h2 className='mb-4 font-semibold text-lg'>Timeline Context</h2>
                <div className='space-y-3'>
                    <div className='flex justify-between items-center bg-muted/50 p-3 rounded-lg'>
                        <span className='text-muted-foreground text-sm'>
                            Moment Date
                        </span>
                        <span className='font-medium'>
                            {formatDate(moment.moment_date)}
                        </span>
                    </div>
                    <div className='flex justify-between items-center bg-muted/50 p-3 rounded-lg'>
                        <span className='text-muted-foreground text-sm'>
                            Created
                        </span>
                        <span className='font-medium'>
                            {formatDate(moment.created_at)}
                        </span>
                    </div>
                    {moment.updated_at !== moment.created_at && (
                        <div className='flex justify-between items-center bg-muted/50 p-3 rounded-lg'>
                            <span className='text-muted-foreground text-sm'>
                                Last Updated
                            </span>
                            <span className='font-medium'>
                                {formatDate(moment.updated_at)}
                            </span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
