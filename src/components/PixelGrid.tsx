import { useRef, useEffect, type CSSProperties } from "react";

interface PixelGridProps {
    style?: CSSProperties;
}

const CELL_SIZE = 90;
const GAP = 1;

const BASE_COLOR = "rgb(0, 0, 0)";
const LINE_COLOR = "rgb(213, 174, 174)";

function PixelGrid({ style }: PixelGridProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
        x: -9999,
        y: -9999,
        active: false,
    });
    const rafRef = useRef<number>(0);
    const isMobileRef = useRef(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const checkMobile = () => window.innerWidth < 768;
        isMobileRef.current = checkMobile();

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        function sizeCanvas() {
            if (!canvas) return;
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        sizeCanvas();

        const handleResize = () => {
            isMobileRef.current = checkMobile();
            sizeCanvas();
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            mouseRef.current.x = e.clientX - rect.left;
            mouseRef.current.y = e.clientY - rect.top;
            mouseRef.current.active = true;
        };

        const handleMouseLeave = () => {
            mouseRef.current.active = false;
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);
        const parent = canvas.parentElement;
        if (parent) parent.addEventListener("mouseleave", handleMouseLeave);

        function animate() {
            rafRef.current = requestAnimationFrame(animate);

            if (!ctx || !canvas) return;

            const isMobile = isMobileRef.current;
            const w = canvas.width / (window.devicePixelRatio || 1);
            const h = canvas.height / (window.devicePixelRatio || 1);

            const step = CELL_SIZE + GAP;

            // Fill with grid line color, then draw cells on top
            ctx.fillStyle = LINE_COLOR;
            ctx.fillRect(0, 0, w, h);

            const cols = Math.ceil(w / step);
            const rows = Math.ceil(h / step);
            const mouse = mouseRef.current;

            // Find which cell the mouse is over
            let hoveredCol = -1;
            let hoveredRow = -1;
            if (!isMobile && mouse.active) {
                hoveredCol = Math.floor(mouse.x / step);
                hoveredRow = Math.floor(mouse.y / step);
            }

            ctx.fillStyle = BASE_COLOR;
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    if (col === hoveredCol && row === hoveredRow) continue;
                    ctx.fillRect(col * step, row * step, CELL_SIZE, CELL_SIZE);
                }
            }

            // Hovered cell — draw as line color (light pink)
            if (hoveredCol >= 0 && hoveredRow >= 0) {
                ctx.fillStyle = LINE_COLOR;
                ctx.fillRect(hoveredCol * step, hoveredRow * step, CELL_SIZE, CELL_SIZE);
            }
        }

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            if (parent) parent.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                display: "block",
                width: "100%",
                height: "100%",
                ...style,
            }}
        />
    );
}

export default PixelGrid;
