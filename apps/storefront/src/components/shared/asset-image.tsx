'use client';

import {useState} from 'react';
import Image from 'next/image';
import {cn} from '@/lib/utils';

interface AssetImageProps {
    src?: string | null;
    alt: string;
    sizes?: string;
    className?: string;
    /** Text shown when the asset is missing or fails to load. */
    fallbackLabel?: string;
    /** Placeholder style: dark brand hatch, or a light neutral tile. */
    fallbackTone?: 'dark' | 'light';
}

/**
 * Fills its positioned parent with a Vendure asset, degrading to a branded
 * placeholder when the asset is missing or the request fails.
 */
export function AssetImage({
    src,
    alt,
    sizes = '(max-width: 860px) 100vw, 40vw',
    className,
    fallbackLabel,
    fallbackTone = 'dark',
}: AssetImageProps) {
    const [failed, setFailed] = useState(false);

    if (!src || failed) {
        return fallbackTone === 'light' ? (
            <div
                className="grid size-full place-items-center px-3 text-center text-[12px] font-medium text-brand-muted"
                style={{
                    background:
                        'repeating-linear-gradient(135deg, rgba(15,20,28,.04) 0 10px, rgba(15,20,28,.012) 10px 20px), var(--brand-surface-2)',
                }}
            >
                {fallbackLabel}
            </div>
        ) : (
            <div className="eh-ph size-full" aria-hidden="true" />
        );
    }

    return (
        <Image
            src={src}
            alt={alt}
            fill
            className={cn('object-cover', className)}
            sizes={sizes}
            onError={() => setFailed(true)}
        />
    );
}
