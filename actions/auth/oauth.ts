'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

type OauthStateType =
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

const oauthSchema = z.object({
    provider: z.enum(['google', 'facebook', 'discord'], {
        message: 'Invalid provider',
    }),
});

export async function oauthLoginAction(_: OauthStateType, formData: FormData) {
    const validatedFields = oauthSchema.safeParse({
        provider: formData.get('provider'),
    });

    if (!validatedFields.success) {
        const fieldErrors = z.flattenError(validatedFields.error).fieldErrors;

        return {
            error: {
                general: fieldErrors.provider?.join(', '),
            },
            success: false,
        };
    }

    const { provider } = validatedFields.data;

    const supabase = await createClient();

    const { error, data } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
    });

    if (error) {
        return { error: { general: error.message }, success: false };
    }

    return {
        error: undefined,
        success: true,
        redirect: data?.url ?? '/dashboard',
    };
}
