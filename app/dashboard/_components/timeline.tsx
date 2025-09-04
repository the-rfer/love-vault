'use client';

import { useState, useTransition, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { fetchMoments } from '@/actions/dashboard/moments';
import { Timeline } from '@/app/dashboard/_components/timeline-items';
import { Loading } from '@/components/loading';
import { type Moment } from '../types';

export function TimelineClient({
    initialMoments,
    userId,
}: {
    initialMoments: Moment[];
    userId: string;
}) {
    const [moments, setMoments] = useState(initialMoments);
    const [offset, setOffset] = useState(initialMoments.length);
    const [hasMore, setHasMore] = useState(initialMoments.length === 10);
    const [isPending, startTransition] = useTransition();

    const { ref, inView } = useInView({ threshold: 0.1 });

    // Load more when in view
    useEffect(() => {
        if (inView && hasMore && !isPending) {
            startTransition(async () => {
                const more = await fetchMoments(userId, offset);
                setMoments((prev) => [...prev, ...more]);
                setOffset((prev) => prev + more.length);
                setHasMore(more.length === 20);
            });
        }
    }, [inView, hasMore, isPending, offset, userId]);

    return (
        <div className='space-y-4'>
            <Timeline items={moments} />

            {hasMore && (
                <div ref={ref} className='flex justify-center p-4'>
                    <Loading />
                </div>
            )}

            {!hasMore && moments.length > 0 && (
                <div className='py-4 text-foreground dark:text-muted-foreground text-sm text-center'>
                    There are no more moments
                </div>
            )}
        </div>
    );
}
