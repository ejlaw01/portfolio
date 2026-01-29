import { useState, useEffect } from "react";

type Props = {
    onComplete: () => void;
};

const PageLoader = ({ onComplete }: Props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        const loadAssets = async () => {
            // Wait for fonts
            await document.fonts.ready;

            // Wait for critical images (hero avatar)
            const heroImg = document.querySelector(".hero__avatar") as HTMLImageElement;
            if (heroImg && !heroImg.complete) {
                await new Promise((resolve) => {
                    heroImg.onload = resolve;
                    heroImg.onerror = resolve;
                });
            }

            // Small delay to ensure everything is painted
            await new Promise((resolve) => setTimeout(resolve, 100));

            // Start fade out
            setIsFading(true);

            // Remove loader after fade
            setTimeout(() => {
                setIsLoading(false);
                onComplete();
            }, 400);
        };

        loadAssets();
    }, [onComplete]);

    if (!isLoading) return null;

    return (
        <div
            className={`fixed inset-0 z-50 bg-white flex items-center justify-center transition-opacity duration-400 ${
                isFading ? "opacity-0" : "opacity-100"
            }`}
        >
            <div className={`w-8 h-8 border-2 border-pink-200 border-t-pink-500 rounded-full animate-spin ${
                isFading ? "opacity-0" : "opacity-100"
            }`} />
        </div>
    );
};

export default PageLoader;
