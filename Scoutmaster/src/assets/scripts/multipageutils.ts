import { useMediaQuery } from "react-responsive";

/**
 * Returns the current screen category based on viewport width.
 *
 * @returns "phone" | "tablet" | "desktop"
 */
export function useScreenType(): "phone" | "tablet" | "desktop" {
    const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
    const isTablet = useMediaQuery({
        query: "(min-width: 768px) and (max-width: 1023px)",
    });

    return isDesktop ? "desktop" : isTablet ? "tablet" : "phone";
}

/**
 * Returns whether the user is currently signed in or not
 *
 * @returns true | false
 */
export function useSignedIn(): true | false {
    return false;
}
