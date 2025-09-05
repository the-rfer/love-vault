'use server';

import { createClient } from '@/lib/supabase/server';

interface UpdateMomentArgs {
    momentId: string;
    userId: string;
    title: string;
    description: string;
    momentDate: Date;
    files: File[];
    existingMediaUrls: string[];
}

export async function updateMoment({
    momentId,
    userId,
    title,
    description,
    momentDate,
    files,
    existingMediaUrls,
}: UpdateMomentArgs) {
    const supabase = await createClient();

    // upload new files
    const newMediaUrls: string[] = [];
    for (const file of files) {
        const ext = file.name.split('.').pop();
        const path = `${userId}/${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}.${ext}`;

        const { error: uploadError } = await supabase.storage
            .from('moment-media')
            .upload(path, file);

        if (uploadError) throw uploadError;

        const {
            data: { publicUrl },
        } = supabase.storage.from('moment-media').getPublicUrl(path);
        newMediaUrls.push(publicUrl);
    }

    const allMediaUrls = [...existingMediaUrls, ...newMediaUrls];

    const { error } = await supabase
        .from('moments')
        .update({
            title: title.trim(),
            description: description.trim() || null,
            moment_date: momentDate.toISOString().split('T')[0],
            media_urls: allMediaUrls.length > 0 ? allMediaUrls : null,
            updated_at: new Date().toISOString(),
        })
        .eq('id', momentId);

    if (error) throw error;
}
