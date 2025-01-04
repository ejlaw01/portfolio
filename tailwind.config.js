/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        container: {
            center: true,
            padding: {
                DEFUALT: "1rem",
                lg: "4rem",
            },
        },
        extend: {
            colors: {
                // "primary-color": "var(--primary-color)",
                // "secondary-color": "var(--secondary-color)",
            },
        },
        // default breakpoints
        // theme: {
        //     screens: {
        //         sm: "640px",
        //         md: "768px",
        //         lg: "1024px",
        //         xl: "1280px",
        //         "2xl": "1536px",
        //     },
        // },
    },
    plugins: [require("@tailwindcss/typography")],
};
