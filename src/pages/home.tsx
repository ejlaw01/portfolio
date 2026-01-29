import { useEffect, useState, useCallback, useRef } from "react";
import Container from "../components/Container";
// import Nav from "../components/Nav";
import Hero from "../components/Hero";
import Work from "../components/Work";
import Footer from "../components/Footer";
import Checkerboard from "../components/Checkerboard";
import PageLoader from "../components/PageLoader";
import preventOrphans from "../utils/preventOrphans";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

function Home() {
    const [isLoaded, setIsLoaded] = useState(false);
    const brandingRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        preventOrphans();
    }, []);

    const handleLoadComplete = useCallback(() => {
        setIsLoaded(true);
    }, []);

    // Animate font-weight on scroll
    useGSAP(() => {
        if (!brandingRef.current) return;

        gsap.fromTo(
            brandingRef.current,
            { fontWeight: 800 },
            {
                fontWeight: 200,
                ease: "none",
                scrollTrigger: {
                    trigger: brandingRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 0.3,
                },
            }
        );
    });

    return (
        <main>
            <PageLoader onComplete={handleLoadComplete} />
            <div className="hero-section">
                {/* <Nav /> */}
                <Container>
                    <h1 ref={brandingRef} className="font-sans text-[12vw] md:text-[10vw] leading-none py-8 flex justify-between" style={{ fontWeight: 800 }}>
                        {"BIT LORE".split("").map((char, i) => (
                            <span key={i}>
                                {char === " " ? "\u00A0" : char}
                            </span>
                        ))}
                    </h1>
                    <Hero isLoaded={isLoaded} />
                </Container>
            </div>
            <div className="bg-pink-50">
                <Work />
            </div>
            <Container>
                <Footer />
            </Container>
            <Checkerboard classes="-mb-14 w-full h-[100px] bg-[length:100px]" />
        </main>
    );
}

export default Home;
