export function ProductGridSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="h-5 w-32 bg-muted animate-pulse rounded" />
            </div>

            <div className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="overflow-hidden rounded-xl border border-brand-line bg-white">
                        <div className="aspect-square bg-muted animate-pulse" />
                        <div className="space-y-2 p-3.5">
                            <div className="h-5 bg-muted animate-pulse rounded w-3/4" />
                            <div className="h-6 bg-muted animate-pulse rounded w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
