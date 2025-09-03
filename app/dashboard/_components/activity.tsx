'use client';

import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';
import { useEffect, useState, useTransition, cloneElement } from 'react';
import ActivityCalendar from 'react-activity-calendar';
import { type ActivityData } from '../types';
import { fetchActivity } from '@/actions/dashboard/activity';
import { Loading } from '@/components/loading';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';

//TODO: make these options available as user configurations
const CONFIG = {
    theme: {
        light: ['#fdf2f8', '#fce7f3', '#fbcfe8', '#f9a8d4', '#ec4899'],
        dark: ['#1f2937', '#374151', '#6b7280', '#9ca3af', '#ec4899'],
    },
    labels: {
        months: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ],
        weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        totalCount: '{{count}} moments in {{year}}',
        legend: {
            less: 'Less',
            more: 'More',
        },
    },
};

export function ActivityCalendarClient({ userId }: { userId: string }) {
    const [activity, setActivity] = useState<ActivityData[] | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        startTransition(async () => {
            const data = await fetchActivity(userId);
            setActivity(data);
        });
    }, [userId]);

    if (isPending || !activity) {
        return (
            <div className='flex justify-center p-4'>
                <Loading />
            </div>
        );
    }

    return (
        <Card>
            <CardContent className='mx-auto px-6'>
                <div className='flex items-center space-x-2 mb-4'>
                    <CalendarIcon className='w-5 h-5 text-primary' />
                    <h2 className='font-semibold text-lg'>
                        Your Love Story Activity
                    </h2>
                </div>
                <div className='overflow-x-auto'>
                    <ActivityCalendar
                        data={activity}
                        theme={CONFIG.theme}
                        labels={CONFIG.labels}
                        showWeekdayLabels={false}
                        blockSize={12}
                        blockMargin={3}
                        fontSize={12}
                        renderBlock={(block, activity) =>
                            cloneElement(block, {
                                'data-tooltip-id': 'react-tooltip',
                                'data-tooltip-html': `${activity.count} activities on ${activity.date}`,
                            })
                        }
                    />
                    <Tooltip id='react-tooltip' />
                </div>
            </CardContent>
        </Card>
    );
}
