'use client';

import {useEffect, useState} from 'react';

function pad(n: number) {
    return n < 10 ? `0${n}` : String(n);
}

/** Next Sunday at 23:59:59 in the visitor's own timezone. */
function endOfWeek() {
    const now = new Date();
    const end = new Date(now);
    end.setDate(now.getDate() + ((7 - now.getDay()) % 7));
    end.setHours(23, 59, 59, 999);
    if (end.getTime() <= now.getTime()) end.setDate(end.getDate() + 7);
    return end.getTime();
}

function split(deadline: number) {
    let seconds = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
    const d = Math.floor(seconds / 86400);
    seconds -= d * 86400;
    const h = Math.floor(seconds / 3600);
    seconds -= h * 3600;
    const m = Math.floor(seconds / 60);
    return {d, h, m, s: seconds - m * 60};
}

interface CountdownProps {
    /** 'dark' sits on navy, 'light' sits on white. */
    tone?: 'dark' | 'light';
}

export function Countdown({tone = 'dark'}: CountdownProps) {
    // Empty on the server so the first paint never disagrees with the client clock.
    const [time, setTime] = useState<ReturnType<typeof split> | null>(null);

    useEffect(() => {
        const deadline = endOfWeek();
        setTime(split(deadline));
        const id = setInterval(() => setTime(split(deadline)), 1000);
        return () => clearInterval(id);
    }, []);

    const units: [string, string][] = [
        [time ? pad(time.d) : '--', 'Days'],
        [time ? pad(time.h) : '--', 'Hrs'],
        [time ? pad(time.m) : '--', 'Min'],
        [time ? pad(time.s) : '--', 'Sec'],
    ];

    const box =
        tone === 'dark'
            ? 'bg-white/12 text-white ring-1 ring-white/20'
            : 'border border-brand-line bg-white text-brand-ink';
    const label = tone === 'dark' ? 'text-white/70' : 'text-brand-muted';

    return (
        <div className="flex gap-1.5" role="timer" aria-label="Time left this week">
            {units.map(([value, name]) => (
                <div key={name} className={`min-w-[46px] rounded-lg px-2 py-1.5 text-center ${box}`}>
                    <div className="font-mono text-[16px] font-extrabold leading-none tabular-nums">{value}</div>
                    <div className={`mt-0.5 text-[9.5px] font-semibold uppercase tracking-[0.08em] ${label}`}>
                        {name}
                    </div>
                </div>
            ))}
        </div>
    );
}
