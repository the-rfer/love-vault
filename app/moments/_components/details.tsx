'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Moment } from '../[id]/page';
import { formatDate, formatTime } from '@/lib/utils';
import { Heart, Edit, Calendar, Clock, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function Details({
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
            <CardHeader className='md:hidden'>
                <CardTitle className='flex items-center'>
                    <div className='flex justify-center items-center bg-primary/20 mr-2 rounded-full w-10 h-10'>
                        <Heart className='w-5 h-5 text-primary' />
                    </div>
                    {moment.title}
                </CardTitle>
            </CardHeader>
            <CardContent className='p-2 md:p-6'>
                <div className='flex md:flex-row flex-col-reverse justify-between items-start mb-4'>
                    <div className='flex items-center space-x-3'>
                        <div className='hidden md:flex justify-center items-center bg-primary/20 rounded-full w-10 h-10'>
                            <Heart className='w-5 h-5 text-primary' />
                        </div>
                        <div>
                            <h1 className='hidden md:block font-bold text-foreground text-2xl'>
                                {moment.title}
                            </h1>
                            <div className='hidden md:flex items-center space-x-4 mt-2'>
                                <div className='flex items-center space-x-1 text-muted-foreground text-sm'>
                                    <Calendar className='w-4 h-4' />
                                    <span>
                                        {formatDate(moment.moment_date)}
                                    </span>
                                </div>
                                <div className='flex items-center space-x-1 text-muted-foreground text-sm'>
                                    <Clock className='w-4 h-4' />
                                    <span>
                                        Added {formatTime(moment.created_at)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center gap-2 md:gap-0 md:space-x-2 md:m-0 mt-[-30px] ml-auto'>
                        <Button
                            variant='outline'
                            asChild
                            className='bg-transparent'
                        >
                            <Link href={`/moments/${moment.id}/edit`}>
                                <Edit className='mr-0 md:mr-2 w-4 h-4' />
                                <span className='hidden md:block'>Edit</span>
                            </Link>
                        </Button>
                        <Button
                            variant='destructive'
                            onClick={() => setShowDeleteDialog(true)}
                            disabled={isPending}
                        >
                            <Trash2 className='mr-0 md:mr-2 w-4 h-4' />
                            <span className='hidden md:block'>
                                {isPending ? 'Deleting...' : 'Delete'}
                            </span>
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
