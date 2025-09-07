'use server';

import { createClient } from '@/lib/supabase/server';
import { Moment } from '@/types/app';

export async function fetchMoments(
    userId: string,
    offset: number
): Promise<Moment[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('moments')
        .select('*')
        .eq('user_id', userId)
        .order('moment_date', { ascending: false })
        .range(offset, offset + 9);

    if (error) {
        console.error('Error fetching more moments:', error);
        return [];
    }

    return data || [];
}
