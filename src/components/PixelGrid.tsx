import { useRef, useEffect } from "react";

interface PixelGridProps {
    className?: string;
}

const CELL_SIZE = 90;
const GAP = 1;
const STEP = CELL_SIZE + GAP;

const BASE_COLOR = "#121212"; // colors.dark
const LINE_COLOR = "rgb(213, 174, 174)"; // ~pink-300

const PARALLAX_FACTOR = 0.075;
const BREATH_AMPLITUDE = 2;
const MOBILE_BREAKPOINT = 768;

function PixelGrid({ className = "" }: PixelGridProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);
    const scrollYRef = useRef(0);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let isMobile = window.innerWidth < MOBILE_BREAKPOINT;

        function sizeCanvas() {
            if (!canvas) return;
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function drawParallaxOnly() {
            if (!ctx || !canvas) return;
            const w = canvas.width / (window.devicePixelRatio || 1);
            const h = canvas.height / (window.devicePixelRatio || 1);

            ctx.fillStyle = LINE_COLOR;
            ctx.fillRect(0, 0, w, h);

            const parallaxY = scrollYRef.current * PARALLAX_FACTOR;
            const baseOffsetY = ((parallaxY % STEP) + STEP) % STEP;

            const cols = Math.ceil(w / STEP) + 4;
            const rows = Math.ceil(h / STEP) + 4;

            ctx.fillStyle = BASE_COLOR;
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    ctx.fillRect(-STEP + col * STEP, -STEP + row * STEP + baseOffsetY, CELL_SIZE, CELL_SIZE);
                }
            }
        }

        function animate(time: number) {
            rafRef.current = requestAnimationFrame(animate);

            if (!ctx || !canvas) return;

            const w = canvas.width / (window.devicePixelRatio || 1);
            const h = canvas.height / (window.devicePixelRatio || 1);

            ctx.fillStyle = LINE_COLOR;
            ctx.fillRect(0, 0, w, h);

            // Scroll parallax offset (wraps seamlessly)
            const parallaxY = scrollYRef.current * PARALLAX_FACTOR;
            const baseOffsetY = ((parallaxY % STEP) + STEP) % STEP;

            const pad = 2;
            const cols = Math.ceil(w / STEP) + pad * 2;
            const rows = Math.ceil(h / STEP) + pad * 2;
            const startX = -pad * STEP;
            const startY = -pad * STEP + baseOffsetY;

            // Time for breathing (seconds)
            const t = time * 0.001;

            ctx.fillStyle = BASE_COLOR;

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const x0 = startX + col * STEP;
                    const y0 = startY + row * STEP;

                    // Subtle breathing offset per corner
                    const tlx = x0 + Math.sin(t * 0.8 + row * 0.3 + col * 0.2) * BREATH_AMPLITUDE;
                    const tly = y0 + Math.cos(t * 0.6 + col * 0.25 + row * 0.15) * BREATH_AMPLITUDE;
                    const trx = x0 + CELL_SIZE + Math.sin(t * 0.8 + row * 0.3 + (col + 1) * 0.2) * BREATH_AMPLITUDE;
                    const try_ = y0 + Math.cos(t * 0.6 + (col + 1) * 0.25 + row * 0.15) * BREATH_AMPLITUDE;
                    const brx = x0 + CELL_SIZE + Math.sin(t * 0.8 + (row + 1) * 0.3 + (col + 1) * 0.2) * BREATH_AMPLITUDE;
                    const bry = y0 + CELL_SIZE + Math.cos(t * 0.6 + (col + 1) * 0.25 + (row + 1) * 0.15) * BREATH_AMPLITUDE;
                    const blx = x0 + Math.sin(t * 0.8 + (row + 1) * 0.3 + col * 0.2) * BREATH_AMPLITUDE;
                    const bly = y0 + CELL_SIZE + Math.cos(t * 0.6 + col * 0.25 + (row + 1) * 0.15) * BREATH_AMPLITUDE;

                    ctx.beginPath();
                    ctx.moveTo(tlx, tly);
                    ctx.lineTo(trx, try_);
                    ctx.lineTo(brx, bry);
                    ctx.lineTo(blx, bly);
                    ctx.closePath();
                    ctx.fill();
                }
            }
        }

        sizeCanvas();
        scrollYRef.current = window.scrollY;

        if (isMobile) {
            drawParallaxOnly();
        } else {
            rafRef.current = requestAnimationFrame(animate);
        }

        const handleResize = () => {
            const wasMobile = isMobile;
            isMobile = window.innerWidth < MOBILE_BREAKPOINT;
            sizeCanvas();

            if (isMobile) {
                cancelAnimationFrame(rafRef.current);
                drawParallaxOnly();
            } else if (wasMobile) {
                rafRef.current = requestAnimationFrame(animate);
            }
        };

        const mobileScrollRaf = { id: 0, pending: false };
        const handleScroll = () => {
            scrollYRef.current = window.scrollY;
            if (isMobile && !mobileScrollRaf.pending) {
                mobileScrollRaf.pending = true;
                mobileScrollRaf.id = requestAnimationFrame(() => {
                    drawParallaxOnly();
                    mobileScrollRaf.pending = false;
                });
            }
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            cancelAnimationFrame(rafRef.current);
            cancelAnimationFrame(mobileScrollRaf.id);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={`pixel-grid ${className}`}
        />
    );
}

export default PixelGrid;
