'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/date-picker';
import { FileUpload } from '@/components/file-upload';
import { Heart, ArrowLeft } from 'lucide-react';
import { type User } from '@supabase/supabase-js';
import { deleteMoment } from '@/actions/moments/delete';
import { updateMoment } from '@/actions/moments/update';
import { getSignedUrl } from '@/actions/signed-url';
import { DeleteDialogContent } from './delete-dialog';
import { CurrentMedia } from './current-media';
import { Moment, SignedMediaWithOriginal } from '@/types/app';

export function EditMomentForm({
    user,
    moment,
}: {
    user: User;
    moment: Moment;
}) {
    const router = useRouter();
    const [title, setTitle] = useState(moment.title);
    const [description, setDescription] = useState(moment.description || '');
    const [momentDate, setMomentDate] = useState<Date>(
        new Date(moment.moment_date)
    );
    const [files, setFiles] = useState<File[]>([]);
    const [existingMediaUrls, setExistingMediaUrls] = useState<string[]>(
        moment.media_urls || []
    );
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [signedUrls, setSignedUrls] = useState<SignedMediaWithOriginal[]>([]);
    const [isSigning, setIsSigning] = useState(true);
    const [isPending, setIsPending] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [removedMediaUrls, setRemovedMediaUrls] = useState<string[]>([]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsLoading(true);
        try {
            await updateMoment({
                momentId: moment.id,
                userId: user.id,
                title,
                description,
                momentDate,
                files,
                existingMediaUrls,
                removedMediaUrls,
            });
            toast.success('Moment updated successfully!');
            router.push(`/moments/${moment.id}`);
        } catch (err) {
            console.error(err);
            toast.error('Failed to update moment. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        setIsPending(true);
        setIsDeleting(true);
        try {
            await deleteMoment(moment.id);
            toast.success('Moment deleted successfully!');
            router.push('/');
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete moment. Please try again.');
        } finally {
            setIsDeleting(false);
            setIsPending(false);
        }
    };

    useEffect(() => {
        async function fetchSignedUrls() {
            setIsSigning(true);

            const signed: SignedMediaWithOriginal[] = [];

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

                        signed.push({ url: signedUrl, type, originalUrl: url });
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
        <div className='min-h-screen'>
            <div className='mx-auto p-4 max-w-4xl'>
                <div className='mb-6'>
                    <Button variant='ghost' asChild className='mb-4'>
                        <Link href={`/moments/${moment.id}`}>
                            <ArrowLeft className='mr-2 w-4 h-4' />
                            Back to Moment
                        </Link>
                    </Button>
                </div>

                <Card className='bg-card/80 shadow-lg backdrop-blur-sm border-0'>
                    <CardHeader className='space-y-4 text-center'>
                        <div className='flex justify-center items-center bg-primary/10 mx-auto rounded-full w-12 h-12'>
                            <Heart className='w-6 h-6 text-primary' />
                        </div>
                        <div>
                            <CardTitle className='font-bold text-foreground text-2xl'>
                                Edit Your Moment
                            </CardTitle>
                            <CardDescription className='text-muted-foreground'>
                                Update the details of this special memory
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className='space-y-6'>
                            <div className='space-y-2'>
                                <Label
                                    htmlFor='title'
                                    className='font-medium text-sm'
                                >
                                    Title
                                </Label>
                                <Input
                                    id='title'
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className='h-11'
                                />
                            </div>

                            <div className='space-y-2'>
                                <Label
                                    htmlFor='description'
                                    className='font-medium text-sm'
                                >
                                    Description
                                </Label>
                                <Textarea
                                    id='description'
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    rows={4}
                                    className='resize-none'
                                />
                            </div>

                            <div className='space-y-2'>
                                <Label className='font-medium text-sm'>
                                    Date
                                </Label>
                                <DatePicker
                                    date={momentDate}
                                    onDateChange={(date) =>
                                        date && setMomentDate(date)
                                    }
                                />
                            </div>

                            <CurrentMedia
                                isSigning={isSigning}
                                signedUrls={signedUrls}
                                setExistingMediaUrls={setExistingMediaUrls}
                                setSignedUrls={setSignedUrls}
                                setRemovedMediaUrls={setRemovedMediaUrls}
                            />

                            <div className='space-y-2'>
                                <Label className='font-medium text-sm'>
                                    Add New Photos & Videos
                                </Label>
                                <FileUpload
                                    onFilesChange={setFiles}
                                    maxFiles={5}
                                    accept='image/*,video/*'
                                />
                            </div>

                            <div className='flex justify-between pt-4'>
                                <Button
                                    type='button'
                                    variant='destructive'
                                    className='cursor-pointer'
                                    onClick={() => setShowDeleteDialog(true)}
                                    disabled={isDeleting}
                                >
                                    Delete Moment
                                </Button>

                                <DeleteDialogContent
                                    showDeleteDialog={showDeleteDialog}
                                    setShowDeleteDialog={setShowDeleteDialog}
                                    isPending={isPending}
                                    handleDelete={handleDelete}
                                />

                                <div className='flex space-x-3'>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        asChild
                                    >
                                        <Link href={`/moments/${moment.id}`}>
                                            Cancel
                                        </Link>
                                    </Button>
                                    <Button
                                        type='submit'
                                        className='cursor-pointer'
                                        disabled={isLoading || !title.trim()}
                                    >
                                        {isLoading
                                            ? 'Updating...'
                                            : 'Update Moment'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
