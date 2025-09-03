'use server';

import { createClient } from '@/lib/supabase/server';

export async function getSignedUrl({
    path,
    bucket,
}: {
    path: string | null;
    bucket: string | null;
}): Promise<string | undefined> {
    if (!path || !bucket) return undefined;

    const strippedPath = path.split(`/${bucket}/`)[1];

    const supabase = await createClient();

    const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(strippedPath, 60 * 60); // 1 hour

    if (error || !data) {
        console.error('Error creating signed URL', error);
        return undefined;
    }

    return data.signedUrl;
}
