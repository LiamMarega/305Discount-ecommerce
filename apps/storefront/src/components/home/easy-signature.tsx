import {CreditCard, BadgeCheck, ShoppingCart, Wallet, Truck} from 'lucide-react';

const steps = [
    {icon: CreditCard, word: 'Financing', desc: 'Monthly plans built around your budget. Apply in minutes.'},
    {icon: BadgeCheck, word: 'Approval', desc: 'All credit types welcome. We focus on getting you a yes.'},
    {icon: ShoppingCart, word: 'Buy', desc: 'Browse in store or online and check out in a few taps.'},
    {icon: Wallet, word: 'Payments', desc: 'Card, transfer or in store, on the schedule you choose.'},
    {icon: Truck, word: 'Delivery', desc: 'Careful delivery, install, and haul-away of your old unit.'},
];

export function EasySignature() {
    return (
        <section className="border-t border-brand-line bg-white py-10 md:py-14" id="easy">
            <div className="eh-wrap">
                <div className="mb-7 max-w-[54ch] md:mb-9">
                    <h2 className="text-[clamp(22px,2.6vw,30px)] font-extrabold leading-tight tracking-tight">
                        Five reasons it is just… <span className="italic text-brand-red">easy</span>
                    </h2>
                    <p className="mt-2 text-[15px] text-brand-muted">
                        From the first hello to delivery day, every step is built to be simple.
                    </p>
                </div>

                <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
                    {steps.map((s, i) => (
                        <li
                            key={s.word}
                            className={[
                                'py-5 lg:py-0',
                                'border-t border-brand-line first:border-t-0',
                                'sm:[&:nth-child(-n+2)]:border-t-0',
                                'sm:[&:nth-child(even)]:border-l sm:[&:nth-child(even)]:pl-5',
                                'lg:border-t-0 lg:border-l lg:pl-5 lg:first:border-l-0 lg:first:pl-0',
                            ].join(' ')}
                        >
                            <s.icon
                                className={i % 2 === 0 ? 'size-6 text-brand-blue' : 'size-6 text-brand-red'}
                                strokeWidth={1.8}
                            />
                            <p className="mt-3.5 text-[15px] font-extrabold leading-none">
                                <span className="italic text-brand-blue">easy</span>{' '}
                                <span className="uppercase tracking-tight text-brand-red">{s.word}</span>
                            </p>
                            <p className="mt-2 text-[13px] leading-relaxed text-brand-muted">{s.desc}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
