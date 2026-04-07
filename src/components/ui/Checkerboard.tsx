import { forwardRef, CSSProperties } from "react";

type CheckerboardProps = {
    className?: string;
    style?: CSSProperties;
};

const Checkerboard = forwardRef<HTMLDivElement, CheckerboardProps>(({ className, style }, ref) => {
    return (
        <div
            ref={ref}
            className={`checkerboard${className ? " " + className : ""}`}
            style={{
                backgroundImage: "url('/img/checkers.svg')",
                ...style,
            }}
        ></div>
    );
});

Checkerboard.displayName = "Checkerboard";

export default Checkerboard;
