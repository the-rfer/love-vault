'use server';

import { createClient } from '@/lib/supabase/server';
import { LoginActionState } from '@/types/app';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.email({ message: 'Invalid email address' }),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters long' }),
});

export async function loginAction(_: LoginActionState, formData: FormData) {
    const validatedFields = loginSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        const fieldErrors = z.flattenError(validatedFields.error).fieldErrors;

        return {
            error: {
                email: fieldErrors.email?.join(', '),
                password: fieldErrors.password?.join(', '),
            },
            success: false,
        };
    }

    const { email, password } = validatedFields.data;

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: { general: error.message }, success: false };
    }

    return { error: undefined, success: true };
}
