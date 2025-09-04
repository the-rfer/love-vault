'use client';

import { useState } from 'react';
import { ImageIcon, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ImageLoader } from './image-loader';
import { Loading } from '@/components/loading';
import { SignedMedia } from './moment-details';

export function Gallery({
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
