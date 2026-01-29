import data from "../../public/data.json";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import parse from "html-react-parser";
import Checkerboard from "./Checkerboard";
import Scroller from "./Scroller";
import TextHoverGrow from "./TextHoverGrow";

gsap.registerPlugin(ScrollTrigger);

type pageData = {
    headline: string;
    subheadline?: string;
    bodyText?: string;
    avatarImg: { filename: string; alt: string };
};

type HeroProps = {
    isLoaded?: boolean;
};

function Hero({ isLoaded = false }: HeroProps) {
    const { headline, subheadline, bodyText, avatarImg }: pageData = data.hero;

    const heroRef = useRef<HTMLElement>(null);

    // Mouse follow effect using CSS custom properties (desktop only)
    useEffect(() => {
        const hero = heroRef.current;
        if (!hero) return;

        // Disable on mobile/touch devices
        const isDesktop = window.matchMedia("(min-width: 768px)").matches;
        if (!isDesktop) return;

        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;
        let rafId: number;

        const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

        const animate = () => {
            currentX = lerp(currentX, mouseX, 0.08);
            currentY = lerp(currentY, mouseY, 0.08);

            hero.style.setProperty("--mouse-x", currentX.toString());
            hero.style.setProperty("--mouse-y", currentY.toString());

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

    // Staggered fade + slide up entrance animation
    useGSAP(() => {
        if (!isLoaded) return;

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Imagery first, then all content together
        tl.to(".hero__checkerboard-wrapper", { y: 0, duration: 1.2 }, 0)
          .to(".hero__avatar-wrapper", { y: 0, opacity: 1, duration: 1.0 }, 0.3)
          .to(".hero__content", {
              y: 0,
              opacity: 1,
              duration: 0.9,
              onComplete: () => {
                  // Restore CSS variable mouse-follow transform (desktop only)
                  const isDesktop = window.matchMedia("(min-width: 768px)").matches;
                  if (isDesktop) {
                      const content = document.querySelector(".hero__content") as HTMLElement;
                      if (content) {
                          content.style.transform = "translate(calc(var(--mouse-x) * 5px), calc(var(--mouse-y) * 3px))";
                      }
                  }
              }
          }, 0.6);
    }, { dependencies: [isLoaded] });

    // Scroll-triggered parallax (only after entrance animation completes)
    useGSAP(() => {
        if (!isLoaded) return;

        // Delay slightly to ensure entrance animation has set the proper values
        const timer = setTimeout(() => {
            gsap.timeline({
                scrollTrigger: {
                    trigger: ".hero-section",
                    start: "bottom bottom",
                    end: "bottom top",
                    scrub: 0.3,
                },
            })
                .fromTo(".hero__checkerboard-wrapper",
                    { y: 0, opacity: 1 },
                    { y: -60, opacity: 0.2 }
                )
                .fromTo(
                    ".hero__avatar-wrapper",
                    { y: 0, opacity: 1 },
                    { y: -40, opacity: 0.4 },
                    "<"
                )
                .fromTo(
                    ".hero__content",
                    { opacity: 1 },
                    { opacity: 0.2 },
                    "<"
                );
        }, 1600); // After entrance animation completes (~1.5s)

        return () => clearTimeout(timer);
    }, { dependencies: [isLoaded] });

    return (
        <section
            ref={heroRef}
            className="hero min-h-[85vh] flex flex-col-reverse sm:flex-row justify-between items-center sm:gap-12"
            style={{ "--mouse-x": "0", "--mouse-y": "0" } as React.CSSProperties}
        >
            <div
                className="hero__content basis-3/5 grow-0 flex flex-col justify-between gap-5 sm:h-3/4 py-6 sm:py-12 z-20"
                style={{ opacity: 0, transform: "translateY(40px)" }}
            >
                <h1>
                    I'm Ethan, founder of <TextHoverGrow text="Bit Lore" className="font-semibold" />
                </h1>
                <p className="text-3xl leading-relaxed">
                    <span className="text-background">{parse(subheadline)}</span>
                </p>
                <p className="text-lg mt-5 max-w-[30rem]">
                    <span className="text-background">{parse(bodyText)}</span>
                </p>
                <div className="self-start mt-auto">
                    <Scroller target="work-section" />
                </div>
            </div>
            <div
                className="hero__imagery basis-2/5 relative self-stretch flex flex-col max-h-screen py-6 sm:py-12"
            >
                <div className="hero__avatar-wrapper relative w-2/3 sm:w-full mt-[50px] sm:mt-auto ms-auto my-auto z-10" style={{ opacity: 0, transform: "translateY(60px)" }}>
                    <img
                        src={`/img/hero/${avatarImg.filename}`}
                        alt={avatarImg.alt}
                        className="hero__avatar object-cover max-h-full rounded-2xl"
                        style={{ transform: "translate(calc(var(--mouse-x) * 15px), calc(var(--mouse-y) * 10px))" }}
                    />
                </div>
                <div className="hero__checkerboard-wrapper absolute h-[450px] sm:h-[550px] w-[250px] sm:w-[350px] sm:top-[20%] right-[40%] lg:right-[60%]" style={{ transform: "translateY(80px)" }}>
                    <Checkerboard
                        classes="hero__checkerboard h-full w-full rounded-2xl bg-[length:100px]"
                        style={{ transform: "translate(calc(var(--mouse-x) * 8px), calc(var(--mouse-y) * 6px))" }}
                    />
                </div>
            </div>
        </section>
    );
}

export default Hero;
