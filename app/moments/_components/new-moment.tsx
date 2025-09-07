'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createMoment } from '@/actions/moments/new';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/date-picker';
import { FileUpload } from '@/components/file-upload';
import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { type User } from '@supabase/supabase-js';
import { MomentActionState } from '@/types/app';

export function NewMomentForm({ user }: { user: User }) {
    const router = useRouter();
    const [date, setDate] = useState<Date>(new Date());
    const [files, setFiles] = useState<File[]>([]);

    const [state, formAction, pending] = useActionState(
        async (prevState: MomentActionState, formData: FormData) => {
            files.forEach((url) => {
                formData.append('files', url);
            });

            const result = await createMoment(formData, user.id);

            if (result?.error) {
                return { error: result.error };
            }

            toast.success('Moment created successfully!');
            router.push('/');
            return { success: true };
        },
        { success: false, error: undefined }
    );

    useEffect(() => {
        if (state.error) {
            toast.error(state.error);
        } else if (state.success) {
            toast.success('Moment created successfully!');
            router.push('/');
        }
    }, [router, state]);

    return (
        <form action={formAction} className='space-y-6'>
            <div className='space-y-2'>
                <Label htmlFor='title' className='font-medium text-sm'>
                    Title *
                </Label>
                <Input
                    id='title'
                    name='title'
                    placeholder='What happened?'
                    required
                    className='h-11'
                />
            </div>

            <div className='space-y-2'>
                <Label htmlFor='description' className='font-medium text-sm'>
                    Description
                </Label>
                <Textarea
                    id='description'
                    name='description'
                    placeholder='Tell us more about this moment...'
                    rows={4}
                    className='resize-none'
                />
            </div>

            <div className='space-y-2'>
                <Label className='font-medium text-sm'>Date</Label>
                <input
                    type='hidden'
                    name='momentDate'
                    value={date.toISOString().split('T')[0]}
                />
                <DatePicker
                    date={date}
                    onDateChange={(d) => d && setDate(d)}
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
                    <Link href='/'>Cancel</Link>
                </Button>
                <Button
                    type='submit'
                    disabled={pending}
                    className='min-w-[100px]'
                >
                    {pending ? 'Creating...' : 'Create Moment'}
                </Button>
            </div>
        </form>
    );
}
