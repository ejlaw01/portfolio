import { useRef, useEffect, useState } from "react";
import gsap from "gsap";

const BitLoreLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 1000 968" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className={className}>
        <path d="M0,500.186154 C0,287.498532 132.797596,105.82745 320,33.5656969 C320,33.5656969 320,89.0297689 320,199.957913 C218.148278,261.153886 150,372.711578 150,500.186154 C150,627.66073 218.148278,739.218422 320,800.414396 L320,966.806648 C132.797596,894.544858 0,712.873776 0,500.186154 Z M680,33.5656969 C845.453293,97.4321044 968.408901,246.76234 994.745541,427.435119 C998.207536,451.184857 1000,475.476179 1000,500.186154 C1000,712.873776 867.202404,894.544858 680,966.806612 L680,800.414396 C781.851722,739.218422 850,627.66073 850,500.186154 C850,372.711578 781.851722,261.153886 680,199.957913 L680,33.5656969 Z" />
        <g transform="translate(500.722081, 481.093077) scale(-1, 1) rotate(-180) translate(-500.722081, -481.093077) translate(408.381516, 0)">
            <path d="M1.61848435,400 C45.9490057,374.820792 70.9229641,357.362459 76.5403594,347.625 C83.5954099,338.01704 87.6214516,273.82954 88.6184844,155.0625 L103.227859,210.085938 C97.36539,289.600093 98.6830983,335.446447 107.180984,347.625 C115.67887,359.803553 140.49137,377.261886 181.618484,400 C181.618484,608.746064 181.618484,710.925752 181.618484,760.539062 C181.618484,764.434546 154.807286,765.606422 121.184891,730.054688 C154.807286,780.736896 181.618484,766.647572 181.618484,842.546876 C181.618484,918.44618 188.509437,946.633691 181.618484,954.024688 C174.727532,961.415685 131.59323,961.949218 91.6184844,961.949218 C51.6437389,961.949218 4.85545306,964.325888 1.61848435,954.024688 C-0.539494784,947.157222 -0.539494784,762.482326 1.61848435,400 Z" />
            <path d="M91.2745382,114 C86.8699477,77.7319805 43.6184844,87.9776179 43.6184844,47.6560538 C43.6184844,21.336342 64.9548264,0 91.2745382,0 C117.59425,0 138.930592,21.336342 138.930592,47.6560538 C134.687183,71.5346128 118.801831,93.6492616 91.2745382,114 Z" />
        </g>
    </svg>
);

const Nav = () => {
    const itemsRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const isOpenRef = useRef(false);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
        if (isOpenRef.current) {
            toggleMenu();
        }
    };

    function toggleMenu() {
        if (isOpenRef.current) {
            closeMenu();
        } else {
            openMenu();
        }
        isOpenRef.current = !isOpenRef.current;
        setIsOpen(isOpenRef.current);
    }

    function openMenu() {
        const items = itemsRef.current;
        const menuItemElements = items?.querySelectorAll(".menu-item");
        if (!items || !menuItemElements) return;

        const fullWidth = Array.from(menuItemElements).reduce((sum, el) => {
            return sum + (el as HTMLElement).scrollWidth;
        }, 0) + (menuItemElements.length - 1) * 0.35 * 16;

        gsap.to(items, {
            width: fullWidth,
            marginRight: 0.35 * 16,
            duration: 0.5,
            ease: "power3.inOut",
            onStart: () => {
                gsap.to(menuItemElements, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.3,
                    stagger: 0.05,
                    delay: 0.2,
                    ease: "power3.out",
                });
            },
        });
    }

    function closeMenu() {
        const items = itemsRef.current;
        const menuItemElements = items?.querySelectorAll(".menu-item");
        if (!items || !menuItemElements) return;

        gsap.to(items, {
            width: 0,
            marginRight: 0,
            duration: 0.5,
            ease: "power3.inOut",
            onStart: () => {
                gsap.to(menuItemElements, {
                    opacity: 0,
                    scale: 0.85,
                    duration: 0.3,
                    ease: "power3.out",
                    stagger: { each: 0.05, from: "end" },
                });
            },
        });
    }

    useEffect(() => {
        const items = itemsRef.current;
        const menuItemElements = items?.querySelectorAll(".menu-item");
        if (!items || !menuItemElements) return;

        gsap.set(items, { width: 0, marginRight: 0 });
        gsap.set(menuItemElements, { opacity: 0, scale: 0.85 });
    }, []);

    return (
        <div className="menu-drawer">
            <div className="menu-logo">
                <BitLoreLogo className="h-7 w-auto text-pink-900" />
            </div>

            <div ref={itemsRef} className="menu-items" style={{ width: 0, marginRight: 0 }}>
                <div className="menu-item">
                    <button onClick={() => scrollToSection("work-section")}>Work</button>
                </div>
                <div className="menu-item">
                    <button onClick={() => scrollToSection("contact-section")}>Contact</button>
                </div>
            </div>

            <div
                className={`menu-toggler ${isOpen ? "close" : ""}`}
                onClick={toggleMenu}
            >
                <span></span>
                <span></span>
            </div>
        </div>
    );
};

export default Nav;
