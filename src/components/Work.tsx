import data from "../../public/data.json";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import parse from "html-react-parser";
import { FaGithub } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

type pageData = {
    headline: string;
    projects: Array<project>;
};

type project = {
    title: string;
    type?: string;
    description?: string;
    features?: Array<{ text: string; url?: string }>;
    media?: { filename: string; alt: string };
    tech?: Array<string>;
    btnLink?: { url: string; text: string };
    repoUrl?: string;
};

function Work() {
    const { headline, projects }: pageData = data.work;
    const sectionRef = useRef<HTMLElement>(null);

    function getImgPath(filename: string) {
        return filename ? `/img/work/${filename}` : "https://placehold.co/1440x1024";
    }

    // Lenis smooth scroll
    useEffect(() => {
        const lenis = new Lenis();
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
        return () => {
            lenis.destroy();
        };
    }, []);

    useGSAP(
        () => {
            const isDesktop = window.matchMedia("(min-width: 768px)").matches;
            if (!isDesktop) return;

            const cards = gsap.utils.toArray<HTMLElement>(".stack-card");
            const totalCards = cards.length;
            const segmentSize = 1 / totalCards;

            const cardYOffset = 5;
            const cardScaleStep = 0.075;

            // Initial stacked positions
            cards.forEach((card, i) => {
                gsap.set(card, {
                    xPercent: -50,
                    yPercent: -50 + i * cardYOffset,
                    scale: 1 - i * cardScaleStep,
                });
            });

            ScrollTrigger.create({
                trigger: ".sticky-cards",
                start: "top top",
                end: `+=${window.innerHeight * 8}px`,
                pin: true,
                pinSpacing: true,
                scrub: 1,
                onUpdate: (self) => {
                    const progress = self.progress;

                    const activeIndex = Math.min(
                        Math.floor(progress / segmentSize),
                        totalCards - 1,
                    );
                    const segProgress = (progress - activeIndex * segmentSize) / segmentSize;

                    cards.forEach((card, i) => {
                        if (i < activeIndex) {
                            // Already peeled away
                            gsap.set(card, {
                                yPercent: -250,
                                rotationX: 35,
                            });
                        } else if (i === activeIndex) {
                            // Currently peeling
                            gsap.set(card, {
                                yPercent: gsap.utils.interpolate(-50, -200, segProgress),
                                rotationX: gsap.utils.interpolate(0, 35, segProgress),
                                scale: 1,
                            });
                        } else {
                            // Behind — waiting in stack
                            const behindIndex = i - activeIndex;
                            const currentYOffset = (behindIndex - segProgress) * cardYOffset;
                            const currentScale = 1 - (behindIndex - segProgress) * cardScaleStep;

                            gsap.set(card, {
                                yPercent: -50 + currentYOffset,
                                rotationX: 0,
                                scale: currentScale,
                            });
                        }
                    });
                },
            });
        },
        { scope: sectionRef }
    );

    const renderProjectCard = (
        { title, type, description, features, media, tech, btnLink, repoUrl }: project,
    ) => (
        <>
            <div className="stack-card__col stack-card__col--media">
                {media && (
                    <img src={getImgPath(media.filename)} alt={media.alt} />
                )}
            </div>
            <div className="stack-card__col stack-card__col--info">
                <div className="flex flex-col min-[1200px]:flex-row min-[1200px]:items-baseline flex-wrap">
                    <h3>{parse(title)}</h3>
                    {type && (
                        <span className="min-[1200px]:ms-2 italic text-base font-sans font-light">
                            {type}
                        </span>
                    )}
                </div>
                {tech && tech.length ? (
                    <ul className="flex flex-wrap gap-2">
                        {tech.map((item, idx) => (
                            <li
                                key={`tech-${idx}`}
                                className="rounded-full bg-pink-100 px-3 py-1 text-sm font-semibold leading-5 text-pink-800 font-sans"
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                ) : (
                    ""
                )}
                {description && <p className="mt-3">{parse(description)}</p>}
                {features && features.length ? (
                    <ul className="-mt-3 font-sans">
                        {features.map(({ text, url }, idx) => (
                            <li key={`feature-${idx}`}>
                                —&ensp;{url ? <a href={url}>{text}</a> : text}
                            </li>
                        ))}
                    </ul>
                ) : (
                    ""
                )}
                {btnLink && (
                    <a
                        className="btn self-start"
                        href={btnLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {btnLink.text}
                    </a>
                )}
                {repoUrl && (
                    <a
                        className="mt-auto self-start text-pink-900"
                        href={repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaGithub size={32} />
                    </a>
                )}
            </div>
        </>
    );

    return (
        <section ref={sectionRef} id="work-section" className="py-12">
            <div className="container mb-8">
                <h2
                    className="text-outline"
                    style={{ "--bg": "#F8F1F1" } as React.CSSProperties}
                >
                    {parse(headline)}
                </h2>
            </div>

            {/* Desktop stacking cards */}
            <div className="sticky-cards hidden md:block">
                {projects.map((project, index) => (
                    <div
                        key={`project-${index}`}
                        className="stack-card"
                        style={{ zIndex: projects.length - index }}
                    >
                        {renderProjectCard(project)}
                    </div>
                ))}
            </div>

            {/* Mobile stacked layout */}
            <ul className="md:hidden">
                {projects.map((project, index) => (
                    <li key={`project-mobile-${index}`} className="flex items-center py-8">
                        <div className="container">
                            <div
                                className="flex flex-col-reverse gap-10 items-center bg-[#FCF9F9] rounded-3xl p-8 py-12 overflow-hidden"
                                style={{ boxShadow: "0 8px 0 0 #F1E4E4" }}
                            >
                                {renderProjectCard(project)}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default Work;
