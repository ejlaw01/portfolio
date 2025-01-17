import { ReactNode } from 'react';

type ContainerProps = {
    children: ReactNode;
    classes?: string;
}

const Container = ({ children, classes }: ContainerProps) => {
    const containerClasses : string = `container${classes ? " " + classes : ""}`;
    return <div className={containerClasses}>{children}</div>;
};

export default Container;
