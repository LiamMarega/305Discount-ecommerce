'use client';

import {useEffect, useRef, useState, type ElementType, type ReactNode} from 'react';
import {cn} from '@/lib/utils';

interface RevealProps {
    children: ReactNode;
    as?: ElementType;
    className?: string;
    /** Stagger delay in ms. */
    delay?: number;
}

/**
 * Reveals content on scroll using a single IntersectionObserver per element.
 * Falls back to visible immediately when IO is unavailable or motion is reduced.
 */
export function Reveal({children, as, className, delay = 0}: RevealProps) {
    const Tag = (as ?? 'div') as ElementType;
    const ref = useRef<HTMLElement>(null);
    const [shown, setShown] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (typeof IntersectionObserver === 'undefined') {
            setShown(true);
            return;
        }
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        setShown(true);
                        io.unobserve(e.target);
                    }
                });
            },
            {threshold: 0.12, rootMargin: '0px 0px -8% 0px'},
        );
        io.observe(el);
        // Failsafe: never leave content permanently hidden if IO never fires
        // (e.g. very tall viewport, no scroll, or background tab).
        const failsafe = window.setTimeout(() => setShown(true), 1400);
        return () => {
            io.disconnect();
            clearTimeout(failsafe);
        };
    }, []);

    return (
        <Tag
            ref={ref}
            data-in={shown ? 'true' : 'false'}
            style={delay ? {transitionDelay: `${delay}ms`} : undefined}
            className={cn('eh-reveal', className)}
        >
            {children}
        </Tag>
    );
}
