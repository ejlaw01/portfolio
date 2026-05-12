import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import gsap from "gsap";

export function useSmoothScroll(lerp: number = 0.08) {
    useEffect(() => {
        const lenis = new Lenis({ lerp, smoothWheel: true });
        lenis.on("scroll", ScrollTrigger.update);
        const raf = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);

        const onAnchorClick = (e: MouseEvent) => {
            const link = (e.target as HTMLElement | null)?.closest("a[href^='#']") as HTMLAnchorElement | null;
            if (!link) return;
            const href = link.getAttribute("href");
            if (!href || href === "#") return;
            const target = document.getElementById(href.slice(1));
            if (!target) return;
            e.preventDefault();
            lenis.scrollTo(target);
        };
        document.addEventListener("click", onAnchorClick);

        return () => {
            document.removeEventListener("click", onAnchorClick);
            gsap.ticker.remove(raf);
            lenis.destroy();
        };
    }, []);
}
