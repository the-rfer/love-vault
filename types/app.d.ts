// Auth Action State Types
export type LoginActionState =
    | {
          error: {
              email: string | undefined;
              password: string | undefined;
              general?: undefined;
          };
          success: boolean;
      }
    | {
          error: {
              general: string;
              email?: undefined;
              password?: undefined;
          };
          success: boolean;
      }
    | {
          error: undefined;
          success: boolean;
      };

export type SignUpActionState =
    | {
          error: {
              email: string | undefined;
              password: string | undefined;
              confirmPassword: string | undefined;
              general?: undefined;
          };
          success: boolean;
      }
    | {
          error: {
              general: string;
              email?: undefined;
              password?: undefined;
              confirmPassword?: undefined;
          };
          success: boolean;
      }
    | {
          error: undefined;
          success: boolean;
      };

export type OauthActionState =
    | {
          error: {
              general: string | undefined;
          };
          success: boolean;
          redirect?: undefined;
      }
    | {
          error: undefined;
          success: boolean;
          redirect: string;
      };

export type OauthProviders = 'google' | 'facebook' | 'discord';

// User Profile Types
export interface Profile {
    id: string;
    username: string;
    email: string;
    partner_name: string;
    partner_birthday: string | null;
    relationship_start_date: string;
    profile_photo_url: string | null;
}

export interface CreateProfileArgs {
    userId: string;
    email: string | undefined;
    username: string;
    partnerName: string;
    partnerBirthday?: string | undefined;
    relationshipStartDate: string;
    profilePhoto?: File;
}

export interface ProfileUpdate {
    username: string;
    partner_name: string;
    partner_birthday: string | null;
    relationship_start_date: string;
}

// Moments Types
export interface Moment {
    id: string;
    title: string;
    description: string | null;
    moment_date: string;
    media_urls: string[] | null;
    created_at: string;
}

export interface UpdateMomentArgs {
    momentId: string;
    userId: string;
    title: string;
    description: string;
    momentDate: Date;
    files: File[];
    existingMediaUrls: string[];
    removedMediaUrls: string[];
}

export type MomentActionState =
    | {
          error: string;
          success?: undefined;
      }
    | {
          success: boolean;
          error?: undefined;
      };

export interface TimelineItem {
    id: string;
    title: string;
    description: string | null;
    moment_date: string;
    media_urls: string[] | null;
    created_at: string;
}

export interface TimelineProps {
    items: TimelineItem[];
}

// Onboarding Types
export interface OnboardingData {
    userId: string;
    email: string;
    username: string;
    partnerName: string;
    partnerBirthday: string | undefined;
    relationshipStartDate: string;
    profilePhoto: File | undefined;
}

// General Types
export interface ActivityData {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
}

export interface SignedMedia {
    url: string;
    type: 'image' | 'video' | 'other';
}

export interface SignedMediaWithOriginal extends SignedMedia {
    originalUrl: string;
}
