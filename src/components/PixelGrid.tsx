import { useRef, useEffect } from "react";

interface PixelGridProps {
    style?: React.CSSProperties;
}

interface Cell {
    x: number;
    y: number;
    centerX: number;
    centerY: number;
    opacity: number;
    scale: number;
    r: number;
    g: number;
    b: number;
}

const CELL_SIZE = 18;
const GAP = 2;
const STEP = CELL_SIZE + GAP;

const BASE_R = 252; // pink-100 #fce7f3
const BASE_G = 231;
const BASE_B = 243;

const EXCITED_R = 244; // pink-400 #f472b6
const EXCITED_G = 114;
const EXCITED_B = 182;

const INFLUENCE_RADIUS = 90;
const BASE_OPACITY = 0.15;
const MAX_OPACITY = 0.75;

function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}

function PixelGrid({ style }: PixelGridProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cellsRef = useRef<Cell[]>([]);
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

        function buildGrid() {
            if (!canvas) return;
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

            const cols = Math.ceil(rect.width / STEP);
            const rows = Math.ceil(rect.height / STEP);
            const cells: Cell[] = [];

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const x = col * STEP;
                    const y = row * STEP;
                    cells.push({
                        x,
                        y,
                        centerX: x + CELL_SIZE / 2,
                        centerY: y + CELL_SIZE / 2,
                        opacity: BASE_OPACITY,
                        scale: 1,
                        r: BASE_R,
                        g: BASE_G,
                        b: BASE_B,
                    });
                }
            }
            cellsRef.current = cells;
        }

        buildGrid();

        const handleResize = () => {
            isMobileRef.current = checkMobile();
            buildGrid();
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
        canvas.addEventListener("mouseleave", handleMouseLeave);

        let startTime = performance.now();

        function animate(now: number) {
            rafRef.current = requestAnimationFrame(animate);

            if (!ctx || !canvas) return;

            const isMobile = isMobileRef.current;
            const rect = canvas.getBoundingClientRect();

            ctx.clearRect(0, 0, rect.width, rect.height);

            const elapsed = (now - startTime) / 1000;
            const cells = cellsRef.current;
            const mouse = mouseRef.current;
            const lerpSpeed = 0.08;

            for (let i = 0; i < cells.length; i++) {
                const cell = cells[i];

                // Idle shimmer
                const shimmer =
                    Math.sin(elapsed * 1.5 + cell.centerX * 0.05 + cell.centerY * 0.05) *
                        0.5 +
                    0.5;
                let targetOpacity = BASE_OPACITY + shimmer * 0.06;
                let targetScale = 1;
                let targetR = BASE_R;
                let targetG = BASE_G;
                let targetB = BASE_B;

                // Mouse proximity effect (desktop only)
                if (!isMobile && mouse.active) {
                    const dx = mouse.x - cell.centerX;
                    const dy = mouse.y - cell.centerY;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < INFLUENCE_RADIUS) {
                        const t = 1 - dist / INFLUENCE_RADIUS;
                        const eased = t * t; // quadratic easing
                        targetOpacity = lerp(targetOpacity, MAX_OPACITY, eased);
                        targetScale = lerp(1, 1.3, eased);
                        targetR = lerp(BASE_R, EXCITED_R, eased);
                        targetG = lerp(BASE_G, EXCITED_G, eased);
                        targetB = lerp(BASE_B, EXCITED_B, eased);
                    }
                }

                cell.opacity = lerp(cell.opacity, targetOpacity, lerpSpeed);
                cell.scale = lerp(cell.scale, targetScale, lerpSpeed);
                cell.r = lerp(cell.r, targetR, lerpSpeed);
                cell.g = lerp(cell.g, targetG, lerpSpeed);
                cell.b = lerp(cell.b, targetB, lerpSpeed);

                const s = cell.scale;
                const halfCell = CELL_SIZE / 2;
                const drawSize = CELL_SIZE * s;
                const drawX = cell.centerX - drawSize / 2;
                const drawY = cell.centerY - drawSize / 2;

                ctx.fillStyle = `rgba(${Math.round(cell.r)}, ${Math.round(cell.g)}, ${Math.round(cell.b)}, ${cell.opacity})`;
                ctx.fillRect(drawX, drawY, drawSize, drawSize);
            }
        }

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
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
