import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import parse from "html-react-parser";
import data from "../../public/data.json";
import PixelGrid from "./PixelGrid";

gsap.registerPlugin(ScrollTrigger);

type PageData = {
    subheadline?: string;
    bodyText?: string;
};

function Hero() {
    const { subheadline, bodyText }: PageData = data.hero;
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        if (!sectionRef.current) return;
        const lines = sectionRef.current.querySelectorAll(".hero-line");
        gsap.set(lines, { opacity: 0, y: 40 });
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
            onEnter: () => {
                gsap.to(lines, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    stagger: 0.15,
                });
            },
        });
    });

    return (
        <section
            ref={sectionRef}
            style={{ position: "relative", overflow: "hidden", height: "100svh", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}
        >
            <PixelGrid style={{ position: "absolute", inset: 0, zIndex: 0 }} />
            <div style={{ position: "relative", zIndex: 1, padding: "0 2rem", maxWidth: "64rem", margin: "0 auto", width: "100%" }}>
                <p className="hero-line" style={{ fontSize: "clamp(1.875rem, 4vw, 3rem)", lineHeight: 1.3, fontFamily: "serif" }}>
                    {parse(subheadline)}
                </p>
                <p className="hero-line" style={{ fontSize: "clamp(1.125rem, 2vw, 1.25rem)", lineHeight: 1.7, marginTop: "2rem", maxWidth: "42rem", fontFamily: "sans-serif", color: "#be185d" }}>
                    {parse(bodyText)}
                </p>
            </div>
        </section>
    );
}

export default Hero;
