import {Search, BadgeDollarSign, MessageCircle, ShoppingCart, Truck} from 'lucide-react';

const steps = [
    {icon: Search, word: 'Browse', desc: 'Furniture, appliances and mattresses in one catalog.'},
    {icon: BadgeDollarSign, word: 'Compare', desc: 'Start with the current deals and prices available online.'},
    {icon: MessageCircle, word: 'Ask', desc: 'Message the team to confirm stock, options and details.'},
    {icon: ShoppingCart, word: 'Choose', desc: 'Pick what fits your home and complete the next step.'},
    {icon: Truck, word: 'Deliver', desc: 'Ask us about delivery options available for your order.'},
];

export function DiscountSignature() {
    return (
        <section className="border-t border-brand-line bg-white py-10 md:py-14" id="why-305">
            <div className="eh-wrap">
                <div className="mb-7 max-w-[58ch] md:mb-9">
                    <h2 className="text-[clamp(22px,2.6vw,30px)] font-extrabold leading-tight tracking-tight">
                        Five simple steps with <span className="italic text-brand-red">305 Discount</span>
                    </h2>
                    <p className="mt-2 text-[15px] text-brand-muted">
                        Browse the catalog, compare the deal, and contact us when you are ready.
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
                                <span className="italic text-brand-blue">305</span>{' '}
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
