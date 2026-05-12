import { useEffect, useState } from "react";
import "./App.css";
import Home from "./pages/Home";
import Manufacturing from "./pages/Manufacturing";

function App() {
    const [path, setPath] = useState(() => window.location.pathname);

    useEffect(() => {
        const onPop = () => setPath(window.location.pathname);
        window.addEventListener("popstate", onPop);
        return () => window.removeEventListener("popstate", onPop);
    }, []);

    if (path.startsWith("/manufacturing")) return <Manufacturing />;
    return <Home />;
}

export default App;
