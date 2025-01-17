import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FiChevronDown } from "react-icons/fi";

type ScrollerProps = {
    target: string;
}

function Scroller({ target } : ScrollerProps) {
    const iconSize : number = 70;
    const arrowClasses : string =
        "arrow relative h-5 opacity-50 group-hover:opacity-100 text-pink-450";

    const arrows = useRef(null);
    useGSAP(
        () => {
            gsap.timeline({
                repeat: -1,
                repeatDelay: 1,
                ease: "none",
            })
                .to(".arrow", {
                    opacity: "+=0.5",
                    duration: 1,
                    stagger: {
                        each: 0.5,
                    },
                })
                .to(".arrow", {
                    opacity: "-=0.5",
                    duration: 1,
                    stagger: {
                        each: 0.5,
                    },
                });
        },
        { scope: arrows }
    );

    return (
        <a
            className='group relative flex flex-col justify-between items-center h-16 hover:h-24 top-0 hover:top-2 transition-all'
            href={`#${target}`}
            ref={arrows}
            aria-label='scroll to next section'
        >
            <div className={arrowClasses}>
                <FiChevronDown size={iconSize} />
            </div>
            <div className={arrowClasses}>
                <FiChevronDown size={iconSize} />
            </div>
            <div className={arrowClasses}>
                <FiChevronDown size={iconSize} />
            </div>
        </a>
    );
}

export default Scroller;
