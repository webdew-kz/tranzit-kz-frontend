/** @format */

import { useEffect, useRef, useState } from "react";

export function useInfiniteScroll({
    loadMore,
    hasMore,
}: {
    loadMore: () => Promise<void> | void;
    hasMore: boolean;
}) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!hasMore || isLoading) return;

        const observer = new IntersectionObserver(
            async ([entry]) => {
                if (entry.isIntersecting && !isLoading) {
                    setIsLoading(true);
                    await loadMore(); // поддерживает async, если нужно
                    setIsLoading(false);
                }
            },
            {
                rootMargin: "0px 0px 550px 0px", // 👈 сработает, когда элемент окажется в 200px от нижнего края
            }
        );

        const el = ref.current;
        if (el) observer.observe(el);

        return () => {
            if (el) observer.unobserve(el);
            observer.disconnect();
        };
    }, [loadMore, hasMore, isLoading]);

    return { bottomRef: ref, isLoading };
}
