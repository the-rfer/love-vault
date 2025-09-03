'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { fetchMoments } from '@/actions/dashboard/moments';
import { type Moment } from '../types';
import { Timeline } from '@/components/timeline';
import { Loading } from '@/components/loading';

export function TimelineClient({
    initialMoments,
    userId,
}: {
    initialMoments: Moment[];
    userId: string;
}) {
    const [moments, setMoments] = useState(initialMoments);
    const [offset, setOffset] = useState(initialMoments.length);
    const [isPending, startTransition] = useTransition();
    const [hasMore, setHasMore] = useState(initialMoments.length === 20);

    const loaderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!loaderRef.current || !hasMore) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isPending) {
                startTransition(async () => {
                    const more = await fetchMoments(userId, offset);
                    setMoments((prev) => [...prev, ...more]);
                    setOffset((prev) => prev + more.length);
                    setHasMore(more.length === 20);
                });
            }
        });

        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [offset, hasMore, isPending, userId]);

    return (
        <div className='space-y-4'>
            <Timeline items={moments} />

            {hasMore && (
                <div ref={loaderRef} className='flex justify-center p-4'>
                    {isPending && <Loading />}
                </div>
            )}
        </div>
    );
}
