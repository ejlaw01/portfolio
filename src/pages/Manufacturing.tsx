import { ReactNode, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FiUsers, FiFileText, FiLayers, FiGlobe, FiMonitor, FiGrid, FiPhoneCall, FiRepeat } from "react-icons/fi";
import Container from "@/components/layout/Container";
import Nav from "@/components/layout/Nav";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

const BitLoreLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 1000 968" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className={className}>
        <path d="M0,500.186154 C0,287.498532 132.797596,105.82745 320,33.5656969 C320,33.5656969 320,89.0297689 320,199.957913 C218.148278,261.153886 150,372.711578 150,500.186154 C150,627.66073 218.148278,739.218422 320,800.414396 L320,966.806648 C132.797596,894.544858 0,712.873776 0,500.186154 Z M680,33.5656969 C845.453293,97.4321044 968.408901,246.76234 994.745541,427.435119 C998.207536,451.184857 1000,475.476179 1000,500.186154 C1000,712.873776 867.202404,894.544858 680,966.806612 L680,800.414396 C781.851722,739.218422 850,627.66073 850,500.186154 C850,372.711578 781.851722,261.153886 680,199.957913 L680,33.5656969 Z" />
        <g transform="translate(500.722081, 481.093077) scale(-1, 1) rotate(-180) translate(-500.722081, -481.093077) translate(408.381516, 0)">
            <path d="M1.61848435,400 C45.9490057,374.820792 70.9229641,357.362459 76.5403594,347.625 C83.5954099,338.01704 87.6214516,273.82954 88.6184844,155.0625 L103.227859,210.085938 C97.36539,289.600093 98.6830983,335.446447 107.180984,347.625 C115.67887,359.803553 140.49137,377.261886 181.618484,400 C181.618484,608.746064 181.618484,710.925752 181.618484,760.539062 C181.618484,764.434546 154.807286,765.606422 121.184891,730.054688 C154.807286,780.736896 181.618484,766.647572 181.618484,842.546876 C181.618484,918.44618 188.509437,946.633691 181.618484,954.024688 C174.727532,961.415685 131.59323,961.949218 91.6184844,961.949218 C51.6437389,961.949218 4.85545306,964.325888 1.61848435,954.024688 C-0.539494784,947.157222 -0.539494784,762.482326 1.61848435,400 Z" />
            <path d="M91.2745382,114 C86.8699477,77.7319805 43.6184844,87.9776179 43.6184844,47.6560538 C43.6184844,21.336342 64.9548264,0 91.2745382,0 C117.59425,0 138.930592,21.336342 138.930592,47.6560538 C134.687183,71.5346128 118.801831,93.6492616 91.2745382,114 Z" />
        </g>
    </svg>
);

const FadeIn = ({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) => {
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!ref.current) return;
        gsap.fromTo(
            ref.current,
            { y: 24, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.9,
                delay,
                ease: "power3.out",
                scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
            }
        );
    }, { scope: ref });

    return (
        <div ref={ref} className={className} style={{ opacity: 0 }}>
            {children}
        </div>
    );
};

const FadeInStagger = ({
    children,
    className,
    delay = 0,
    stagger = 0.1,
}: {
    children: ReactNode;
    className?: string;
    delay?: number;
    stagger?: number;
}) => {
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const el = ref.current;
        if (!el) return;
        gsap.fromTo(
            el.children,
            { y: 24, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.9,
                delay,
                stagger,
                ease: "power3.out",
                scrollTrigger: { trigger: el, start: "top 85%", once: true },
            }
        );
    }, { scope: ref });

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
};

// Ordered as a ladder: foundational web work first, higher-value custom
// software after.
const offerings = [
    {
        Icon: FiGlobe,
        title: "Web Presence & SEO",
        body: "Your website should generate leads, not just exist. Site speed, search visibility, analytics, and ongoing maintenance so your digital presence works as hard as your shop floor.",
    },
    {
        Icon: FiFileText,
        title: "Quoting Tools",
        body: "Your pricing rules built in. Customer-specific tiers, volume breaks, margin thresholds.",
    },
    {
        Icon: FiLayers,
        title: "Product Configurators",
        body: "Guide customers or dealers through available options and generate accurate quotes on the spot.",
    },
    {
        Icon: FiUsers,
        title: "Dealer Portals",
        body: "Self-service ordering, inventory visibility, and account management for your dealer network. No more phone calls for routine orders.",
    },
];

// Each mark's bounding box carries a different amount of empty space — A-dec's
// caduceus rises well above its wordmark, Fluidra's sits short — so flex
// alignment centres the boxes while the marks still look uneven. `nudge` is a
// per-logo vertical offset in px: negative lifts, positive drops.
// `ratio` comes from each file's own viewBox. The logos are painted with a CSS
// mask rather than rendered as images, so they take a palette colour instead of
// pure black — but a masked element has no intrinsic size, so the aspect ratio
// has to be supplied here.
const clientLogos = [
    { src: "/img/logos/evans-components.svg", alt: "Evans Components", ratio: 194 / 47, nudge: 0 },
    { src: "/img/logos/a-dec.svg", alt: "A-dec", ratio: 97.217 / 32.473, nudge: -4 },
    { src: "/img/logos/fluidra.svg", alt: "Fluidra", ratio: 260.806 / 68.583, nudge: 3 },
];

const steps = [
    {
        n: "01",
        title: "Strategy",
        body: "A focused audit of your current tools, workflows, and digital presence. You get a clear picture of where the friction is and a written roadmap with prioritized options. This is a standalone engagement, with no commitment to build anything.",
    },
    {
        n: "02",
        title: "Build",
        body: "Working software delivered in weeks. Most engagements start with the fundamentals: getting your website generating leads, fixing what's broken, setting up analytics. From there, we tackle the deeper operational problems that custom software solves.",
    },
    {
        n: "03",
        title: "Support",
        body: "I handle the hosting, security, and updates. Your team uses the tool. When something needs adjusting, I'm a phone call away.",
    },
];

const Hero = () => (
    <section className="pt-40 lg:pt-56 pb-20 lg:pb-32">
        <Container>
            <div className="max-w-4xl mx-auto">
                <FadeIn>
                    <h1 className="font-serif font-medium text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.2] tracking-tight text-pink-900" style={{ textShadow: "none" }}>
                        When off-the-shelf doesn't fit, you build custom.{" "}
                        <span className="text-pink-600">Same goes for your software.</span>
                    </h1>
                </FadeIn>
                <FadeIn delay={0.15}>
                    <div>
                        <p className="mt-10 lg:mt-12 text-xl lg:text-2xl text-pink-800 max-w-3xl leading-relaxed font-sans">
                            I build custom software and websites for small and mid-size manufacturers, designed around how your operation runs.
                        </p>
                        <div className="mt-12 lg:mt-16">
                            <a
                                href="#contact"
                                className="inline-flex items-center gap-2 px-7 py-4 bg-pink-900 text-pink-25 font-sans font-medium text-base rounded-full hover:bg-pink-800 hover:no-underline transition-colors"
                            >
                                Let's talk
                            </a>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </Container>
    </section>
);

const Problem = () => (
    <section className="py-20 lg:py-32">
        <Container>
            <div className="max-w-4xl mx-auto">
                <FadeIn>
                    <h2 className="font-serif font-medium leading-[1.25] tracking-tight text-pink-900">
                        The gap between ERPs and reality.
                    </h2>
                </FadeIn>
                <FadeIn delay={0.15}>
                    <div className="mt-8 lg:mt-10 max-w-3xl">
                        <p className="text-lg lg:text-xl text-pink-800 leading-relaxed font-sans">
                            Enterprise software costs six figures and takes months to implement. Spreadsheets are free but break under pressure. Most manufacturers are stuck choosing between the two: adapting their workflow to rigid software, or managing everything manually.
                        </p>

                        <ul className="mt-6 lg:mt-8 space-y-5">
                            {[
                                { Icon: FiMonitor, text: "Your website hasn't been touched in five years." },
                                { Icon: FiGrid, text: "Your quoting process runs on a spreadsheet." },
                                { Icon: FiPhoneCall, text: "Your dealers call to check inventory." },
                                { Icon: FiRepeat, text: "Your team enters the same data in multiple places." },
                            ].map(({ Icon, text }) => (
                                <li key={text} className="flex items-start gap-4">
                                    <Icon className="text-pink-500 mt-1.5 shrink-0" size={20} strokeWidth={1.5} />
                                    <span className="text-lg lg:text-xl text-pink-800 leading-relaxed font-sans">{text}</span>
                                </li>
                            ))}
                        </ul>

                        <p className="mt-6 lg:mt-8 text-lg lg:text-xl text-pink-800 leading-relaxed font-sans">
                            Not because better tools don't exist, but because nobody's built one for how you work.
                        </p>
                    </div>
                </FadeIn>
            </div>
        </Container>
    </section>
);

const Offerings = () => (
    <section className="py-20 lg:py-32">
        <Container>
            <div className="max-w-4xl mx-auto">
                <FadeIn>
                    <h2 className="font-serif font-medium leading-[1.25] tracking-tight text-pink-900">
                        What I build.
                    </h2>
                </FadeIn>
                <FadeIn delay={0.15}>
                    <p className="mt-8 lg:mt-10 max-w-3xl text-lg lg:text-xl text-pink-800 leading-relaxed font-sans">
                        Everything custom is yours outright, under an unlimited perpetual license.
                    </p>
                </FadeIn>
            </div>
            <div className="mt-12 lg:mt-16 max-w-4xl mx-auto">
                <FadeInStagger delay={0.15} stagger={0.08} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-10 lg:gap-y-12">
                    {offerings.map(({ Icon, title, body }) => (
                        <div key={title}>
                            <Icon className="text-pink-600" size={28} strokeWidth={1.5} />
                            <h3 className="mt-4 font-serif font-medium text-2xl leading-snug text-pink-900">
                                {title}
                            </h3>
                            <p className="mt-3 text-base lg:text-lg text-pink-800 leading-relaxed font-sans">
                                {body}
                            </p>
                        </div>
                    ))}
                </FadeInStagger>
            </div>
        </Container>
    </section>
);

const Process = () => (
    <section className="py-20 lg:py-32 bg-dark">
        <Container>
            <div className="max-w-4xl mx-auto">
                <FadeIn>
                    <h2 className="font-serif font-medium leading-[1.25] tracking-tight text-pink-25" style={{ textShadow: "none" }}>
                        Process over hype.
                    </h2>
                </FadeIn>
            </div>
            <FadeInStagger delay={0.15} stagger={0.12} className="max-w-4xl mx-auto mt-14 lg:mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10 lg:gap-16">
                {steps.map((step) => (
                    <div key={step.n}>
                        <div className="font-serif font-medium text-5xl lg:text-6xl text-pink-400 leading-none">
                            {step.n}
                        </div>
                        <h3 className="mt-5 font-serif font-medium text-2xl lg:text-3xl leading-snug text-pink-25">
                            {step.title}
                        </h3>
                        <p className="mt-5 text-base lg:text-lg text-pink-200 leading-relaxed font-sans">
                            {step.body}
                        </p>
                    </div>
                ))}
            </FadeInStagger>
        </Container>
    </section>
);

const Credibility = () => (
    <section className="py-20 lg:py-32">
        <Container>
            <FadeIn>
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[340px_1fr] gap-10 md:gap-14 lg:gap-20 items-center">
                    <img
                        src="/img/hero/headshot-ethan.jpg"
                        alt="Ethan Law, founder of Bit Lore"
                        className="aspect-[3/4] w-full max-w-[340px] object-cover rounded-2xl"
                    />
                    <div>
                        <h2 className="font-serif font-medium text-3xl lg:text-4xl leading-[1.25] tracking-tight text-pink-900">
                            Built in Portland, for the Northwest.
                        </h2>
                        <p className="mt-6 lg:mt-8 text-lg lg:text-xl text-pink-800 leading-relaxed font-sans">
                            I'm Ethan Law, the developer behind Bit Lore. I build software for companies that need something generic solutions can't do.
                        </p>
                    </div>
                </div>
            </FadeIn>
        </Container>
    </section>
);

// No padding of its own — the surrounding sections' padding supplies the gap on
// both sides, so this sits on the seam between them.
const Clients = () => (
    <section>
        <Container>
            <FadeIn>
                <div className="max-w-4xl mx-auto">
                    <p className="text-center font-sans text-xs uppercase tracking-[0.15em] text-pink-600">
                        Selected clients
                    </p>
                    {/* Masking flattens three unrelated palettes into one silhouette
                        and lets it take a theme colour. No hover state: these aren't
                        links, so implying one misleads. */}
                    <div className="mt-8 lg:mt-10 flex flex-wrap items-center justify-around gap-y-10 gap-x-6">
                        {clientLogos.map(({ src, alt, ratio, nudge }) => (
                            <span
                                key={alt}
                                role="img"
                                aria-label={alt}
                                className="block h-8 lg:h-10 bg-pink-800"
                                style={{
                                    aspectRatio: String(ratio),
                                    maskImage: `url("${src}")`,
                                    WebkitMaskImage: `url("${src}")`,
                                    maskSize: "contain",
                                    WebkitMaskSize: "contain",
                                    maskRepeat: "no-repeat",
                                    WebkitMaskRepeat: "no-repeat",
                                    maskPosition: "center",
                                    WebkitMaskPosition: "center",
                                    ...(nudge ? { transform: `translateY(${nudge}px)` } : {}),
                                }}
                            />
                        ))}
                    </div>
                </div>
            </FadeIn>
        </Container>
    </section>
);


const Contact = () => {
    const [form, setForm] = useState({ name: "", company: "", email: "", message: "", _hp: "" });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (submitting) return;
        setError(null);
        setSubmitting(true);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.error ?? "Something went wrong. Please try again or email me directly.");
            }
            setSubmitted(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const fieldClass =
        "w-full bg-transparent border-0 border-b border-pink-300 focus:border-pink-700 focus:outline-none font-sans text-base lg:text-lg text-pink-900 placeholder-pink-400 py-3 transition-colors";

    return (
        <section id="contact" className="py-20 lg:py-32">
            <Container>
                <FadeIn>
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="font-serif font-medium leading-[1.25] tracking-tight text-pink-900">
                            Let's start with a conversation.
                        </h2>
                        <p className="mt-8 text-lg lg:text-xl text-pink-800 leading-relaxed font-sans max-w-3xl mx-auto">
                            No pitch, no pressure. Tell me what's frustrating about your current setup and I'll tell you whether I can help. If it's a fit, the audit is where the work starts.
                        </p>
                    </div>
                </FadeIn>

                <div className="max-w-4xl mx-auto mt-14 lg:mt-20">
                  <div className="max-w-2xl mx-auto">
                  <div className="bg-pink-50 rounded-2xl p-8 lg:p-12">
                    {submitted ? (
                        <FadeIn>
                            <div className="font-sans">
                                <p className="text-xl lg:text-2xl text-pink-900 font-serif">Thanks. I'll be in touch soon.</p>
                            </div>
                        </FadeIn>
                    ) : (
                        <FadeIn delay={0.15}>
                            <form onSubmit={onSubmit} className="space-y-8" noValidate>
                                {/* Honeypot — hidden from humans, bots fill it and we drop the submission */}
                                <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
                                    <label>
                                        Leave this field empty
                                        <input
                                            type="text"
                                            tabIndex={-1}
                                            autoComplete="off"
                                            value={form._hp}
                                            onChange={(e) => setForm({ ...form, _hp: e.target.value })}
                                        />
                                    </label>
                                </div>
                                <label className="block">
                                    <span className="block font-sans text-xs uppercase tracking-[0.15em] text-pink-600 mb-1">Name</span>
                                    <input
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className={fieldClass}
                                    />
                                </label>
                                <label className="block">
                                    <span className="block font-sans text-xs uppercase tracking-[0.15em] text-pink-600 mb-1">Company</span>
                                    <input
                                        type="text"
                                        value={form.company}
                                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                                        className={fieldClass}
                                    />
                                </label>
                                <label className="block">
                                    <span className="block font-sans text-xs uppercase tracking-[0.15em] text-pink-600 mb-1">Email</span>
                                    <input
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className={fieldClass}
                                    />
                                </label>
                                <label className="block">
                                    <span className="block font-sans text-xs uppercase tracking-[0.15em] text-pink-600 mb-1">Message</span>
                                    <textarea
                                        required
                                        rows={5}
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        className={`${fieldClass} resize-none`}
                                    />
                                </label>
                                {error && (
                                    <p className="text-sm font-sans text-pink-700" role="alert">
                                        {error}
                                    </p>
                                )}
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="inline-flex items-center gap-2 px-7 py-4 bg-pink-900 text-pink-25 font-sans font-medium text-base rounded-full hover:bg-pink-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? "Sending…" : "Send"}
                                    </button>
                                </div>
                            </form>
                        </FadeIn>
                    )}
                  </div>
                  </div>
                </div>
            </Container>
        </section>
    );
};

const Footer = () => (
    <footer className="py-12 lg:py-16">
        <Container>
            <div className="flex flex-col items-center gap-4 font-sans text-sm text-pink-700">
                <BitLoreLogo className="h-6 w-auto text-pink-900" />
                <div className="flex items-center gap-6">
                    <p>&copy; 2026 Bit Lore</p>
                    <span className="text-pink-300">·</span>
                    <a href="https://bitlore.io" className="text-pink-700 hover:text-pink-900 hover:no-underline">
                        bitlore.io
                    </a>
                </div>
            </div>
        </Container>
    </footer>
);

const Manufacturing = () => {
    useSmoothScroll(0.2);

    useEffect(() => {
        const prevTitle = document.title;
        const desc = document.querySelector('meta[name="description"]');
        const prevDesc = desc?.getAttribute("content") ?? null;

        document.title = "Bit Lore | Web Tooling and Online Presence for Manufacturers";
        desc?.setAttribute(
            "content",
            // Kept under ~155 chars so Google doesn't truncate it in results.
            "Web presence and custom software for small and mid-size manufacturers in Portland and the Pacific Northwest. Websites, SEO, quoting tools, dealer portals."
        );

        return () => {
            document.title = prevTitle;
            if (prevDesc !== null) desc?.setAttribute("content", prevDesc);
        };
    }, []);

    return (
        <main className="overflow-x-clip bg-pink-25 min-h-screen">
            <Nav page="manufacturing" />
            <Hero />
            <Problem />
            <Offerings />
            <Process />
            <Credibility />
            <Clients />
            <Contact />
            <Footer />
        </main>
    );
};

export default Manufacturing;
