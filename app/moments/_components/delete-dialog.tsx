'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export function DeleteDialogContent({
    showDeleteDialog,
    setShowDeleteDialog,
    isPending,
    handleDelete,
}: {
    showDeleteDialog: boolean;
    setShowDeleteDialog: (value: boolean) => void;
    isPending: boolean;
    handleDelete: () => void;
}) {
    return (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete this moment?</DialogTitle>
                </DialogHeader>
                <p className='text-muted-foreground text-sm'>
                    This action cannot be undone. Are you sure you want to
                    continue?
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
                            handleDelete();
                            setShowDeleteDialog(false);
                        }}
                    >
                        {isPending ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
