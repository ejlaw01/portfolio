import Container from "../components/Container";
import Hero from "../components/Hero";
import Work from "../components/Work";
import Footer from "../components/Footer";
import Checkerboard from "../components/Checkerboard";

function Home() {
    return (
        <main>
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
