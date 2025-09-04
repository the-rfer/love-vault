'use client';

import { useState, useTransition, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { fetchMoments } from '@/actions/dashboard/moments';
import { Timeline } from '@/app/dashboard/_components/timeline-items';
import { Loading } from '@/components/loading';
import { type Moment } from '../types';

export function TimelineClient({ userId }: { userId: string }) {
    const [moments, setMoments] = useState<Moment[]>([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    const { ref, inView } = useInView({ threshold: 0.2 });

    useEffect(() => {
        startTransition(async () => {
            setLoading(true);
            const initial = await fetchMoments(userId, 0);
            setMoments(initial);
            setOffset(initial.length);
            setHasMore(initial.length === 10);
            setLoading(false);
        });
    }, [userId]);

    useEffect(() => {
        if (inView && hasMore && !isPending) {
            startTransition(async () => {
                const more = await fetchMoments(userId, offset);
                setMoments((prev) => [...prev, ...more]);
                setOffset((prev) => prev + more.length);
                setHasMore(more.length === 10);
            });
        }
    }, [inView, hasMore, isPending, offset, userId]);

    if (loading) {
        return (
            <div className='flex justify-center p-8'>
                <Loading />
            </div>
        );
    }

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
