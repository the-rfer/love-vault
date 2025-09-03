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
import { useRouter } from 'next/navigation';
import { useState, useEffect, type FormEvent } from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { type User } from '@supabase/supabase-js';

export default function NewMomentPage() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [momentDate, setMomentDate] = useState<Date>(new Date());
    const [files, setFiles] = useState<File[]>([]);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) {
                router.push('/auth/login');
                return;
            }
            setUser(user);
        };
        getUser();
    }, [router, supabase.auth]);

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
        if (!user || !title.trim()) return;

        setIsLoading(true);
        try {
            // Upload files first
            const mediaUrls = await uploadFiles(files);

            // Create moment
            const { error } = await supabase.from('moments').insert({
                user_id: user.id,
                title: title.trim(),
                description: description.trim() || null,
                moment_date: momentDate.toISOString().split('T')[0],
                media_urls: mediaUrls.length > 0 ? mediaUrls : null,
            });

            if (error) throw error;

            toast.success('Moment created successfully!');
            router.push('/dashboard');
        } catch (error) {
            console.error('Error creating moment:', error);
            toast.error('Failed to create moment. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <div className='border-primary border-b-2 rounded-full w-8 h-8 animate-spin'></div>
            </div>
        );
    }

    return (
        <div className='bg-background min-h-screen'>
            <div className='mx-auto p-4 max-w-2xl'>
                <div className='mb-6'>
                    <Button variant='ghost' asChild className='mb-4'>
                        <Link href='/dashboard'>
                            <ArrowLeft className='mr-2 w-4 h-4' />
                            Back to Dashboard
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
                                Capture a Beautiful Moment
                            </CardTitle>
                            <CardDescription className='text-muted-foreground'>
                                Share something special that happened today
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

                            <div className='space-y-2'>
                                <Label className='font-medium text-sm'>
                                    Photos & Videos (Optional)
                                </Label>
                                <FileUpload
                                    onFilesChange={setFiles}
                                    maxFiles={5}
                                    accept='image/*,video/*'
                                />
                            </div>

                            <div className='flex justify-end space-x-3 pt-4'>
                                <Button
                                    type='button'
                                    variant='outline'
                                    asChild
                                    className='bg-transparent'
                                >
                                    <Link href='/dashboard'>Cancel</Link>
                                </Button>
                                <Button
                                    type='submit'
                                    disabled={isLoading || !title.trim()}
                                    className='min-w-[100px]'
                                >
                                    {isLoading
                                        ? 'Creating...'
                                        : 'Create Moment'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
