'use client';

import Link from 'next/link';
import { useTransition, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { formatDate, formatTime } from '@/lib/utils';
import { getSignedUrl } from '@/actions/signed-url';
import { deleteMoment } from '@/actions/moments/delete';
import {
    Heart,
    Edit,
    Calendar,
    Clock,
    ImageIcon,
    Video,
    Trash2,
} from 'lucide-react';

import { Moment } from '../[id]/page';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { ImageLoader } from './image-loader';
import { Loading } from '@/components/loading';

interface SignedMedia {
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

function Details({
    moment,
    isPending,
    handleDelete,
}: {
    moment: Moment;
    isPending: boolean;
    handleDelete: () => Promise<void>;
}) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    return (
        <Card className='bg-card/80 shadow-lg backdrop-blur-sm border-0'>
            <CardHeader>
                <CardTitle>{moment.title}</CardTitle>
            </CardHeader>
            <CardContent className='p-6'>
                <div className='flex justify-between items-start mb-4'>
                    <div className='flex items-center space-x-3'>
                        <div className='flex justify-center items-center bg-primary/20 rounded-full w-10 h-10'>
                            <Heart className='w-5 h-5 text-primary' />
                        </div>
                        <div>
                            <h1 className='font-bold text-foreground text-2xl'>
                                {moment.title}
                            </h1>
                            <div className='flex items-center space-x-4 mt-2'>
                                <div className='flex items-center space-x-1 text-muted dark:text-muted-foreground text-sm'>
                                    <Calendar className='w-4 h-4' />
                                    <span>
                                        {formatDate(moment.moment_date)}
                                    </span>
                                </div>
                                <div className='flex items-center space-x-1 text-muted dark:text-muted-foreground text-sm'>
                                    <Clock className='w-4 h-4' />
                                    <span>
                                        Added {formatTime(moment.created_at)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Button
                            variant='outline'
                            asChild
                            className='bg-transparent'
                        >
                            <Link href={`/moments/${moment.id}/edit`}>
                                <Edit className='mr-2 w-4 h-4' />
                                Edit
                            </Link>
                        </Button>
                        <Button
                            variant='destructive'
                            onClick={() => setShowDeleteDialog(true)}
                            disabled={isPending}
                        >
                            <Trash2 className='mr-2 w-4 h-4' />
                            {isPending ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </div>

                {moment.description && (
                    <div className='max-w-none prose prose-sm'>
                        <p className='text-foreground leading-relaxed'>
                            {moment.description}
                        </p>
                    </div>
                )}

                {moment.updated_at !== moment.created_at && (
                    <div className='mt-4 pt-4 border-t border-border'>
                        <Badge variant='secondary' className='text-xs'>
                            Last updated {formatTime(moment.updated_at)}
                        </Badge>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                <Dialog
                    open={showDeleteDialog}
                    onOpenChange={setShowDeleteDialog}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete this moment?</DialogTitle>
                        </DialogHeader>
                        <p className='text-muted-foreground text-sm'>
                            This action cannot be undone. Are you sure you want
                            to continue?
                        </p>
                        <DialogFooter>
                            <Button
                                variant='outline'
                                onClick={() => setShowDeleteDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant='destructive'
                                disabled={isPending}
                                onClick={() => {
                                    setShowDeleteDialog(false);
                                    handleDelete();
                                }}
                            >
                                {isPending ? 'Deleting...' : 'Delete'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}

function Gallery({
    signedUrls,
    isSigning,
}: {
    signedUrls: SignedMedia[];
    isSigning: boolean;
}) {
    const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(
        null
    );

    return (
        <>
            <Card className='bg-card/80 shadow-lg backdrop-blur-sm border-0'>
                <CardContent className='p-6'>
                    <h2 className='flex items-center mb-4 font-semibold text-lg'>
                        <ImageIcon className='mr-2 w-5 h-5 text-primary' />
                        Media
                        {signedUrls.length > 0 && (
                            <span className='ml-2 text-muted-foreground text-sm'>
                                ({signedUrls.length})
                            </span>
                        )}
                    </h2>

                    {isSigning ? (
                        <div className='flex justify-center items-center py-12'>
                            <Loading />
                        </div>
                    ) : signedUrls.length === 0 ? (
                        <p className='py-12 text-muted-foreground text-center'>
                            No media available
                        </p>
                    ) : (
                        <div className='gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                            {signedUrls.map((media, index) => (
                                <div
                                    key={index}
                                    className='relative bg-muted hover:opacity-90 rounded-lg w-full aspect-square overflow-hidden transition-opacity cursor-pointer'
                                    onClick={() => setSelectedMediaIndex(index)}
                                >
                                    {media.type === 'image' ? (
                                        <ImageLoader
                                            src={media.url}
                                            alt={`Media ${index + 1}`}
                                        />
                                    ) : media.type === 'video' ? (
                                        <div className='flex justify-center items-center bg-muted w-full h-full'>
                                            <Video className='w-12 h-12 text-muted-foreground' />
                                            <video
                                                src={media.url}
                                                className='absolute inset-0 w-full h-full object-cover'
                                                muted
                                                playsInline
                                            />
                                        </div>
                                    ) : (
                                        <div className='flex justify-center items-center bg-muted w-full h-full'>
                                            <ImageIcon className='w-12 h-12 text-muted-foreground' />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
            <GalleryModal
                selectedMediaIndex={selectedMediaIndex}
                setSelectedMediaIndex={setSelectedMediaIndex}
                signedUrls={signedUrls}
            />
        </>
    );
}

function GalleryModal({
    selectedMediaIndex,
    signedUrls,
    setSelectedMediaIndex,
}: {
    selectedMediaIndex: number | null;
    signedUrls: SignedMedia[];
    setSelectedMediaIndex: (value: number | null) => void;
}) {
    return (
        selectedMediaIndex !== null &&
        signedUrls.length > 0 && (
            <div
                className='z-50 fixed inset-0 flex justify-center items-center bg-black/80 p-4'
                onClick={() => setSelectedMediaIndex(null)}
            >
                <div className='relative max-w-4xl max-h-full'>
                    <Button
                        variant='ghost'
                        size='icon'
                        className='top-4 right-4 z-10 absolute bg-black/50 hover:bg-black/70 text-white'
                        onClick={() => setSelectedMediaIndex(null)}
                    >
                        X
                    </Button>

                    {(() => {
                        const media = signedUrls[selectedMediaIndex];
                        if (!media) return null;

                        if (media.type === 'image') {
                            return (
                                <ImageLoader
                                    src={media.url}
                                    alt={`Media ${selectedMediaIndex + 1}`}
                                    large
                                />
                            );
                        }

                        if (media.type === 'video') {
                            return (
                                <video
                                    src={media.url}
                                    controls
                                    className='rounded-lg max-w-full max-h-full'
                                    autoPlay
                                />
                            );
                        }

                        return null;
                    })()}
                </div>
            </div>
        )
    );
}

function TimelineInfo({ moment }: { moment: Moment }) {
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
