'use server';

import { createClient } from '@/lib/supabase/server';
import { type Moment } from '@/app/dashboard/types';

export async function fetchMoments(
    userId: string,
    offset: number
): Promise<Moment[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('moments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + 19);

    if (error) {
        console.error('Error fetching more moments:', error);
        return [];
    }

    return data || [];
}
