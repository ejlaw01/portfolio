import { forwardRef } from "react";
import type { PanelProject } from "./types";

interface ProjectButtonsProps {
    projects: PanelProject[];
    activeProject: number | null;
    onSelect: (index: number) => void;
}

const ProjectButtons = forwardRef<HTMLUListElement, ProjectButtonsProps>(
    ({ projects, activeProject, onSelect }, ref) => (
        <ul
            ref={ref}
            className="absolute left-1/2 bottom-16 -translate-x-1/2 w-full flex justify-center gap-2 list-none z-20 flex-wrap px-4 lg:px-0"
        >
            {projects.map((project, i) => (
                <li
                    key={i}
                    className={`uppercase font-sans text-xs xl:text-sm 3xl:text-lg font-medium px-4 py-2 xl:px-5 xl:py-2.5 3xl:px-8 3xl:py-3.5 border border-pink-300 shadow-[4px_4px_0px_-1px_theme(colors.pink.400)] cursor-pointer transition-colors ${
                        activeProject === i
                            ? "text-white bg-pink-800"
                            : "text-pink-800 bg-pink-50 hover:text-pink-900 hover:bg-pink-200"
                    }`}
                    onClick={() => onSelect(i)}
                >
                    {project.name}
                </li>
            ))}
        </ul>
    )
);

ProjectButtons.displayName = "ProjectButtons";

export default ProjectButtons;
