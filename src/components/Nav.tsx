import { Link } from "react-router-dom";

const BitLoreLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 1000 967" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className={className}>
        <path d="M0,499.949218 C0,287.261596 132.797596,105.590514 320,33.3287606 C320,33.3287606 320,88.7928326 320,199.720977 C218.148278,260.91695 150,372.474642 150,499.949218 C150,627.423794 218.148278,738.981486 320,800.17746 L320,966.569712 C132.797596,894.307922 0,712.63684 0,499.949218 Z M680,33.3287606 C845.453293,97.1951681 968.408901,246.525404 994.745541,427.198183 C998.207536,450.94792 1000,475.239243 1000,499.949218 C1000,712.63684 867.202404,894.307922 680,966.569676 L680,800.17746 C781.851722,738.981486 850,627.423794 850,499.949218 C850,372.474642 781.851722,260.91695 680,199.720977 L680,33.3287606 Z"/>
        <g transform="translate(500, 480.974609) scale(-1, 1) rotate(-180) translate(-500, -480.974609) translate(410, 0)">
            <path d="M0,400 C44.3305214,374.820792 69.3044797,357.362459 74.921875,347.625 C81.9769255,338.01704 86.3363005,274.162873 88,156.0625 L99.609375,210.085938 C95.0802389,289.600093 97.0646139,335.446447 105.5625,347.625 C114.060386,359.803553 138.872886,377.261886 180,400 C180,608.746064 180,720.925752 180,770.539062 C180,774.434546 163.188802,775.606422 129.566406,740.054688 C163.188802,790.736896 180,766.647572 180,842.546876 C180,918.44618 180,941.605452 180,954.024688 C159.755208,959.307708 129.755208,961.949218 90,961.949218 C50.2447916,961.949218 20.2447916,959.307708 0,954.024688 L0,400 Z"/>
            <path d="M89.6560538,114 C85.2514633,77.7319805 42,87.9776179 42,47.6560538 C42,21.336342 63.336342,0 89.6560538,0 C115.975766,0 137.312108,21.336342 137.312108,47.6560538 C133.068698,71.5346128 117.183347,93.6492616 89.6560538,114 Z"/>
        </g>
    </svg>
);

const Nav = () => {
    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <header>
            <nav>
                <div className="container py-4 flex justify-between items-center">
                    <Link to="/" className="text-pink-700 hover:text-pink-800 transition-colors">
                        <BitLoreLogo className="h-8 w-auto" />
                    </Link>
                    <ul className="flex gap-6">
                        <li>
                            <button
                                onClick={() => scrollToSection("work-section")}
                                className="text-pink-700 hover:text-pink-800 transition-colors"
                            >
                                Work
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => scrollToSection("contact-section")}
                                className="text-pink-700 hover:text-pink-800 transition-colors"
                            >
                                Contact
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Nav;
