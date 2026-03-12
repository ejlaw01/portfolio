import { useRef, useEffect } from "react";
import data from "../../public/data.json";
import parse from "html-react-parser";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Checkerboard from "./Checkerboard";

gsap.registerPlugin(ScrollTrigger);

type pageData = {
    intro: string;
    body: string;
    headline: string;
};

const About = () => {
    const { intro, body, headline }: pageData = data.contact;
    const { avatarImg } = data.hero;
    const sectionRef = useRef<HTMLElement>(null);

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
            currentX = lerp(currentX, mouseX, 0.08);
            currentY = lerp(currentY, mouseY, 0.08);

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

    // Staggered entrance animation on scroll
    useGSAP(() => {
        if (!sectionRef.current) return;

        const tl = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 75%",
                once: true,
            },
        });

        tl.to(".about__checkerboard-wrapper", { y: 0, duration: 1.2 }, 0)
          .to(".about__avatar-wrapper", { y: 0, opacity: 1, duration: 1.0 }, 0.3)
          .to(".about__content", { y: 0, opacity: 1, duration: 0.9 }, 0.6);
    });

    // Subtle parallax on scroll
    useGSAP(() => {
        if (!sectionRef.current) return;

        gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom bottom",
                scrub: 0.3,
            },
        })
            .fromTo(".about__checkerboard-wrapper",
                { y: 200 },
                { y: 0 }
            )
            .fromTo(".about__avatar-wrapper",
                { y: 140 },
                { y: 0 },
                "<"
            )
            .fromTo(".about__content",
                { y: 80 },
                { y: 0 },
                "<"
            );
    });

    return (
        <section
            ref={sectionRef}
            id="contact-section"
            className="relative overflow-visible py-12"
            style={{ "--mouse-x": "0", "--mouse-y": "0" } as React.CSSProperties}
        >
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center sm:gap-12">
                <div
                    className="about__content relative z-10 basis-3/5 grow-0 flex flex-col gap-8 py-6 sm:py-12"
                    style={{ opacity: 0, transform: "translateY(40px)" }}
                >
                    <div style={{ transform: "translate(calc(var(--mouse-x) * 10px), calc(var(--mouse-y) * 6px))" }}>
                        <h2 className="!text-4xl !leading-snug !font-normal">
                            <span className="text-background">{parse(intro)}</span>
                        </h2>
                        <p className="text-lg max-w-2xl mt-8">
                            <span className="text-background">{parse(body)}</span>
                        </p>
                        <h3 className="font-normal mt-8"><span className="text-background">{parse(headline)}</span></h3>
                    </div>
                </div>
                <div className="basis-2/5 relative self-stretch flex flex-col max-h-screen py-6 sm:py-12">
                    <div
                        className="about__avatar-wrapper relative w-2/3 sm:w-full mt-[50px] sm:mt-auto ms-auto my-auto z-10"
                        style={{ opacity: 0, transform: "translateY(60px)" }}
                    >
                        <img
                            src={`/img/hero/${avatarImg.filename}`}
                            alt={avatarImg.alt}
                            className="object-cover max-h-full rounded-2xl"
                            style={{ transform: "translate(calc(var(--mouse-x) * 15px), calc(var(--mouse-y) * 10px))" }}
                        />
                    </div>
                    <div
                        className="about__checkerboard-wrapper absolute h-[450px] sm:h-[550px] w-[250px] sm:w-[350px] sm:top-[20%] right-[40%] lg:right-[60%]"
                        style={{ transform: "translateY(80px)" }}
                    >
                        <Checkerboard
                            classes="h-full w-full rounded-2xl bg-[length:100px]"
                            style={{ transform: "translate(calc(var(--mouse-x) * 8px), calc(var(--mouse-y) * 6px))" }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
