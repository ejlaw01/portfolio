import { useLayoutEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import "./App.css";
import Home from "./pages/Home";
import Manufacturing from "./pages/Manufacturing";
import { trackPageView } from "@/utils/analytics";

// A client-side swap keeps the outgoing page's scroll offset and never triggers
// the gtag config call, so both have to be handled per navigation.
function RouteEffects() {
    const { pathname } = useLocation();
    const firstPath = useRef(true);

    useLayoutEffect(() => {
        if (firstPath.current) {
            firstPath.current = false;
            return;
        }
        window.scrollTo(0, 0);
        trackPageView(pathname);
    }, [pathname]);

    return null;
}

function App() {
    return (
        <BrowserRouter>
            <RouteEffects />
            <Routes>
                <Route path="/manufacturing" element={<Manufacturing />} />
                <Route path="*" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
