import {CreditCard, BadgeCheck, Truck, ShieldCheck, Headset} from 'lucide-react';

const services = [
    {icon: CreditCard, title: 'Easy financing', body: 'Monthly plans from 0% down'},
    {icon: BadgeCheck, title: 'All credit welcome', body: 'Approval in minutes, in store or by chat'},
    {icon: Truck, title: 'Free delivery', body: 'Install and haul-away included'},
    {icon: ShieldCheck, title: 'Warranty backed', body: 'Manufacturer coverage on every unit'},
    {icon: Headset, title: 'Real people', body: 'Talk to our Miami team, not a bot'},
];

export function ServiceStrip() {
    return (
        <section className="border-y border-brand-line bg-white">
            <div className="eh-wrap">
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
                    {services.map((s) => (
                        <li
                            key={s.title}
                            className={[
                                'flex items-start gap-3 py-4 lg:py-5',
                                // One rule between items, on the axis the current grid stacks along.
                                'border-t border-brand-line first:border-t-0',
                                'sm:[&:nth-child(-n+2)]:border-t-0',
                                'sm:[&:nth-child(even)]:border-l sm:[&:nth-child(even)]:pl-5',
                                'lg:border-t-0 lg:border-l lg:pl-5 lg:first:border-l-0 lg:first:pl-0',
                            ].join(' ')}
                        >
                            <s.icon className="mt-0.5 size-[19px] shrink-0 text-brand-red" strokeWidth={1.9} />
                            <span className="min-w-0">
                                <span className="block text-[13.5px] font-extrabold leading-tight text-brand-ink">
                                    {s.title}
                                </span>
                                <span className="mt-0.5 block text-[12.5px] leading-snug text-brand-muted">
                                    {s.body}
                                </span>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
