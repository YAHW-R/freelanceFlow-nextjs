'use client';

import type { ReactNode } from "react";
import { useInView } from "react-intersection-observer";

const ScrollAnimation = ({ children, animation, className = "" }: { children: ReactNode, animation: string, className?: string }) => {
    const { ref, inView } = useInView({
        triggerOnce: true, // solo una vez
        threshold: 0.5,    // 50% visible
    });

    return (
        <div
            ref={ref}
            className={`${inView ? animation : "opacity-0"} ${className}`}
        >
            {children}
        </div>
    );
};

export default ScrollAnimation