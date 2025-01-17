import data from "../../public/data.json";
import parse from "html-react-parser";
import Checkerboard from "./Checkerboard";
import Scroller from "./Scroller";

type pageData = {
    headline: string;
    subheadline: string;
}

function Hero() {
    const { headline, subheadline } : pageData = data.hero;

    return (
        <section className="min-h-screen md:h-screen py-12 flex justify-between items-center gap-12">
            <div className="flex flex-col justify-between md:h-3/4 z-20">
                <div>
                    <h1>{parse(headline)}</h1>
                    <p className="text-3xl mt-5">{parse(subheadline)}</p>
                </div>
                <div className="self-start">
                    <Scroller target="work-section" />
                </div>
            </div>
            <div className="relative self-stretch flex flex-col">
                <img
                    src="/public/img/portfolio-avatar.jpeg"
                    alt="hero image"
                    className="relative rounded-2xl object-fit max-h-full my-auto z-10"
                />
                <Checkerboard classes="absolute h-[550px] w-80 top-32 -left-[190px] rounded-2xl bg-[length:100px]" />
            </div>
        </section>
    );
}

export default Hero;
