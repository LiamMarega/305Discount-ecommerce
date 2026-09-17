'use client';

import {useState} from 'react';
import {toast} from 'sonner';
import {ArrowRight} from 'lucide-react';
import {Reveal} from '@/components/brand/reveal';

export function Newsletter() {
    const [email, setEmail] = useState('');
    const [done, setDone] = useState(false);

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email.includes('@')) return;
        setDone(true);
        setEmail('');
        toast.success('Subscribed successfully');
    }

    return (
        <section className="bg-brand-surface">
            <div className="eh-wrap py-10 text-center md:py-14">
                <Reveal as="div">
                    <h2 className="text-[clamp(22px,2.6vw,30px)] font-extrabold tracking-tight">
                        Get deals before everyone else
                    </h2>
                    <p className="mx-auto mt-3 max-w-[50ch] text-base text-brand-muted">
                        Join our list for first access to sales, new arrivals, and financing offers.
                    </p>
                    <form onSubmit={onSubmit} className="mx-auto mt-7 flex max-w-[520px] flex-col gap-2.5 sm:flex-row">
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@email.com"
                            aria-label="Email address"
                            className="min-w-0 flex-1 rounded-full border-[1.5px] border-brand-line bg-brand-surface-2 px-6 py-[15px] text-center text-[15px] outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 sm:text-left"
                        />
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-red px-7 py-[15px] text-[15px] font-bold text-white shadow-[0_14px_30px_-10px_rgba(243,98,41,.45)] transition-transform hover:-translate-y-0.5"
                        >
                            Subscribe <ArrowRight className="size-[18px]" />
                        </button>
                    </form>
                    <p className="mt-4 text-[12.5px] text-brand-muted-2">
                        {done ? (
                            <span className="font-bold text-brand-blue">
                                ✓ Thanks — you&apos;re on the list. Watch your inbox for exclusive deals.
                            </span>
                        ) : (
                            <>We respect your privacy.</>
                        )}
                    </p>
                </Reveal>
            </div>
        </section>
    );
}
