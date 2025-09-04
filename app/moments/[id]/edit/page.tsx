'use client';

import { createClient } from '@/lib/supabase/client';
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
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect, type FormEvent } from 'react';
import { Heart, ArrowLeft, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { type User } from '@supabase/supabase-js';

interface Moment {
    id: string;
    title: string;
    description: string | null;
    moment_date: string;
    media_urls: string[] | null;
    user_id: string;
}

export default function EditMomentPage() {
    const [user, setUser] = useState<User | null>(null);
    const [moment, setMoment] = useState<Moment | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [momentDate, setMomentDate] = useState<Date>(new Date());
    const [files, setFiles] = useState<File[]>([]);
    const [existingMediaUrls, setExistingMediaUrls] = useState<string[]>([]);
    const router = useRouter();
    const params = useParams();
    const supabase = createClient();

    useEffect(() => {
        const loadMoment = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) {
                router.push('/auth/login');
                return;
            }
            setUser(user);

            // Load moment data
            const { data: momentData, error } = await supabase
                .from('moments')
                .select('*')
                .eq('id', params.id)
                .eq('user_id', user.id)
                .single();

            if (error || !momentData) {
                toast.error('Moment not found');
                router.push('/dashboard');
                return;
            }

            setMoment(momentData);
            setTitle(momentData.title);
            setDescription(momentData.description || '');
            setMomentDate(new Date(momentData.moment_date));
            setExistingMediaUrls(momentData.media_urls || []);
        };

        loadMoment();
    }, [params.id, router, supabase]);

    const uploadFiles = async (files: File[]): Promise<string[]> => {
        if (!user || files.length === 0) return [];

        const uploadPromises = files.map(async (file) => {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}-${Math.random()
                .toString(36)
                .substring(2)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('moment-media')
                .upload(fileName, file);

            if (uploadError) {
                console.error('Upload error:', uploadError);
                return null;
            }

            const {
                data: { publicUrl },
            } = supabase.storage.from('moment-media').getPublicUrl(fileName);

            return publicUrl;
        });

        const results = await Promise.all(uploadPromises);
        return results.filter((url): url is string => url !== null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user || !moment || !title.trim()) return;

        setIsLoading(true);
        try {
            // Upload new files
            const newMediaUrls = await uploadFiles(files);
            const allMediaUrls = [...existingMediaUrls, ...newMediaUrls];

            // Update moment
            const { error } = await supabase
                .from('moments')
                .update({
                    title: title.trim(),
                    description: description.trim() || null,
                    moment_date: momentDate.toISOString().split('T')[0],
                    media_urls: allMediaUrls.length > 0 ? allMediaUrls : null,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', moment.id);

            if (error) throw error;

            toast.success('Moment updated successfully!');
            router.push(`/moments/${moment.id}`);
        } catch (error) {
            console.error('Error updating moment:', error);
            toast.error('Failed to update moment. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!user || !moment) return;

        if (
            !confirm(
                'Are you sure you want to delete this moment? This action cannot be undone.'
            )
        ) {
            return;
        }

        setIsDeleting(true);
        try {
            const { error } = await supabase
                .from('moments')
                .delete()
                .eq('id', moment.id);

            if (error) throw error;

            toast.success('Moment deleted successfully!');
            router.push('/dashboard');
        } catch (error) {
            console.error('Error deleting moment:', error);
            toast.error('Failed to delete moment. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const removeExistingMedia = (index: number) => {
        setExistingMediaUrls((prev) => prev.filter((_, i) => i !== index));
    };

    if (!user || !moment) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <div className='border-primary border-b-2 rounded-full w-8 h-8 animate-spin'></div>
            </div>
        );
    }

    return (
        <div className='bg-background min-h-screen'>
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
                            <CardDescription className='text-muted dark:text-muted-foreground'>
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
                                    Title *
                                </Label>
                                <Input
                                    id='title'
                                    placeholder='What happened?'
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
                                    placeholder='Tell us more about this moment...'
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
                                    placeholder='When did this happen?'
                                />
                            </div>

                            {/* Existing Media */}
                            {/* FIXME: add preview of the file instead of random names. */}
                            {existingMediaUrls.length > 0 && (
                                <div className='space-y-2'>
                                    <Label className='font-medium text-sm'>
                                        Current Media
                                    </Label>
                                    <div className='space-y-2'>
                                        {existingMediaUrls.map((url, index) => (
                                            <div
                                                key={index}
                                                className='flex justify-between items-center bg-muted p-2 rounded-lg'
                                            >
                                                <span className='text-sm truncate'>
                                                    Media file {index + 1}
                                                </span>
                                                <Button
                                                    type='button'
                                                    variant='ghost'
                                                    size='sm'
                                                    onClick={() =>
                                                        removeExistingMedia(
                                                            index
                                                        )
                                                    }
                                                    className='p-0 w-6 h-6 text-destructive hover:text-destructive'
                                                >
                                                    <Trash2 className='w-3 h-3' />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

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
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className='flex items-center space-x-2'
                                >
                                    <Trash2 className='w-4 h-4' />
                                    <span>
                                        {isDeleting
                                            ? 'Deleting...'
                                            : 'Delete Moment'}
                                    </span>
                                </Button>
                                <div className='flex space-x-3'>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        asChild
                                        className='bg-transparent'
                                    >
                                        <Link href={`/moments/${moment.id}`}>
                                            Cancel
                                        </Link>
                                    </Button>
                                    <Button
                                        type='submit'
                                        disabled={isLoading || !title.trim()}
                                        className='min-w-[100px]'
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
