import { useEffect, useRef, useState } from "react";
import "./App.css";
import Home from "./pages/Home";
import Manufacturing from "./pages/Manufacturing";
import { trackPageView } from "@/utils/analytics";

function App() {
    const [path, setPath] = useState(() => window.location.pathname);
    const firstPath = useRef(true);

    useEffect(() => {
        const onPop = () => setPath(window.location.pathname);
        window.addEventListener("popstate", onPop);
        return () => window.removeEventListener("popstate", onPop);
    }, []);

    // The gtag config call already reported the landing view.
    useEffect(() => {
        if (firstPath.current) {
            firstPath.current = false;
            return;
        }
        trackPageView(path);
    }, [path]);

    if (path.startsWith("/manufacturing")) return <Manufacturing />;
    return <Home />;
}

export default App;
