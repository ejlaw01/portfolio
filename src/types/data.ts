export interface SiteData {
    contact: ContactData;
    hero: HeroData;
    work: WorkData;
}

export interface ContactData {
    intro: string;
    body: string;
    headline: string;
    name: string;
    title: string;
    email: string;
    location: string;
}

export interface HeroData {
    headline: string;
    subheadline: string;
    bodyText: string;
    tagline: string;
    avatarImg: {
        filename: string;
        alt: string;
    };
}

export interface ProjectMedia {
    filename: string;
    alt: string;
}

export interface ProjectLink {
    text: string;
    url: string;
}

export interface ProjectFeature {
    text: string;
}

export interface Project {
    shortTitle: string;
    title: string;
    type: string;
    description: string;
    features?: ProjectFeature[];
    media: ProjectMedia | null;
    btnLink: ProjectLink | null;
    tech: string[];
}

export interface WorkData {
    headline: string;
    projects: Project[];
}
