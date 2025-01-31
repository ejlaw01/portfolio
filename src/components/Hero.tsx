import data from "../../public/data.json";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import parse from "html-react-parser";
import Checkerboard from "./Checkerboard";
import Scroller from "./Scroller";
import { FaGithub, FaLinkedin } from "react-icons/fa";

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
                start: "top top",
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
        <section className="hero min-h-screen md:h-screen py-12 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="hero__content basis-3/5 grow-0 flex flex-col justify-between gap-5 md:h-3/4 z-20">
                <h1>{parse(headline)}</h1>
                <p className="text-3xl">{parse(subheadline)}</p>
                <p className="text-lg mt-5 max-w-[30rem]">{parse(bodyText)}</p>
                <div className="self-start mt-auto">
                    <Scroller target="work-section" />
                </div>
            </div>
            <div ref={heroImagery} className="hero__imagery relative self-stretch flex flex-col">
                <img
                    src={`/img/hero/${avatarImg.filename}`}
                    alt={avatarImg.alt}
                    className="hero__avatar relative rounded-2xl object-fit max-h-full my-auto z-10"
                />
                <Checkerboard classes="hero__checkerboard absolute h-[550px] w-80 top-32 -left-[190px] rounded-2xl bg-[length:100px]" />
            </div>
        </section>
    );
}

export default Hero;
