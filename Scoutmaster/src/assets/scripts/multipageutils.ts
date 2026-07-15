import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import { isUserSignedIn } from "./auth";

import { useSettings } from "./settings/settings";

var isLightMode = true;

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
 * Returns whether the current screen height is "akward", <= 700px for phones/tablets, and <= 899px for desktop
 *
 * @returns true | false
 */
export function useIsAkwardHeight(): true | false {
    if (useScreenType() != "desktop") {
        const isAkwardHeight = useMediaQuery({ query: "(max-height: 700px)" });
        return isAkwardHeight;
    } else {
        const isAkwardHeight = useMediaQuery({ query: "(max-height: 899px)" });
        return isAkwardHeight;
    }
}

/**
 * Returns whether the user is currently signed in or not.
 *
 * @returns true | false
 */
export function useSignedIn(): true | false {
    return isUserSignedIn();
}

/**
 * Returns whether the user is an admin or not *FOR UI PURPOSES*, when they actually try to do an admin action, the backend will verify, this is
 * just whether to show the UI or not
 * @returns true | false
 */
export function useIsAdmin(): true | false {
    return true;
}

/**
 * Creates a navigation function for a specific route.
 *
 * @param {string} page - The path to navigate to.
 * @returns {() => void} A function that, when called, navigates to the specified page.
 *
 * @example
 * const goToSignUp = useGoToPage("/signup");
 * goToSignup();
 */
export function useGoToPage(page: string) {
    const navigate = useNavigate();

    const goToPage = () => {
        navigate(page);
    };

    return goToPage;
}

/**
 * Returns whether the current theme is light mode or not
 * @returns true | false
 */
export function useIsLightMode(): true | false {
    return useSettings((state) => state.isLightMode);
}

export function useStartTheme() {
    const rootStyle = document.documentElement.style;
    if (useIsLightMode()) {
        rootStyle.setProperty("--white", "#ffffff");
        rootStyle.setProperty("--black", "#000000");
        rootStyle.setProperty("--text-color-light", "#e3e3e3");
        rootStyle.setProperty("--text-color-dark", "#070700");
        rootStyle.setProperty("--clr-primary-a0", "#eb0000");
        rootStyle.setProperty("--clr-primary-a10", "#cc3600");
        rootStyle.setProperty("--clr-primary-a20", "#ae2d00");
        rootStyle.setProperty("--clr-primary-a30", "#912400");
        rootStyle.setProperty("--clr-primary-a40", "#751b00");
        rootStyle.setProperty("--clr-primary-a50", "#5b1300");
        rootStyle.setProperty("--clr-surface-a0", "#f8f8ff");
        rootStyle.setProperty("--clr-surface-a10", "#ebebf2");
        rootStyle.setProperty("--clr-surface-a20", "#dfdfe4");
        rootStyle.setProperty("--clr-surface-a30", "#d3d3d7");
        rootStyle.setProperty("--clr-surface-a40", "#c6c6ca");
        rootStyle.setProperty("--clr-surface-a50", "#bababe");
        rootStyle.setProperty("--clr-surface-tonal-a0", "#fae8e9");
        rootStyle.setProperty("--clr-surface-tonal-a10", "#edddde");
        rootStyle.setProperty("--clr-surface-tonal-a20", "#e0d2d3");
        rootStyle.setProperty("--clr-surface-tonal-a30", "#d4c8c8");
        rootStyle.setProperty("--clr-surface-tonal-a40", "#c8bdbe");
        rootStyle.setProperty("--clr-surface-tonal-a50", "#bbb3b3");
        rootStyle.setProperty("--clr-success-a0", "#4aff6b");
        rootStyle.setProperty("--clr-success-a10", "#74ff86");
        rootStyle.setProperty("--clr-success-a20", "#94ff9d");
        rootStyle.setProperty("--clr-warning-a0", "#ffac38");
        rootStyle.setProperty("--clr-warning-a10", "#ffb961");
        rootStyle.setProperty("--clr-warning-a20", "#ffc681");
        rootStyle.setProperty("--clr-danger-a0", "#ff6161");
        rootStyle.setProperty("--clr-danger-a10", "#ff7c79");
        rootStyle.setProperty("--clr-danger-a20", "#ff9590");
        rootStyle.setProperty("--clr-info-a0", "#61c2ff");
        rootStyle.setProperty("--clr-info-a10", "#7dccff");
        rootStyle.setProperty("--clr-info-a20", "#96d5ff");
        rootStyle.setProperty("--clr-red-alliance", "#f7bcb7");
        rootStyle.setProperty("--clr-blue-alliance", "#b7dcfa");
    } else {
        rootStyle.setProperty("--black", "#ffffff");
        rootStyle.setProperty("--white", "#000000");
        rootStyle.setProperty("--text-color-dark", "#e3e3e3");
        rootStyle.setProperty("--text-color-light", "#070700");
        rootStyle.setProperty("--clr-primary-a0", "#eb4000");
        rootStyle.setProperty("--clr-primary-a10", "#f05a31");
        rootStyle.setProperty("--clr-primary-a20", "#f56f4d");
        rootStyle.setProperty("--clr-primary-a30", "#f88364");
        rootStyle.setProperty("--clr-primary-a40", "#fc967b");
        rootStyle.setProperty("--clr-primary-a50", "#fea891");
        rootStyle.setProperty("--clr-surface-a0", "#121212");
        rootStyle.setProperty("--clr-surface-a10", "#252525");
        rootStyle.setProperty("--clr-surface-a20", "#393939");
        rootStyle.setProperty("--clr-surface-a30", "#4f4f4f");
        rootStyle.setProperty("--clr-surface-a40", "#666");
        rootStyle.setProperty("--clr-surface-a50", "#7d7d7d");
        rootStyle.setProperty("--clr-surface-tonal-a0", "#251915");
        rootStyle.setProperty("--clr-surface-tonal-a10", "#382c28");
        rootStyle.setProperty("--clr-surface-tonal-a20", "#4b403c");
        rootStyle.setProperty("--clr-surface-tonal-a30", "#5f5552");
        rootStyle.setProperty("--clr-surface-tonal-a40", "#746b68");
        rootStyle.setProperty("--clr-surface-tonal-a50", "#8a8280");
        rootStyle.setProperty("--clr-success-a0", "#4aff6b");
        rootStyle.setProperty("--clr-success-a10", "#80ff8e");
        rootStyle.setProperty("--clr-success-a20", "#a6ffac");
        rootStyle.setProperty("--clr-warning-a0", "#ffac38");
        rootStyle.setProperty("--clr-warning-a10", "#ffbe6c");
        rootStyle.setProperty("--clr-warning-a20", "#ffcf94");
        rootStyle.setProperty("--clr-danger-a0", "#ff6161");
        rootStyle.setProperty("--clr-danger-a10", "#ff8580");
        rootStyle.setProperty("--clr-danger-a20", "#ffa5a0");
        rootStyle.setProperty("--clr-info-a0", "#61c2ff");
        rootStyle.setProperty("--clr-info-a10", "#85cfff");
        rootStyle.setProperty("--clr-info-a20", "#a5dbff");
        // These colors are in here in case we ever choose to switch the dark mode alliance colors, not exactly sure which shades are best
        // rootStyle.setProperty("--clr-red-alliance", "#644846");
        // rootStyle.setProperty("--clr-blue-alliance", "#425666");
        rootStyle.setProperty("--clr-red-alliance", "#542d2d");
        rootStyle.setProperty("--clr-blue-alliance", "#28374e");
    }
}

/**
 * Flips current theme, if dark mode, it switches to light, and vice versa
 */
export function useFlipTheme() {
    const rootStyle = document.documentElement.style;
    if (useIsLightMode()) {
        rootStyle.setProperty("--white", "#ffffff");
        rootStyle.setProperty("--black", "#000000");
        rootStyle.setProperty("--text-color-light", "#e3e3e3");
        rootStyle.setProperty("--text-color-dark", "#070700");
        rootStyle.setProperty("--clr-primary-a0", "#eb0000");
        rootStyle.setProperty("--clr-primary-a10", "#cc3600");
        rootStyle.setProperty("--clr-primary-a20", "#ae2d00");
        rootStyle.setProperty("--clr-primary-a30", "#912400");
        rootStyle.setProperty("--clr-primary-a40", "#751b00");
        rootStyle.setProperty("--clr-primary-a50", "#5b1300");
        rootStyle.setProperty("--clr-surface-a0", "#f8f8ff");
        rootStyle.setProperty("--clr-surface-a10", "#ebebf2");
        rootStyle.setProperty("--clr-surface-a20", "#dfdfe4");
        rootStyle.setProperty("--clr-surface-a30", "#d3d3d7");
        rootStyle.setProperty("--clr-surface-a40", "#c6c6ca");
        rootStyle.setProperty("--clr-surface-a50", "#bababe");
        rootStyle.setProperty("--clr-surface-tonal-a0", "#fae8e9");
        rootStyle.setProperty("--clr-surface-tonal-a10", "#edddde");
        rootStyle.setProperty("--clr-surface-tonal-a20", "#e0d2d3");
        rootStyle.setProperty("--clr-surface-tonal-a30", "#d4c8c8");
        rootStyle.setProperty("--clr-surface-tonal-a40", "#c8bdbe");
        rootStyle.setProperty("--clr-surface-tonal-a50", "#bbb3b3");
        rootStyle.setProperty("--clr-success-a0", "#4aff6b");
        rootStyle.setProperty("--clr-success-a10", "#74ff86");
        rootStyle.setProperty("--clr-success-a20", "#94ff9d");
        rootStyle.setProperty("--clr-warning-a0", "#ffac38");
        rootStyle.setProperty("--clr-warning-a10", "#ffb961");
        rootStyle.setProperty("--clr-warning-a20", "#ffc681");
        rootStyle.setProperty("--clr-danger-a0", "#ff6161");
        rootStyle.setProperty("--clr-danger-a10", "#ff7c79");
        rootStyle.setProperty("--clr-danger-a20", "#ff9590");
        rootStyle.setProperty("--clr-info-a0", "#61c2ff");
        rootStyle.setProperty("--clr-info-a10", "#7dccff");
        rootStyle.setProperty("--clr-info-a20", "#96d5ff");
        rootStyle.setProperty("--clr-red-alliance", "#f7bcb7");
        rootStyle.setProperty("--clr-blue-alliance", "#b7dcfa");
    } else {
        rootStyle.setProperty("--black", "#ffffff");
        rootStyle.setProperty("--white", "#000000");
        rootStyle.setProperty("--text-color-dark", "#e3e3e3");
        rootStyle.setProperty("--text-color-light", "#070700");
        rootStyle.setProperty("--clr-primary-a0", "#eb4000");
        rootStyle.setProperty("--clr-primary-a10", "#f05a31");
        rootStyle.setProperty("--clr-primary-a20", "#f56f4d");
        rootStyle.setProperty("--clr-primary-a30", "#f88364");
        rootStyle.setProperty("--clr-primary-a40", "#fc967b");
        rootStyle.setProperty("--clr-primary-a50", "#fea891");
        rootStyle.setProperty("--clr-surface-a0", "#121212");
        rootStyle.setProperty("--clr-surface-a10", "#252525");
        rootStyle.setProperty("--clr-surface-a20", "#393939");
        rootStyle.setProperty("--clr-surface-a30", "#4f4f4f");
        rootStyle.setProperty("--clr-surface-a40", "#666");
        rootStyle.setProperty("--clr-surface-a50", "#7d7d7d");
        rootStyle.setProperty("--clr-surface-tonal-a0", "#251915");
        rootStyle.setProperty("--clr-surface-tonal-a10", "#382c28");
        rootStyle.setProperty("--clr-surface-tonal-a20", "#4b403c");
        rootStyle.setProperty("--clr-surface-tonal-a30", "#5f5552");
        rootStyle.setProperty("--clr-surface-tonal-a40", "#746b68");
        rootStyle.setProperty("--clr-surface-tonal-a50", "#8a8280");
        rootStyle.setProperty("--clr-success-a0", "#4aff6b");
        rootStyle.setProperty("--clr-success-a10", "#80ff8e");
        rootStyle.setProperty("--clr-success-a20", "#a6ffac");
        rootStyle.setProperty("--clr-warning-a0", "#ffac38");
        rootStyle.setProperty("--clr-warning-a10", "#ffbe6c");
        rootStyle.setProperty("--clr-warning-a20", "#ffcf94");
        rootStyle.setProperty("--clr-danger-a0", "#ff6161");
        rootStyle.setProperty("--clr-danger-a10", "#ff8580");
        rootStyle.setProperty("--clr-danger-a20", "#ffa5a0");
        rootStyle.setProperty("--clr-info-a0", "#61c2ff");
        rootStyle.setProperty("--clr-info-a10", "#85cfff");
        rootStyle.setProperty("--clr-info-a20", "#a5dbff");
        // These colors are in here in case we ever choose to switch the dark mode alliance colors, not exactly sure which shades are best
        // rootStyle.setProperty("--clr-red-alliance", "#644846");
        // rootStyle.setProperty("--clr-blue-alliance", "#425666");
        rootStyle.setProperty("--clr-red-alliance", "#542d2d");
        rootStyle.setProperty("--clr-blue-alliance", "#28374e");
    }
    return useSettings((state) => state.flipTheme);
}

/**
 * Returns whether currently specifying country for custom teams or not
 * @returns true | false
 */
export function useSpecifyCustomCountry(): true | false {
    return useSettings((state) => state.isCustomCountry);
}

export function flipCustomCountry() {
    return useSettings((state) => state.flipCustomCountry);
}
