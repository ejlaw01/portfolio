import { useEffect, useState, useRef } from "react";
import Container from "../components/Container";
import Hero from "../components/Hero";
import Nav from "../components/Nav";
import Work from "../components/Work";
import About from "../components/About";
import Footer from "../components/Footer";
import Checkerboard from "../components/Checkerboard";
import PageLoader from "../components/PageLoader";
import preventOrphans from "../utils/preventOrphans";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

function Home() {
    const [entranceDone, setEntranceDone] = useState(false);
    const brandingRef = useRef<HTMLHeadingElement>(null);
    const heroLogoRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        preventOrphans();
    }, []);

    // Entrance animation: reveal letters, then pixelated → sharp
    useGSAP(() => {
        if (!brandingRef.current) return;

        const h1 = brandingRef.current;
        const letters = h1.querySelectorAll(".brand-letter");
        const logo = heroLogoRef.current;
        const filterEl = document.getElementById("pixelate-composite");
        const morphEl = document.getElementById("pixelate-morph");

        if (!logo || !filterEl || !morphEl) return;

        const allChars = [...Array.from(letters), logo];

        // Start hidden, type in: BIT (pause) LORE using visibility
        allChars.forEach((el) => { (el as HTMLElement).style.visibility = "hidden"; });

        // B, I, T (indices 0, 1, 2)
        for (let i = 0; i < 3; i++) {
            gsap.delayedCall(0.2 + i * 0.06, () => {
                (allChars[i] as HTMLElement).style.visibility = "visible";
            });
        }
        // space + L, O, R, E (indices 3, 4, 5, 6, 7)
        for (let i = 3; i < allChars.length; i++) {
            gsap.delayedCall(0.55 + (i - 3) * 0.06, () => {
                (allChars[i] as HTMLElement).style.visibility = "visible";
            });
        }

        // Phase 2: De-pixelate (slow start, accelerates)
        const proxy = { size: 24 };

        gsap.to(proxy, {
            size: 1,
            duration: 3.5,
            ease: "power2.in",
            delay: 0.2,
            onUpdate: () => {
                const s = Math.round(proxy.size);
                filterEl.setAttribute("width", String(s));
                filterEl.setAttribute("height", String(s));
                morphEl.setAttribute("radius", String(Math.floor(s / 2)));

                if (s <= 1) {
                    h1.style.filter = "none";
                }
            },
            onComplete: () => {
                setEntranceDone(true);
            },
        });
    });

    // Scroll animation: font weight wipe + re-pixelate on scroll
    useGSAP(() => {
        if (!brandingRef.current || !entranceDone) return;

        // Font weight wipe on scroll
        gsap.fromTo(
            brandingRef.current,
            { fontWeight: 800 },
            {
                fontWeight: 200,
                ease: "none",
                scrollTrigger: {
                    trigger: brandingRef.current,
                    start: "top 20%",
                    end: "bottom top",
                    scrub: 0.5,
                },
            }
        );

        // Re-pixelate on scroll
        const scrollProxy = { size: 1 };
        const scrollFilterEl = document.getElementById("pixelate-composite");
        const scrollMorphEl = document.getElementById("pixelate-morph");

        if (scrollFilterEl && scrollMorphEl) {
            gsap.to(scrollProxy, {
                size: 30,
                ease: "none",
                scrollTrigger: {
                    trigger: brandingRef.current,
                    start: "center top",
                    end: "bottom top",
                    scrub: 0.5,
                },
                onUpdate: () => {
                    const s = Math.round(scrollProxy.size);
                    scrollFilterEl.setAttribute("width", String(s));
                    scrollFilterEl.setAttribute("height", String(s));
                    scrollMorphEl.setAttribute("radius", String(Math.floor(s / 2)));

                    if (s > 1) {
                        brandingRef.current!.style.filter = "url(#pixelate)";
                    } else {
                        brandingRef.current!.style.filter = "none";
                    }
                },
            });
        }
    }, { dependencies: [entranceDone] });

    return (
        <main>
            <PageLoader onComplete={() => {}} />
            <Nav />

            {/* SVG pixelate filter */}
            <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style={{ position: "absolute" }}>
                <filter id="pixelate" x="0" y="0">
                    <feFlood x="0" y="0" height="1" width="1" />
                    <feComposite id="pixelate-composite" width="20" height="20" />
                    <feTile result="tileResult" />
                    <feComposite in="SourceGraphic" in2="tileResult" operator="in" />
                    <feMorphology id="pixelate-morph" operator="dilate" radius="10" />
                </filter>
            </svg>

            {/* Section 1: Full-viewport brand moment */}
            <section className="brand-section flex items-center justify-center" style={{ height: "80svh" }}>
                <h1 ref={brandingRef} className="font-sans text-[14vw] md:text-[12vw] leading-none flex justify-between items-center w-full px-8 md:px-16" style={{ fontWeight: 800, filter: "url(#pixelate)" }}>
                    {"BIT LORE".split("").map((char, i) => (
                        char === "O" ? (
                            <img key={i} ref={heroLogoRef} src="/img/logo.svg" alt="O" className="h-[0.75em] brand-logo" />
                        ) : (
                            <span key={i} className="brand-letter">
                                {char === " " ? "\u00A0" : char}
                            </span>
                        )
                    ))}
                </h1>
            </section>

            {/* Section 2: Hero / Intro */}
            <div className="hero-section">
                <Hero />
            </div>

            {/* Section 3: Work */}
            <div className="bg-pink-50">
                <Work />
            </div>

            {/* Section 4: About */}
            <Container>
                <About />
            </Container>

            {/* Section 5: Footer */}
            <Container>
                <Footer />
            </Container>
            <Checkerboard classes="-mb-14 w-full h-[100px] bg-[length:100px]" />
        </main>
    );
}

export default Home;
