import { useRef, useEffect, useState } from "react";

type TextHoverGrowProps = {
    text: string;
    className?: string;
    as?: keyof JSX.IntrinsicElements;
};

function TextHoverGrow({ text, className = "", as: Tag = "span" }: TextHoverGrowProps) {
    const containerRef = useRef<HTMLSpanElement>(null);
    const [scales, setScales] = useState<number[]>(Array(text.length).fill(1));
    const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let animationId: number;
        let targetScales = Array(text.length).fill(1);
        let currentScales = Array(text.length).fill(1);

        const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

        const animate = () => {
            let needsUpdate = false;
            const newScales = currentScales.map((current, i) => {
                const newScale = lerp(current, targetScales[i], 0.15);
                if (Math.abs(newScale - current) > 0.001) needsUpdate = true;
                return newScale;
            });

            if (needsUpdate) {
                currentScales = newScales;
                setScales([...newScales]);
            }

            animationId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const letters = lettersRef.current;
            const newTargets = letters.map((letter, i) => {
                if (!letter) return 1;

                const rect = letter.getBoundingClientRect();
                const letterCenterX = rect.left + rect.width / 2;
                const letterCenterY = rect.top + rect.height / 2;

                const distance = Math.sqrt(
                    Math.pow(e.clientX - letterCenterX, 2) +
                    Math.pow(e.clientY - letterCenterY, 2)
                );

                // Max effect within 80px, scales from 1.15 down to 1
                const maxDistance = 80;
                const maxScale = 1.15;

                if (distance < maxDistance) {
                    const factor = 1 - (distance / maxDistance);
                    return 1 + (maxScale - 1) * factor * factor; // Quadratic falloff
                }
                return 1;
            });

            targetScales = newTargets;
        };

        const handleMouseLeave = () => {
            targetScales = Array(text.length).fill(1);
        };

        animationId = requestAnimationFrame(animate);
        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            cancelAnimationFrame(animationId);
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [text.length]);

    return (
        <Tag
            ref={containerRef as React.RefObject<HTMLSpanElement>}
            className={`inline-block cursor-default ${className}`}
        >
            {text.split("").map((char, i) => (
                <span
                    key={i}
                    ref={(el) => (lettersRef.current[i] = el)}
                    className="inline-block"
                    style={{
                        transform: `scale(${scales[i]})`,
                        transformOrigin: "center bottom",
                    }}
                >
                    {char === " " ? "\u00A0" : char}
                </span>
            ))}
        </Tag>
    );
}

export default TextHoverGrow;
