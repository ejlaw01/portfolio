type CheckerboardProps = {
    classes?: string;
};

function Checkerboard({ classes }: CheckerboardProps) {
    return (
        <div
            className={`checkerboard ${classes}`}
            style={{
                backgroundImage: "url('/img/checkers.svg')",
            }}
        ></div>
    );
}

export default Checkerboard;
