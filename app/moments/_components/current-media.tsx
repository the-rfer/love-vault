'use client';

import { type Dispatch, type SetStateAction } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Trash2, Video, ImageIcon } from 'lucide-react';
import { ImageLoader } from './image-loader';
import { Loading } from '@/components/loading';
import { deleteMedia } from '@/actions/moments/delete-media';
import { SignedMediaWithOriginal } from './edit-form';

export function CurrentMedia({
    isSigning,
    signedUrls,
    setExistingMediaUrls,
    setSignedUrls,
    setRemovedMediaUrls,
}: {
    isSigning: boolean;
    signedUrls: SignedMediaWithOriginal[];
    setExistingMediaUrls: Dispatch<SetStateAction<string[]>>;
    setSignedUrls: Dispatch<SetStateAction<SignedMediaWithOriginal[]>>;
    setRemovedMediaUrls: Dispatch<SetStateAction<string[]>>;
}) {
    async function removeExistingMedia(index: number) {
        if (!signedUrls[index]) return;

        const media = signedUrls[index];

        // Optimistically remove from UI
        setSignedUrls((prev) => prev.filter((_, i) => i !== index));

        // Remove from existingMediaUrls if it's an existing URL
        setExistingMediaUrls((prev) =>
            prev.filter((url) => url !== media.originalUrl)
        );

        // fix at 5am, double check later. tracking to remove from bucket.
        setRemovedMediaUrls((prev) => [...prev, media.originalUrl]);

        const result = await deleteMedia(media.url);

        if (!result.success) {
            toast.error(result.error || 'Failed to delete media from server');

            // Revert if deletion fails
            setSignedUrls((prev) => [...prev, media]);
            setExistingMediaUrls((prev) => [...prev, media.originalUrl]);
        } else {
            toast.success('Update Moment to confirm deletion!');
        }
    }

    return (
        <div className='space-y-2'>
            <Label className='font-medium text-sm'>Current Media</Label>

            {isSigning ? (
                <div className='flex justify-center items-center py-12'>
                    <Loading />
                </div>
            ) : signedUrls.length === 0 ? (
                <p className='py-12 text-muted-foreground text-center'>
                    No media available
                </p>
            ) : (
                <div className='gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                    {signedUrls.map((media, index) => (
                        <div
                            key={index}
                            className='group relative rounded-lg aspect-square overflow-hidden'
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

                            <Button
                                type='button'
                                variant='ghost'
                                size='icon'
                                className='top-1 right-1 absolute opacity-0 group-hover:opacity-100 p-0 w-6 h-6 text-destructive transition-opacity'
                                onClick={() => removeExistingMedia(index)}
                            >
                                <Trash2 className='w-3 h-3' />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
