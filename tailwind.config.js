import typographyPlugin from "@tailwindcss/typography";
/** @type {import('tailwindcss').Config} */

export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    safelist: ["font-semibold", "font-bold"],
    theme: {
        fontFamily: {
            serif: ["Bitter", "Courier", "Georgia", "Times New Roman", "serif"],
            sans: ["Plus Jakarta Sans", "Arial", "Helvetica", "sans-serif"],
        },
        container: {
            center: true,
            padding: {
                DEFAULT: "1rem",
                lg: "4rem",
            },
        },
        extend: {
            colors: {
                pink: {
                    50: "#F8F1F1",
                    100: "#F1E4E4",
                    200: "#EBD5D5",
                    300: "#D5AEAE",
                    400: "#C89393",
                    450: "#CA9191",
                    500: "#B26C6C",
                    600: "#934D4D",
                    700: "#6B3838",
                    800: "#432323",
                    900: "#1B0E0E",
                },
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
    plugins: [typographyPlugin],
};
