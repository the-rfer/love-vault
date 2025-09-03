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
                className={`font-sans ${geistSans.variable} ${geistMono.variable} bg-gradient-to-br from-background to-card antialiased min-h-screen w-screen`}
            >
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
