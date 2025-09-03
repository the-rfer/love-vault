export interface Profile {
    id: string;
    username: string;
    email: string;
    partner_name: string;
    partner_birthday: string | null;
    relationship_start_date: string;
    profile_photo_url: string | null;
}

export interface Moment {
    id: string;
    title: string;
    description: string | null;
    moment_date: string;
    media_urls: string[] | null;
    created_at: string;
}

export interface ActivityData {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
}
