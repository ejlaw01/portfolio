import { useEffect, RefObject } from "react";

export function useMouseFollow(ref: RefObject<HTMLElement | null>, lerp = 0.06) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const isDesktop = window.matchMedia("(min-width: 768px)").matches;
        if (!isDesktop) return;

        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;
        let rafId: number;

        const animate = () => {
            currentX += (mouseX - currentX) * lerp;
            currentY += (mouseY - currentY) * lerp;

            el.style.setProperty("--mouse-x", currentX.toString());
            el.style.setProperty("--mouse-y", currentY.toString());

            rafId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            mouseX = (e.clientX - centerX) / centerX;
            mouseY = (e.clientY - centerY) / centerY;
        };

        rafId = requestAnimationFrame(animate);
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(rafId);
        };
    }, [ref, lerp]);
}
