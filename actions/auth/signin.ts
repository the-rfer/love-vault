'use server';

import { createClient } from '@/lib/supabase/server';
import { SignUpActionState } from '@/types/app';
import { z } from 'zod';

const signupSchema = z
    .object({
        email: z.email({ message: 'Invalid email address' }),
        password: z
            .string()
            .min(6, { message: 'Password must be at least 6 characters long' }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

export async function signinAction(_: SignUpActionState, formData: FormData) {
    const validatedFields = signupSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    });

    if (!validatedFields.success) {
        const fieldErrors = z.flattenError(validatedFields.error).fieldErrors;

        return {
            error: {
                email: fieldErrors.email?.join(', '),
                password: fieldErrors.password?.join(', '),
                confirmPassword: fieldErrors.confirmPassword?.join(', '),
            },
            success: false,
        };
    }

    const { email, password } = validatedFields.data;

    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        return { error: { general: error.message }, success: false };
    }

    return { error: undefined, success: true };
}
