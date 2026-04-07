import type { ProjectLink } from "@/types/data";

export interface PanelProject {
    name: string;
    image: string;
    title: string;
    type: string;
    description: string;
    tech: string[];
    btnLink: ProjectLink | null;
}
