import data from "../../public/data.json";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import parse from "html-react-parser";
import Checkerboard from "./Checkerboard";
import Scroller from "./Scroller";

gsap.registerPlugin(ScrollTrigger);

type pageData = {
    headline: string;
    subheadline?: string;
    bodyText?: string;
    avatarImg: { filename: string; alt: string };
};

function Hero() {
    const { headline, subheadline, bodyText, avatarImg }: pageData = data.hero;

    const heroImagery = useRef(null);
    useGSAP(() => {
        gsap.timeline({
            scrollTrigger: {
                trigger: ".hero",
                start: "bottom bottom",
                end: "bottom top",
                scrub: 0.3,
                toggleActions: "play none reverse none",
            },
        })
            .to(".hero__checkerboard", {
                y: -60,
                opacity: 0.2,
            })
            .to(
                ".hero__avatar",
                {
                    y: -40,
                    opacity: 0.4,
                },
                "<"
            )
            .to(
                ".hero__content",
                {
                    opacity: 0.2,
                },
                "<"
            );
    });

    return (
        <section className="hero min-h-[85vh] flex flex-col-reverse sm:flex-row justify-between items-center sm:gap-12">
            <div className="hero__content basis-3/5 grow-0 flex flex-col justify-between gap-5 sm:h-3/4 py-6 sm:py-12 z-20">
                <h1>{parse(headline)}</h1>
                <p className="text-3xl">
                    <span className="text-background">{parse(subheadline)}</span>
                </p>
                <p className="text-lg mt-5 max-w-[30rem]">
                    <span className="text-background">{parse(bodyText)}</span>
                </p>
                <div className="self-start mt-auto">
                    <Scroller target="work-section" />
                </div>
            </div>
            <div
                ref={heroImagery}
                className="hero__imagery basis-2/5 relative self-stretch flex flex-col max-h-screen py-6 sm:py-12"
            >
                <img
                    src={`/img/hero/${avatarImg.filename}`}
                    alt={avatarImg.alt}
                    className="hero__avatar relative object-cover w-2/3 pb-1/3 sm:w-full max-h-full mt-[50px] sm:mt-auto ms-auto my-auto rounded-2xl z-10"
                />
                <Checkerboard classes="hero__checkerboard absolute h-[450px] sm:h-[550px] w-[250px] sm:w-[350px] sm:top-[20%] right-[40%] lg:right-[60%] rounded-2xl bg-[length:100px]" />
            </div>
        </section>
    );
}

export default Hero;
