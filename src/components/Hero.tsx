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
    tagline?: string;
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
    return `${points.join(" ")} L 100 0 L 0 0 Z`;
}

const sinePath = generateSinePath();

function Hero() {
    const { subheadline, bodyText, tagline }: PageData = data.hero;
    const sectionRef = useRef<HTMLElement>(null);
    const waveRef = useRef<SVGSVGElement>(null);
    const cursorRef = useRef<HTMLSpanElement>(null);
    const textContainerRef = useRef<HTMLDivElement>(null);

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
                    }, [], isFirst ? undefined : "+=0.3");

                    chars.forEach((char, i) => {
                        const prev = i > 0 ? chars[i - 1].textContent : "";
                        const punctPause = prev === "." ? 0.25 : prev === "," ? 0.15 : 0;
                        tl.call(() => {
                            (char as HTMLElement).style.visibility = "visible";
                            positionCursor(char);
                        }, [], `+=${speed + punctPause}`);
                    });
                };

                typeSection(headlineChars, 0.03, true);
                typeSection(bodyChars, 0.02, false);
                typeSection(taglineChars, 0.03, false);

                if (cursor) {
                    tl.to(cursor, { opacity: 0, duration: 0.3 }, "+=1");
                }
            },
        });
    });

    const renderChars = (text: string | undefined) =>
        text?.split("").map((char, i) => (
            <span key={i} className="hero-char" style={{ visibility: "hidden", backgroundColor: "black", padding: "4px 0" }}>
                {char}
            </span>
        ));

    return (
        <section
            ref={sectionRef}
            className="bg-black"
            style={{ position: "relative", height: "100svh", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}
        >
            <PixelGrid style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: "none" }} />

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

            <div ref={textContainerRef} className="px-8 md:px-16 max-w-3xl mx-auto w-full" style={{ position: "relative", zIndex: 2 }}>
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
