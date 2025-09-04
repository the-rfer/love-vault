import Image from 'next/image';
import { useState } from 'react';
import { Loading } from '@/components/loading';

export function ImageLoader({
    src,
    alt,
    large = false,
}: {
    src: string;
    alt: string;
    large?: boolean;
}) {
    const [isLoading, setIsLoading] = useState(true);

    const imageProps = large
        ? {
              width: 800,
              height: 600,
              className: 'rounded-lg object-contain',
          }
        : {
              fill: true as const,
              sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
              className: `w-full h-full object-cover transition-opacity duration-500 ${
                  isLoading ? 'opacity-0' : 'opacity-100'
              }`,
          };

    return (
        <div className='relative bg-gray-100 rounded-lg w-full h-full overflow-hidden'>
            {isLoading && <Loading />}

            <Image
                {...imageProps}
                src={src}
                alt={alt}
                onLoad={() => setIsLoading(false)}
                placeholder='blur'
                blurDataURL='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjZGRkZGRkIi8+'
            />
        </div>
    );
}
