import { useEffect } from "react";
import Container from "@/components/layout/Container";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import PageLoader from "@/components/layout/PageLoader";
import BrandSection from "@/components/sections/brand/BrandSection";
import Hero from "@/components/sections/hero/Hero";
import About from "@/components/sections/about/About";
import CrtDisplay from "@/components/sections/work/CrtDisplay";
import Checkerboard from "@/components/ui/Checkerboard";
import PixelGrid from "@/components/ui/PixelGrid";
import preventOrphans from "@/utils/preventOrphans";
import { bottomWavePath } from "@/utils/wavePaths";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

function Home() {
    useEffect(() => { preventOrphans(); }, []);
    useSmoothScroll();

    return (
        <main className="overflow-x-clip">
            <PageLoader />
            <Nav />

            <BrandSection />

            {/* Shared PixelGrid behind Hero + CrtDisplay */}
            <div className="relative bg-dark">
                <PixelGrid />

                <div className="hero-section relative z-10">
                    <Hero />
                </div>

                <div className="relative z-0 mt-[-100svh] pt-[100svh]">
                    <CrtDisplay />
                </div>

                {/* Bottom sine wave transition */}
                <div className="relative z-10 -mb-1">
                    <svg
                        viewBox="-10 -10 120 130"
                        preserveAspectRatio="none"
                        className="hero-wave hero-wave--bottom relative top-auto bottom-0"
                    >
                        <path d={bottomWavePath} fill="white" />
                    </svg>
                </div>
            </div>

            <Container>
                <About />
            </Container>

            <Container>
                <Footer />
            </Container>
            <Checkerboard className="-mb-14 w-full h-[100px] bg-[length:100px]" />
        </main>
    );
}

export default Home;
