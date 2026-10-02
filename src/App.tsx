import { useLayoutEffect, useRef } from "react";
import { createBrowserRouter, Outlet, useLocation } from "react-router";
import { RouterProvider } from "react-router/dom";
import "./App.css";
import Home from "./pages/Home";
import Manufacturing from "./pages/Manufacturing";
import { trackPageView } from "@/utils/analytics";

// <Link viewTransition> only does anything under a data router -- the
// startViewTransition call lives in that navigate path, and useViewTransitionState
// throws outside RouterProvider. BrowserRouter silently ignores the prop.
function RootLayout() {
    const { pathname } = useLocation();
    const firstPath = useRef(true);

    // A client-side swap keeps the outgoing page's scroll offset and never
    // triggers the gtag config call, so both are handled per navigation.
    useLayoutEffect(() => {
        if (firstPath.current) {
            firstPath.current = false;
            return;
        }
        window.scrollTo(0, 0);
        trackPageView(pathname);
    }, [pathname]);

    return <Outlet />;
}

const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            { path: "/manufacturing", element: <Manufacturing /> },
            { path: "*", element: <Home /> },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
