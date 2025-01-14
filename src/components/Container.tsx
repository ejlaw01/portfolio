import React from "react";

const Container = ({ children, classes }) => {
    const containerClasses = `container${classes ? " " + classes : ""}`;

    return <div className={containerClasses}>{children}</div>;
};

export default Container;
