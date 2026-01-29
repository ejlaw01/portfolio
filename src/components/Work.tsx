import data from "../../public/data.json";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
    const projectsRef = useRef<HTMLUListElement>(null);
    const stickyHeaderRef = useRef<HTMLDivElement>(null);
    const stickyWrapperRef = useRef<HTMLDivElement>(null);

    function getImgPath(filename: string) {
        return filename ? `/img/work/${filename}` : "https://placehold.co/1440x1024";
    }

    useGSAP(
        () => {
            const projectEls = gsap.utils.toArray(".project") as HTMLElement[];
            const isDesktop = window.matchMedia("(min-width: 768px)").matches;

            // Project fade effect only on desktop
            if (isDesktop) {
                // Set initial state - first project visible, rest faded
                projectEls.forEach((project, i) => {
                    gsap.set(project, { opacity: i === 0 ? 1 : 0.1 });
                });

                // Create scroll-linked opacity/scale for each project
                projectEls.forEach((project, index) => {
                    const isLast = index === projectEls.length - 1;
                    ScrollTrigger.create({
                        trigger: project,
                        start: "top 80%",
                        end: "bottom 20%",
                        onUpdate: (self) => {
                            const progress = self.progress;
                            // Peak opacity at center (progress = 0.5), with dead zone
                            const deadZone = 0.2; // No fade within 20% of center
                            const rawDistance = Math.abs(progress - 0.5) * 2;
                            const distanceFromCenter = Math.max(0, (rawDistance - deadZone) / (1 - deadZone));
                            // For last project, only fade in (not out when scrolling past)
                            const fadeOut = isLast ? Math.max(0, ((0.5 - progress) * 2 - deadZone) / (1 - deadZone)) : distanceFromCenter;
                            // Aggressive fade - use power curve
                            const opacity = 1 - Math.pow(Math.max(0, fadeOut), 0.5) * 0.95;
                            const scale = 1 - Math.max(0, fadeOut) * 0.02;

                            gsap.to(project, {
                                opacity: Math.max(0.05, opacity),
                                scale: Math.max(0.98, scale),
                                duration: 0.1,
                                ease: "none",
                            });
                        },
                    });
                });
            }

            // Fade out "Work" heading after it stops being sticky (when wrapper ends)
            if (stickyHeaderRef.current && stickyWrapperRef.current) {
                ScrollTrigger.create({
                    trigger: stickyWrapperRef.current,
                    start: "bottom 20%", // When wrapper bottom reaches near top of viewport
                    end: "bottom top",   // When wrapper bottom exits viewport
                    scrub: true,
                    onUpdate: (self) => {
                        if (stickyHeaderRef.current) {
                            gsap.set(stickyHeaderRef.current, { opacity: 1 - self.progress });
                        }
                    },
                });
            }

        },
        { scope: sectionRef }
    );

    const allButLast = projects.slice(0, -1);
    const lastProject = projects[projects.length - 1];

    const renderProject = (
        { title, type, description, features, media, tech, btnLink, repoUrl }: project,
        index: number,
        enableSnap: boolean = true
    ) => (
        <li
            key={`project-${index}`}
            className={`project flex items-center py-8 ${enableSnap ? "snap-center" : ""}`}
            style={index === 0 ? { scrollMarginTop: "30vh" } : undefined}
        >
            <div className="container">
                <div
                    className="flex flex-col-reverse md:flex-row gap-10 items-center bg-[#FCF9F9] rounded-3xl p-8 py-12 md:p-12 md:py-16 overflow-hidden min-h-[60vh]"
                    style={{ boxShadow: "0 8px 0 0 #F1E4E4" }}
                >
                    <div className="basis-1/2 shrink-0 min-w-0">
                        {media && (
                            <div className="border-8 border-white rounded-lg overflow-hidden">
                                <img src={getImgPath(media.filename)} alt={media.alt} />
                            </div>
                        )}
                    </div>
                    <div className="basis-1/2 flex flex-col gap-4 min-w-0 overflow-hidden">
                        <div className="flex flex-col min-[1200px]:flex-row min-[1200px]:items-baseline">
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
                </div>
            </div>
        </li>
    );

    return (
        <section ref={sectionRef} id="work-section" className="py-12">
            {/* Wrapper for sticky header - ends before last project */}
            <div ref={stickyWrapperRef} className="relative">
                <div ref={stickyHeaderRef} className="md:sticky top-4 z-10 py-4">
                    <div className="container">
                        <h2
                            className="text-outline"
                            style={{ "--bg": "#F8F1F1" } as React.CSSProperties}
                        >
                            {parse(headline)}
                        </h2>
                    </div>
                </div>
                <ul className="projects" ref={projectsRef}>
                    {allButLast.map((project, index) => renderProject(project, index, true))}
                </ul>
            </div>
            {/* Last project outside the sticky wrapper */}
            <ul className="projects">
                {renderProject(lastProject, projects.length - 1, true)}
            </ul>
        </section>
    );
}

export default Work;
