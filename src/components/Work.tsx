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
}

type project = {
    title: string;
    type?: string;
    description?: string;
    features?: Array<{ text: string; url?: string }>;
    media?: { filename: string; alt: string };
    tech?: Array<string>;
    btnLink?: { url: string; text: string };
    repoUrl?: string;
}

function Work() {
    const { headline, projects } : pageData = data.work;

    function getImgPath(filename: string) {
        return filename ? `/img/work/${filename}` : "https://placehold.co/1440x1024";
    }

    //fade in projects on scroll into view
    const projectsList = useRef(null);
    useGSAP(
        () => {
            const projectEls = gsap.utils.toArray('.project') as HTMLElement[];
            projectEls.forEach((project) => {
                const anim = gsap.fromTo(project, {autoAlpha: 0, y: 50}, {duration: 1, autoAlpha: 1, y: 0});
                ScrollTrigger.create({
                    trigger: project,
                    animation: anim,
                    start: 'top 80%',
                    once: true,
                });
            });
        },
        { scope: projectsList }
    );



    return (
        <section id="work-section" className="min-h-screen py-12">
            <h2>{parse(headline)}</h2>
            <ul className="projects" ref={projectsList} >
                {projects.map(({ title, type, description, features, media, tech, btnLink, repoUrl } : project, index : number) => {
                    return (
                        <li
                            key={`project-${index}`}
                            className={`project flex flex-col md:flex-row gap-10 py-10 ${
                                index < projects.length - 1 && " border-b-2 border-pink-100"
                            }`}
                        >
                            <div className="md:basis-2/5">
                                {media && (
                                    <div className="border-8 border-white">
                                        <img src={getImgPath(media.filename)} alt={media.alt} />
                                    </div>
                                )}
                            </div>
                            <div className="md:basis-3/5 flex flex-col gap-4">
                                <div>
                                    <h3 className="inline">{parse(title)}</h3>
                                    {type && <span className='ms-2 italic text-base font-sans font-light'>{type}</span>}
                                </div>
                                { tech && tech.length ? (
                                    <ul className="flex flex-wrap gap-2">
                                        {tech.map((item, index) => { return <li key={`tech-${index}`} className="rounded-full bg-pink-100 px-3 py-1 text-sm font-semibold leading-5 text-pink-800 font-sans">{item}</li> })}
                                    </ul>
                                ) : ""}
                                { description && (
                                    <p className="mt-3">{parse(description)}</p>
                                )}
                                {features && features.length ? (
                                    <ul className="-mt-3">
                                        {features.map(({ text, url }, index) => {
                                            return (
                                                <li key={`feature-${index}`}>
                                                    —&nbsp;{url ? <a href={url}>{text}</a> : text}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    ""
                                )}
                                {btnLink && (
                                    <a className="btn self-start" href={btnLink.url} target="_blank" rel="noopener noreferrer">
                                        {btnLink.text}
                                    </a>
                                )}
                                {repoUrl && (
                                    <a className="mt-auto self-start text-pink-900" href={repoUrl} target="_blank" rel="noopener noreferrer">
                                        <FaGithub size={32} />
                                    </a>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

export default Work;
