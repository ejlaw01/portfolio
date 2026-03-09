import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import data from "../../public/data.json";
import PixelGrid from "./PixelGrid";

gsap.registerPlugin(ScrollTrigger);

type PageData = {
    subheadline?: string;
    bodyText?: string;
};

const WAVE_HEIGHT = 120;

// Sine-wave: white fill above the curve, transparent below (grid shows through)
function generateSinePath() {
    const points: string[] = [];
    const steps = 200;
    for (let i = 0; i <= steps; i++) {
        const x = (i / steps) * 100;
        const y = WAVE_HEIGHT / 2 + Math.sin((i / steps) * Math.PI * 3) * (WAVE_HEIGHT * 0.35);
        points.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
    }
    // Close upward: white fills from wave curve to top edge
    return `${points.join(" ")} L 100 0 L 0 0 Z`;
}

const sinePath = generateSinePath();

function Hero() {
    const { subheadline, bodyText }: PageData = data.hero;
    const sectionRef = useRef<HTMLElement>(null);
    const waveRef = useRef<SVGSVGElement>(null);
    const cursorRef = useRef<HTMLSpanElement>(null);
    const textContainerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!sectionRef.current) return;

        const headlineChars = sectionRef.current.querySelectorAll(".hero-headline .hero-char");
        const bodyChars = sectionRef.current.querySelectorAll(".hero-body .hero-char");
        const cursor = cursorRef.current;

        gsap.set([headlineChars, bodyChars], { visibility: "hidden" });
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

                // Show cursor at first headline char position
                tl.call(() => {
                    if (cursor && headlineChars[0] && container) {
                        const charRect = headlineChars[0].getBoundingClientRect();
                        const containerRect = container.getBoundingClientRect();
                        cursor.style.left = `${charRect.left - containerRect.left}px`;
                        cursor.style.top = `${charRect.top - containerRect.top}px`;
                        cursor.style.fontSize = window.getComputedStyle(headlineChars[0]).fontSize;
                        cursor.style.visibility = "visible";
                    }
                });

                // Type headline chars
                headlineChars.forEach((char) => {
                    tl.call(() => {
                        (char as HTMLElement).style.visibility = "visible";
                        positionCursor(char);
                    }, [], "+=0.03");
                });

                // Pause before body
                tl.call(() => {
                    if (cursor && bodyChars[0] && container) {
                        const charRect = bodyChars[0].getBoundingClientRect();
                        const containerRect = container.getBoundingClientRect();
                        cursor.style.left = `${charRect.left - containerRect.left}px`;
                        cursor.style.top = `${charRect.top - containerRect.top}px`;
                        cursor.style.fontSize = window.getComputedStyle(bodyChars[0]).fontSize;
                    }
                }, [], "+=0.3");

                // Type body chars
                bodyChars.forEach((char) => {
                    tl.call(() => {
                        (char as HTMLElement).style.visibility = "visible";
                        positionCursor(char);
                    }, [], "+=0.02");
                });

                // Hide cursor after typing finishes
                if (cursor) {
                    tl.to(cursor, { opacity: 0, duration: 0.3 }, "+=1");
                }
            },
        });
    });

    const renderChars = (text: string | undefined) =>
        text?.split("").map((char, i) => (
            <span key={i} className="hero-char" style={{ visibility: "hidden" }}>
                {char}
            </span>
        ));

    return (
        <section
            ref={sectionRef}
            className="bg-black"
            style={{ position: "relative", height: "100svh", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}
        >
            {/* Grid covers full section including wave area */}
            <PixelGrid style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: "none" }} />

            {/* Sine-wave: white fill above curve, grid visible below curve */}
            <svg
                ref={waveRef}
                viewBox={`0 0 100 ${WAVE_HEIGHT}`}
                preserveAspectRatio="none"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${WAVE_HEIGHT}px`,
                    zIndex: 1,
                }}
            >
                <path d={sinePath} fill="white" />
            </svg>

            <div ref={textContainerRef} className="px-8 md:px-16 max-w-2xl mx-auto w-full" style={{ position: "relative", zIndex: 2 }}>
                <p className="hero-headline text-2xl sm:text-3xl md:text-4xl leading-snug md:leading-snug font-serif text-white">
                    <span className="text-background-dark hero-headline-bg">
                        {renderChars(subheadline)}
                    </span>
                </p>
                <p className="hero-body text-base sm:text-lg leading-relaxed mt-8 max-w-xl font-sans text-white">
                    <span className="text-background-dark hero-body-bg">
                        {renderChars(bodyText)}
                    </span>
                </p>
                <span ref={cursorRef} className="hero-cursor text-white" style={{ visibility: "hidden", position: "absolute", pointerEvents: "none" }}>|</span>
            </div>
        </section>
    );
}

export default Hero;
