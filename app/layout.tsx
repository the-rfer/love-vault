import { type ReactNode } from 'react';
import { type Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/providers';
import './globals.css';

export const metadata: Metadata = {
    title: "Love Vault - Couple's Moment Tracker",
    description: 'Capture and cherish your beautiful moments together',
};

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang='en' suppressHydrationWarning>
            <body
                className={`font-sans ${geistSans.variable} ${geistMono.variable} bg-background antialiased   min-h-screen w-screen overflow-x-hidden relative`}
            >
                <div
                    className='-z-10 absolute inset-0'
                    style={{
                        backgroundImage: `
        radial-gradient(125% 125% at 50% 10%, var(--background) 40%, var(--primary) 100%)
      `,
                        backgroundSize: '100% 100%',
                    }}
                />
                <ThemeProvider
                    attribute='class'
                    defaultTheme='system'
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
