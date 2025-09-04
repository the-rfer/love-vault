'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
const loaderVariant = cva('flex justify-center items-center', {
    variants: {
        variant: {
            default: 'w-full min-h-full',
            box: 'absolute inset-0',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

export function Loading({ variant }: VariantProps<typeof loaderVariant>) {
    return (
        <div className={cn(loaderVariant({ variant }))}>
            <div className='border-primary border-b-2 rounded-full w-8 h-8 animate-spin'></div>
        </div>
    );
}
