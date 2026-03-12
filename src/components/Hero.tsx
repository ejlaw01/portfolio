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
    const cursorRef = useRef<HTMLSpanElement>(null);
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

        const headlineChars = sectionRef.current.querySelectorAll(".hero-headline .hero-char");
        const bodyChars = sectionRef.current.querySelectorAll(".hero-body .hero-char");
        const taglineChars = sectionRef.current.querySelectorAll(".hero-tagline .hero-char");
        const cursor = cursorRef.current;

        gsap.set([headlineChars, bodyChars, taglineChars], { visibility: "hidden" });
        if (cursor) gsap.set(cursor, { visibility: "hidden" });

        const container = textContainerRef.current;
        const positionCursor = (char: Element) => {
            if (!cursor || !container) return;
            const charRect = char.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            cursor.style.left = `${charRect.right - containerRect.left}px`;
            cursor.style.top = `${charRect.top - containerRect.top}px`;
            cursor.style.fontSize = window.getComputedStyle(char).fontSize;
            cursor.style.lineHeight = window.getComputedStyle(char).lineHeight;
        };

        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
            onEnter: () => {
                const tl = gsap.timeline();

                const typeSection = (chars: NodeListOf<Element>, speed: number, isFirst: boolean) => {
                    tl.call(() => {
                        if (cursor && chars[0] && container) {
                            const charRect = chars[0].getBoundingClientRect();
                            const containerRect = container.getBoundingClientRect();
                            cursor.style.left = `${charRect.left - containerRect.left}px`;
                            cursor.style.top = `${charRect.top - containerRect.top}px`;
                            cursor.style.fontSize = window.getComputedStyle(chars[0]).fontSize;
                            if (isFirst) cursor.style.visibility = "visible";
                        }
                    }, [], isFirst ? undefined : "+=0.15");

                    chars.forEach((char) => {
                        tl.call(() => {
                            (char as HTMLElement).style.visibility = "visible";
                            positionCursor(char);
                        }, [], `+=${speed}`);
                    });
                };

                typeSection(headlineChars, 0.015, true);
                typeSection(bodyChars, 0.01, false);
                typeSection(taglineChars, 0.015, false);

                if (cursor) {
                    tl.to(cursor, { opacity: 0, duration: 0.3 }, "+=1");
                }
            },
        });
    });

    const renderChars = (text: string | undefined) =>
        text?.split("").map((char, i) => (
            <span key={i} className="hero-char" style={{ visibility: "hidden", backgroundColor: "#121212", padding: "4px 0" }}>
                {char}
            </span>
        ));

    return (
        <section
            ref={sectionRef}
            className="bg-transparent"
            style={{ position: "relative", height: "100svh", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", "--mouse-x": "0", "--mouse-y": "0" } as React.CSSProperties}
        >
            <svg
                ref={waveRef}
                viewBox={`${-WAVE_PAD} ${-WAVE_PAD} ${100 + WAVE_PAD * 2} ${WAVE_HEIGHT + WAVE_PAD}`}
                preserveAspectRatio="none"
                style={{
                    position: "absolute",
                    top: "-20px",
                    left: "-20px",
                    width: "calc(100% + 40px)",
                    height: `${WAVE_HEIGHT + 40}px`,
                    zIndex: 1,
                    overflow: "visible",
                    maxWidth: "none",
                    transform: "translate(calc(var(--mouse-x) * 5px), calc(var(--mouse-y) * 3px))",
                }}
            >
                <path d={sinePath} fill="white" />
            </svg>

            <div ref={textContainerRef} className="hero-text-container px-8 md:px-16 max-w-3xl mx-auto w-full" style={{ position: "relative", zIndex: 2, transform: "translate(calc(var(--mouse-x) * 10px), calc(var(--mouse-y) * 6px))" }}>
                <h2 className="hero-headline text-2xl sm:text-3xl md:text-4xl leading-snug md:leading-snug font-serif text-white">
                    {renderChars(subheadline)}
                </h2>
                <p className="hero-body text-base sm:text-lg leading-relaxed mt-8 max-w-xl font-sans text-white">
                    {renderChars(bodyText)}
                </p>
                <p className="hero-tagline text-xl sm:text-2xl md:text-3xl mt-10 font-serif text-white">
                    {renderChars(tagline)}
                </p>
                <span ref={cursorRef} className="hero-cursor text-white" style={{ visibility: "hidden", position: "absolute", pointerEvents: "none", padding: "4px 0" }}>|</span>
            </div>
        </section>
    );
}

export default Hero;
