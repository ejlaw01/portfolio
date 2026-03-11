import { useRef, useEffect } from "react";

interface PixelGridProps {
    className?: string;
}

const CELL_SIZE = 90;
const GAP = 1;
const STEP = CELL_SIZE + GAP;

const BASE_COLOR = "#121212";
const LINE_COLOR = "rgb(213, 174, 174)";

const WARP_RADIUS = 300;
const WARP_STRENGTH = 0.4;

function warpPoint(
    gx: number,
    gy: number,
    mx: number,
    my: number,
    active: boolean
): [number, number] {
    if (!active) return [gx, gy];
    const dx = mx - gx;
    const dy = my - gy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist >= WARP_RADIUS) return [gx, gy];
    const t = 1 - dist / WARP_RADIUS;
    const influence = t * t;
    return [
        gx + dx * influence * WARP_STRENGTH,
        gy + dy * influence * WARP_STRENGTH,
    ];
}

function PixelGrid({ className = "" }: PixelGridProps) {
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

            // Fill with grid line color — gaps between warped cells show this
            ctx.fillStyle = LINE_COLOR;
            ctx.fillRect(0, 0, w, h);

            // Extra cells beyond edges so warping doesn't reveal bare background
            const pad = Math.ceil(WARP_RADIUS * WARP_STRENGTH / STEP) + 2;
            const cols = Math.ceil(w / STEP) + pad * 2;
            const rows = Math.ceil(h / STEP) + pad * 2;
            const offsetX = -pad * STEP;
            const offsetY = -pad * STEP;
            const mouse = mouseRef.current;
            const active = !isMobile && mouse.active;
            const mx = mouse.x;
            const my = mouse.y;

            ctx.fillStyle = BASE_COLOR;

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    // Grid intersection points (corners of this cell)
                    const x0 = offsetX + col * STEP;
                    const y0 = offsetY + row * STEP;
                    const x1 = x0 + CELL_SIZE;
                    const y1 = y0 + CELL_SIZE;

                    // Warp each corner
                    const [tlx, tly] = warpPoint(x0, y0, mx, my, active);
                    const [trx, try_] = warpPoint(x1, y0, mx, my, active);
                    const [brx, bry] = warpPoint(x1, y1, mx, my, active);
                    const [blx, bly] = warpPoint(x0, y1, mx, my, active);

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
            className={`pixel-grid ${className}`}
        />
    );
}

export default PixelGrid;
