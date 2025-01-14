export const pageData = {
    hero: {
        headline: "Hi, my name is <span className='font-semibold'>Ethan</span>",
        subheadline:
            "I am a front&nbsp;end <span className='font-semibold'>web&nbsp;developer</span> from <span class='font-semibold'>Portland,&nbsp;OR</span>",
    },
    work: {
        headline: "Work",
        projects: [
            {
                title: "OnlineEd",
                description:
                    "Redesigned and rebuilt the user interface of educational course-taking and course-building software as a single page application.",
                features: [],
                btnLink: {
                    text: "Go to course demo",
                    url: "https://demo.onlineed.com/app/mono/#/scourse/186881",
                },
                media: {
                    url: "/public/img/onlineed/testresults.png",
                    alt: "",
                },
            },
            {
                title: "Alexion Snowflake Simulator",
                description: "Symptom assessment for patients with generalized myasthenia gravis (gMG).",
                features: [],
                media: {
                    url: "",
                    alt: "",
                },
            },
            {
                title: "A-dec Rebrand",
                description: "Website refresh",
                features: [
                    {
                        text: "Home page refresh and navigation rebuild",
                        url: "https://www.a-dec.com/",
                    },
                    {
                        text: "Color sample picker",
                        url: "https://www.a-dec.com/color",
                    },
                    {
                        text: "Blog",
                        url: "https://www.a-dec.com/blog",
                    },
                    {
                        text: "Video Library",
                        url: "https://www.a-dec.com/video-library",
                    },
                    {
                        text: "Search",
                        url: "https://www.a-dec.com/search-results",
                    },
                ],
                media: {
                    url: "/public/img/adec/colorpicker.png",
                    alt: "",
                },
            },
            {
                title: "Providence Health Plan",
                description: "Rebrand",
                features: [],
                media: {
                    url: "/public/img/providence/homepage.png",
                    alt: "",
                },
            },
        ],
    },
};
