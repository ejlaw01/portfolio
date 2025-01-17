import data from "/public/data.json";
import parse from "html-react-parser";

type pageData = {
    headline: string;
    projects: Array<project>;
}

type project = {
    title: string;
    description: string;
    features?: Array<{ text: string; url?: string }>;
    media: { url: string; alt: string };
    btnLink?: { url: string; text: string };
}

function Work() {
    const { headline, projects } : pageData = data.work;

    return (
        <section id="work-section" className="min-h-screen py-12">
            <h2>{parse(headline)}</h2>
            <ul className="projects">
                {projects.map(({ title, description, features, media, btnLink } : project, index : number) => {
                    return (
                        <li
                            key={`project-${index}`}
                            className={`project flex flex-col md:flex-row gap-10 py-10 ${
                                index > 0 && " border-t-2 border-pink-100"
                            }`}
                        >
                            <div className="md:basis-2/5 border-8 border-white">
                                <img src={media.url || "https://placehold.co/1440x1024"} alt={media.alt} />
                            </div>
                            <div className="md:basis-3/5 flex flex-col">
                                <h3 className="font-bold">{title}</h3>
                                <p>{description}</p>
                                {features && features.length ? (
                                    <ul>
                                        {features.map(({ text, url }, index) => {
                                            return (
                                                <li key={`feature-${index}`}>
                                                    {url ? <a href={url}>{text}</a> : text}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    ""
                                )}
                                {btnLink && (
                                    <a className="btn self-start mt-4" href={btnLink.url}>
                                        {btnLink.text}
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
