/**
 * Adds a non-breaking space between the last two words of text elements
 * to prevent orphaned words at the end of lines.
 *
 * Skips elements with class "allow-orphans" or if the last word is over 10 characters.
 */
export function preventOrphans(selector: string = "h1, h2, h3, h4, h5, h6, p, li, a, span") {
    const elements = document.querySelectorAll(selector);

    elements.forEach((el) => {
        if (el.classList.contains("allow-orphans")) return;
        if (el.children.length > 0) return; // Skip elements with child elements

        const text = el.textContent || "";
        const words = text.trim().split(/\s+/);

        if (words.length < 2) return;

        const lastWord = words[words.length - 1];
        if (lastWord.length > 10) return;

        // Replace the last space with a non-breaking space
        const lastSpaceIndex = text.lastIndexOf(" ");
        if (lastSpaceIndex === -1) return;

        el.textContent = text.substring(0, lastSpaceIndex) + "\u00A0" + text.substring(lastSpaceIndex + 1);
    });
}

export default preventOrphans;
