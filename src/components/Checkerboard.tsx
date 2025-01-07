function Checkerboard({ classes }) {
    return (
        <div
            className={`checkerboard ${classes}`}
            style={{
                backgroundImage: "url('/public/img/checkers.svg')",
                clipPath: "inset(1px)",
            }}
        ></div>
    );
}

export default Checkerboard;
