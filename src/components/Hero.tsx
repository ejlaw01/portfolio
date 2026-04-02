import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import data from "../../public/data.json";
gsap.registerPlugin(ScrollTrigger);

type PageData = {
    subheadline?: string;
    bodyText?: string;
    tagline?: string;
};

const WAVE_HEIGHT = 120;

// Sine-wave: white fill above the curve, transparent below (grid shows through)
const WAVE_PAD = 10; // extra viewBox units on each side

function generateSinePath() {
    const points: string[] = [];
    const steps = 200;
    for (let i = 0; i <= steps; i++) {
        const x = -WAVE_PAD + (i / steps) * (100 + WAVE_PAD * 2);
        const y = WAVE_HEIGHT / 2 + Math.sin((i / steps) * Math.PI * 3) * (WAVE_HEIGHT * 0.35);
        points.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
    }
    return `${points.join(" ")} L ${100 + WAVE_PAD} -${WAVE_PAD} L -${WAVE_PAD} -${WAVE_PAD} Z`;
}

const sinePath = generateSinePath();

function Hero() {
    const { subheadline, bodyText, tagline }: PageData = data.hero;
    const sectionRef = useRef<HTMLElement>(null);
    const waveRef = useRef<SVGSVGElement>(null);
    const textContainerRef = useRef<HTMLDivElement>(null);

    // Mouse-follow effect (desktop only)
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const isDesktop = window.matchMedia("(min-width: 768px)").matches;
        if (!isDesktop) return;

        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;
        let rafId: number;

        const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

        const animate = () => {
            currentX = lerp(currentX, mouseX, 0.06);
            currentY = lerp(currentY, mouseY, 0.06);

            section.style.setProperty("--mouse-x", currentX.toString());
            section.style.setProperty("--mouse-y", currentY.toString());

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
    }, []);

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
                <path d={sinePath} fill="white" />
            </svg>

            <div ref={textContainerRef} className="hero-text-container pt-16 px-8 md:px-16 max-w-3xl 3xl:max-w-6xl mx-auto w-full" style={{ position: "relative", zIndex: 2, transform: "translate(calc(var(--mouse-x) * 10px), calc(var(--mouse-y) * 6px))" }}>
                <h2 className="hero-headline text-2xl sm:text-3xl md:text-4xl 3xl:text-6xl leading-snug md:leading-snug font-serif text-white">
                    {renderWords(subheadline)}
                </h2>
                <p className="hero-body text-base sm:text-lg 3xl:text-3xl leading-relaxed mt-8 3xl:mt-12 max-w-xl 3xl:max-w-4xl font-sans text-white">
                    {renderWords(bodyText)}
                </p>
                <p className="hero-tagline text-xl sm:text-2xl md:text-3xl 3xl:text-5xl mt-10 3xl:mt-14 font-serif text-white">
                    {renderWords(tagline)}
                </p>
            </div>
        </section>
    );
}

export default Hero;
