import Container from "../components/Container";
import Hero from "../components/Hero";
import Work from "../components/Work";
import Footer from "../components/Footer";

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
        </main>
    );
}

export default Home;
