import { SearchTermSkeleton } from '@/app/[locale]/search/search-term';
import { SearchResultsSkeleton } from '@/components/shared/skeletons/search-results-skeleton';

export default function SearchLoading() {
    return (
        <div className="eh-wrap py-8 md:py-12">
            <SearchTermSkeleton />
            <SearchResultsSkeleton />
        </div>
    );
}
