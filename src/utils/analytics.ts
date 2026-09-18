const MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;

declare global {
    interface Window {
        dataLayer: IArguments[];
        gtag: (...args: unknown[]) => void;
    }
}

let enabled = false;

// Loads gtag.js only from a production build and only when a measurement ID is
// set, so local dev and preview deploys stay out of the analytics property.
export function initAnalytics() {
    if (enabled || import.meta.env.DEV || !MEASUREMENT_ID) return;

    window.dataLayer = window.dataLayer || [];
    // gtag.js reads the arguments object itself, so this can't be a rest param.
    function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer.push(arguments);
    }
    window.gtag = gtag as unknown as Window["gtag"];

    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID);

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.appendChild(script);

    enabled = true;
}

// Back/forward between / and /manufacturing doesn't reload the document, so
// those views never reach the config call and have to be reported by hand.
export function trackPageView(path: string) {
    if (!enabled) return;
    window.gtag("event", "page_view", {
        page_path: path,
        page_location: window.location.href,
        page_title: document.title,
    });
}
