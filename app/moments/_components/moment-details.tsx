'use client';

import { useTransition, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Moment } from '../[id]/page';
import { getSignedUrl } from '@/actions/signed-url';
import { deleteMoment } from '@/actions/moments/delete';

import { Details } from './details';
import { Gallery } from './gallery';
import { TimelineInfo } from './timeline-info';

export interface SignedMedia {
    url: string;
    type: 'image' | 'video' | 'other';
}

export function MomentDetails({ moment }: { moment: Moment }) {
    const router = useRouter();

    const [isPending, startTransition] = useTransition();
    const [signedUrls, setSignedUrls] = useState<SignedMedia[]>([]);
    const [isSigning, setIsSigning] = useState(true);

    async function handleDelete(): Promise<void> {
        startTransition(async () => {
            const result = await deleteMoment(moment.id);

            if (result.success) {
                toast.success(result.message);
                router.push('/dashboard');
            } else {
                toast.error(result.message);
            }
        });
    }

    useEffect(() => {
        async function fetchSignedUrls() {
            setIsSigning(true);

            const signed: SignedMedia[] = [];

            for (const url of moment.media_urls || []) {
                if (url) {
                    try {
                        const signedUrl = await getSignedUrl({
                            path: url,
                            bucket: 'moment-media',
                        });

                        if (!signedUrl) continue;

                        let type: 'image' | 'video' | 'other' = 'other';
                        if (/\.(jpg|jpeg|png|webp)$/i.test(url)) type = 'image';
                        else if (/\.(mp4|mov|webm)$/i.test(url)) type = 'video';

                        signed.push({ url: signedUrl, type });
                    } catch (error) {
                        console.error('Failed to fetch signed URL:', error);
                    } finally {
                        setIsSigning(false);
                    }
                }
            }

            setSignedUrls(signed);
        }

        if (moment.media_urls && moment.media_urls.length > 0) {
            fetchSignedUrls();
        } else {
            setIsSigning(false);
        }
    }, [moment]);

    return (
        <div className='space-y-6'>
            <Details
                moment={moment}
                isPending={isPending}
                handleDelete={handleDelete}
            />

            <Gallery signedUrls={signedUrls} isSigning={isSigning} />

            <TimelineInfo moment={moment} />
        </div>
    );
}
