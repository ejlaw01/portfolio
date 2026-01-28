import { forwardRef, CSSProperties } from "react";

type CheckerboardProps = {
    classes?: string;
    style?: CSSProperties;
};

const Checkerboard = forwardRef<HTMLDivElement, CheckerboardProps>(({ classes, style }, ref) => {
    return (
        <div
            ref={ref}
            className={`checkerboard ${classes}`}
            style={{
                backgroundImage: "url('/img/checkers.svg')",
                ...style,
            }}
        ></div>
    );
});

Checkerboard.displayName = "Checkerboard";

export default Checkerboard;
