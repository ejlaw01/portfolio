import { forwardRef } from "react";
import type { PanelProject } from "./types";

interface ProjectPanelProps {
    project: PanelProject;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

const ProjectPanel = forwardRef<HTMLDivElement, ProjectPanelProps>(
    ({ project, onMouseEnter, onMouseLeave }, ref) => (
        <div
            ref={ref}
            className="hidden lg:flex absolute left-0 top-0 h-full w-[30%] z-10 flex-col justify-center px-8 bg-gradient-to-r from-dark via-dark/80 to-transparent"
            style={{ visibility: "hidden", opacity: 0 }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <span className="panel-type font-sans text-xs uppercase tracking-widest text-pink-300 mb-2">
                <span className="text-background-dark">{project.type}</span>
            </span>
            <h3 className="panel-title font-serif text-3xl font-bold text-pink-100 mb-3">
                <span className="text-background-dark">{project.title}</span>
            </h3>
            <hr className="panel-divider w-12 border-pink-400 mb-4" />
            <p className="panel-desc font-sans text-sm text-pink-200 leading-relaxed mb-5">
                <span className="text-background-dark">{project.description}</span>
            </p>
            <div className="panel-tags flex flex-wrap gap-2 mb-6">
                {project.tech.map((tag) => (
                    <span
                        key={tag}
                        className="bg-pink-300/40 text-pink-100 text-xs font-sans px-3 py-1 rounded-full border border-pink-300/50"
                    >
                        {tag}
                    </span>
                ))}
            </div>
            {project.btnLink && (
                <a
                    href={project.btnLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="panel-cta pointer-events-auto inline-flex items-center gap-2 font-sans text-sm font-medium text-white bg-pink-500/80 border border-pink-400/50 px-4 py-2 rounded hover:bg-pink-400/80 hover:no-underline transition-colors w-fit"
                >
                    {project.btnLink.text}
                    <span aria-hidden="true">&rarr;</span>
                </a>
            )}
        </div>
    )
);

ProjectPanel.displayName = "ProjectPanel";

export default ProjectPanel;
