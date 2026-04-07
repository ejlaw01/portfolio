import { forwardRef } from "react";
import { createPortal } from "react-dom";
import type { PanelProject } from "./types";

interface MobilePanelProps {
    project: PanelProject;
    visible: boolean;
    closing: boolean;
}

const MobilePanel = forwardRef<HTMLDivElement, MobilePanelProps>(
    ({ project, visible, closing }, ref) =>
        createPortal(
            <div
                ref={ref}
                className={`lg:hidden fixed top-0 left-0 right-0 z-[200] bg-dark/85 backdrop-blur-sm border-b border-pink-400/30 px-5 py-4 transition-all duration-300 ease-out ${
                    visible && !closing
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-full pointer-events-none"
                }`}
            >
                <div className="mobile-panel-content">
                    <span className="font-sans text-xs uppercase tracking-widest text-pink-300 mb-1 block">
                        {project.type}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-pink-100 mb-1">{project.title}</h3>
                    <p className="font-sans text-xs text-pink-200 leading-relaxed mb-2">
                        {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {project.tech.map((tag) => (
                            <span
                                key={tag}
                                className="bg-pink-300/40 text-pink-100 text-[10px] font-sans px-2 py-0.5 rounded-full border border-pink-300/50"
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
                            className="inline-flex items-center gap-2 font-sans text-xs font-medium text-white bg-pink-500/80 border border-pink-400/50 px-3 py-1.5 rounded hover:bg-pink-400/80 transition-colors w-fit"
                        >
                            {project.btnLink.text}
                            <span aria-hidden="true">&rarr;</span>
                        </a>
                    )}
                </div>
            </div>,
            document.body,
        )
);

MobilePanel.displayName = "MobilePanel";

export default MobilePanel;
