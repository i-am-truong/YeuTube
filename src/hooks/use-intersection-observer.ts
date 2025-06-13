import { useEffect, useRef, useState } from "react";

export const useIntersectionObserver = (option?: IntersectionObserverInit) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const targetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting)
        }, option)

        if (targetRef.current) {
            observer.observe(targetRef.current);
        }

        return () => observer.disconnect()
    }, [option])

    return { targetRef, isIntersecting }
}