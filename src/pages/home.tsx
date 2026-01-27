import { useEffect } from "react";
import Container from "../components/Container";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import Work from "../components/Work";
import Footer from "../components/Footer";
import Checkerboard from "../components/Checkerboard";
import preventOrphans from "../utils/preventOrphans";

function Home() {
    useEffect(() => {
        preventOrphans();
    }, []);
    return (
        <main>
            <Nav />
            <Container>
                <Hero />
            </Container>
            <div className="bg-pink-50">
                <Container>
                    <Work />
                </Container>
            </div>
            <Container>
                <Footer />
            </Container>
            <Checkerboard classes="-mb-14 w-full h-[100px] bg-[length:100px]" />
        </main>
    );
}

export default Home;
