'use server';

import { createClient } from '@/lib/supabase/server';
import { ActivityData } from '@/types/app';

export async function fetchActivity(userId: string): Promise<ActivityData[]> {
    const supabase = await createClient();

    try {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const { data: activityMoments, error } = await supabase
            .from('moments')
            .select('moment_date')
            .eq('user_id', userId)
            .gte('moment_date', oneYearAgo.toISOString().split('T')[0]);

        if (error) {
            console.error('Error loading activity data:', error);
            return [];
        }

        const activityMap = new Map<string, number>();

        activityMoments?.forEach((moment) => {
            const date = moment.moment_date;
            activityMap.set(date, (activityMap.get(date) || 0) + 1);
        });

        const activity: ActivityData[] = [];
        const today = new Date();
        const startDate = new Date(oneYearAgo);

        for (
            let d = new Date(startDate);
            d <= today;
            d.setDate(d.getDate() + 1)
        ) {
            const dateStr = d.toISOString().split('T')[0];
            const count = activityMap.get(dateStr) || 0;
            let level: 0 | 1 | 2 | 3 | 4 = 0;

            if (count > 0) {
                if (count >= 4) level = 4;
                else if (count >= 3) level = 3;
                else if (count >= 2) level = 2;
                else level = 1;
            }

            activity.push({
                date: dateStr,
                count,
                level,
            });
        }

        return activity;
    } catch (error) {
        console.error('Error fetching activity:', error);
        return [];
    }
}
