'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, type Easing } from 'framer-motion';
import { CalendarIcon, ImageIcon, TimerReset } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { getSignedUrl } from '@/actions/dashboard/signed-url';

interface TimelineItem {
    id: string;
    title: string;
    description: string | null;
    moment_date: string;
    media_urls: string[] | null;
    created_at: string;
}

interface TimelineProps {
    items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

    const [signedUrls, setSignedUrls] = useState<
        Record<string, string | undefined>
    >({});

    useEffect(() => {
        async function fetchSignedUrls() {
            const urls: Record<string, string | undefined> = {};
            for (const item of items) {
                if (item.media_urls?.length) {
                    try {
                        urls[item.id] = await getSignedUrl({
                            path: item.media_urls[0],
                            bucket: 'moment-media',
                        });
                    } catch (error) {
                        console.error(
                            'Failed to fetch signed URL for item:',
                            item.id,
                            error
                        );
                    }
                }
            }
            setSignedUrls(urls);
        }
        if (items.length > 0) fetchSignedUrls();
    }, [items]);

    if (items.length === 0) {
        return (
            <Card>
                <CardContent className='p-6'>
                    <div className='py-8 text-center'>
                        <CalendarIcon className='mx-auto mb-4 w-12 h-12 text-muted-foreground' />
                        <p className='text-muted-foreground'>
                            No moments captured yet
                        </p>
                        <p className='text-muted-foreground text-sm'>
                            Start by adding your first beautiful moment!
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const containerVariants = {
        hidden: {},
        visible: {
            transition: { staggerChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1] as Easing,
            },
        },
    };

    return (
        <Card>
            <CardContent className='px-6'>
                <div className='flex items-center space-x-2 mb-4'>
                    <TimerReset className='w-5 h-5 text-primary' />
                    <h2 className='font-semibold text-lg'>Recent Moments</h2>
                </div>

                <motion.div
                    className='space-y-4'
                    variants={containerVariants}
                    initial='hidden'
                    animate='visible'
                >
                    <AnimatePresence>
                        {items.map((item, index) => {
                            const url = signedUrls[item.id];
                            return (
                                <motion.div
                                    key={item.id}
                                    variants={itemVariants}
                                    initial='hidden'
                                    animate='visible'
                                    exit={{ opacity: 0 }}
                                    className='flex space-x-4'
                                >
                                    <div className='flex flex-col items-center'>
                                        <div className='bg-primary rounded-full w-3 h-3'></div>
                                        {index < items.length - 1 && (
                                            <div className='mt-2 bg-border w-px h-16'></div>
                                        )}
                                    </div>

                                    <div className='flex-1 pb-4'>
                                        <Link
                                            href={`/moments/${item.id}`}
                                            className='block hover:bg-muted/10 -m-3 p-3 rounded-lg transition-colors'
                                        >
                                            <div className='flex justify-between items-start'>
                                                <div className='flex-1'>
                                                    <h3 className='font-medium text-foreground'>
                                                        {item.title}
                                                    </h3>
                                                    {item.description && (
                                                        <p className='mt-1 text-muted dark:text-muted-foreground text-sm line-clamp-2'>
                                                            {item.description}
                                                        </p>
                                                    )}
                                                    <p className='mt-2 text-muted dark:text-muted-foreground text-xs'>
                                                        {formatDate(
                                                            item.moment_date
                                                        )}
                                                    </p>
                                                </div>
                                                {item.media_urls?.length && (
                                                    <Avatar className='rounded-lg'>
                                                        <AvatarImage
                                                            src={
                                                                url || undefined
                                                            }
                                                            alt='moment image'
                                                        />
                                                        <AvatarFallback>
                                                            <ImageIcon className='w-6 h-6 text-muted-foreground' />
                                                        </AvatarFallback>
                                                    </Avatar>
                                                )}
                                            </div>
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            </CardContent>
        </Card>
    );
}
