import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import data from "@/data/data.json";
import { useMouseFollow } from "@/hooks/useMouseFollow";
import { topWavePath, WAVE_HEIGHT, WAVE_PAD } from "@/utils/wavePaths";
import type { HeroData } from "@/types/data";

function Hero() {
    const { subheadline, bodyText, tagline }: HeroData = data.hero;
    const sectionRef = useRef<HTMLElement>(null);
    const waveRef = useRef<SVGSVGElement>(null);
    const textContainerRef = useRef<HTMLDivElement>(null);

    useMouseFollow(sectionRef, 0.06);

    useGSAP(() => {
        if (!sectionRef.current) return;

        const words = sectionRef.current.querySelectorAll<HTMLElement>(".hero-word");

        gsap.set(words, { opacity: 0, y: 12 });

        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
            onEnter: () => {
                gsap.to(words, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    stagger: 0.03,
                });
            },
        });
    });

    const renderWords = (text: string | undefined) =>
        text?.split(" ").map((word, i) => (
            <span key={i} className="hero-word inline-block">
                {word}&nbsp;
            </span>
        ));

    return (
        <section
            ref={sectionRef}
            className="bg-transparent"
            style={{ position: "relative", height: "100svh", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", "--mouse-x": "0", "--mouse-y": "0" } as React.CSSProperties}
        >
            {/* White strip to cover dark bg when wave shifts from mouse-follow */}
            <div className="absolute -top-px left-0 w-full h-[11px] bg-white z-[1]" />

            <svg
                ref={waveRef}
                viewBox={`${-WAVE_PAD} ${-WAVE_PAD} ${100 + WAVE_PAD * 2} ${WAVE_HEIGHT + WAVE_PAD}`}
                preserveAspectRatio="none"
                className="hero-wave"
                style={{
                    transform: "translate(calc(var(--mouse-x) * 5px), calc(var(--mouse-y) * 3px))",
                }}
            >
                <path d={topWavePath} fill="white" />
            </svg>

            <div ref={textContainerRef} className="hero-text-container pt-16 px-8 md:px-16 max-w-3xl 3xl:max-w-6xl mx-auto w-full" style={{ position: "relative", zIndex: 2, transform: "translate(calc(var(--mouse-x) * 10px), calc(var(--mouse-y) * 6px))" }}>
                <h2 className="hero-headline text-2xl sm:text-3xl md:text-4xl 3xl:text-6xl leading-snug md:leading-snug font-serif text-white">
                    <span className="text-background-dark">{renderWords(subheadline)}</span>
                </h2>
                <p className="hero-body text-base sm:text-lg 3xl:text-3xl leading-relaxed mt-8 3xl:mt-12 max-w-xl 3xl:max-w-4xl font-sans text-white">
                    <span className="text-background-dark">{renderWords(bodyText)}</span>
                </p>
                <p className="hero-tagline text-xl sm:text-2xl md:text-3xl 3xl:text-5xl mt-10 3xl:mt-14 font-serif text-white">
                    <span className="text-background-dark">{renderWords(tagline)}</span>
                </p>
            </div>
        </section>
    );
}

export default Hero;
