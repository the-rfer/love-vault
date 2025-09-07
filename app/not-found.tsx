import Link from 'next/link';

export default function NotFound() {
    return (
        <div className='flex flex-col justify-center items-center min-h-screen'>
            <h1 className='mb-4 font-extrabold text-7xl'>Not found</h1>
            <p className='mb-6 text-2xl'>
                Sorry, we couldn&apos;t find that page.
            </p>
            <Link
                href='/'
                className='bg-primary hover:bg-primary/80 px-6 py-3 rounded-lg transition'
            >
                Go Home
            </Link>
        </div>
    );
}
